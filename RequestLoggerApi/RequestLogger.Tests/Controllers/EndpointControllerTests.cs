using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RequestLogger.Controllers;
using RequestLogger.Domain.Services;
using RequestLogger.Dtos;
using RequestLogger.Infrastructure.Data;
using System.Threading.Tasks;
using Moq;
using RequestLogger.Tests.Utils;
using Endpoint = RequestLogger.Domain.Entities.Endpoint;

namespace RequestLogger.Tests.Controllers
{
    [TestClass]
    public class EndpointControllerTests
    {
        private EndpointService _service;
        private EndpointController _controller;

        [TestInitialize]
        public void TestInitialize()
        {
            var repository = new InMemoryEndpointRepository();
            _service = new EndpointService(repository);
            _controller = new EndpointController(_service);
        }

        [TestMethod]
        public async Task RegisterEndpoint_Success()
        {
            var dto = new EndpointDto
            {
                Body = "body",
                Method = "GET",
                Route = "/route",
                StatusCode = 201
            };

            var result = await _controller.RegisterEndpoint(dto);
            var cast = (CreatedAtActionResult) result;
            cast.ActionName.Should().Be(nameof(_controller.GetEndpoint));
            cast.RouteValues["route"].Should().Be("/route");
            cast.RouteValues["method"].Should().Be(HttpMethod.Get);
        }

        [TestMethod]
        [DataRow("",200,"","")] // Method should not be empty
        [DataRow("/",200,"","ME THOD")] // Method should not contain spaces
        [DataRow("",5151,"","GET")] // Status code does not exist
        [DataRow("/ invalid route", 200, "", "GET")] // Routes should not have spaces
        public async Task RegisterEndpoint_BadRequest(string route, int statusCode, string body, string method)
        {
            var dto = new EndpointDto
            {
                Body = body,
                Method = method,
                Route = route,
                StatusCode = statusCode
            };

            var result = await _controller.RegisterEndpoint(dto);
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [TestMethod]
        public async Task RegisterEndpoint_Duplicate()
        {
            var dto = new EndpointDto
            {
                Body = "content",
                Method = "GET",
                Route = "/route",
                StatusCode = 200
            };

            await _controller.RegisterEndpoint(dto);
            var result = await _controller.RegisterEndpoint(dto);

            result.Should().BeOfType<ConflictObjectResult>();
        }

        [TestMethod]
        public async Task GetEndpoint_Success()
        {
            var endpoint = new Endpoint
            {
                Route = "/route/1",
                Method = HttpMethod.Get
            };
            await _service.RegisterEndpoint(endpoint);

            var result = await _controller.GetEndpoint("/route/1", "get");

            result.Value.Route.Should().Be("/route/1");
            result.Value.Method.Should().Be("GET");
        }

        [TestMethod]
        public async Task GetEndpoint_NotFound()
        {
            var result = await _controller.GetEndpoint("/route/1", "get");

            result.Result.Should().BeOfType(typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task Import_Success()
        {
            var dtos = new List<EndpointDto>
            {
                new()
                {
                    Body = "content",
                    Method = "GET",
                    Route = "/route1",
                    StatusCode = 200
                },
                new()
                {
                    Body = "content",
                    Method = "GET",
                    Route = "/route2",
                    StatusCode = 200
                }
            };

            var result = await _controller.Import(dtos);

            result.Value.Message.Should().Be("Import successful");
        }

        [TestMethod]
        public async Task Import_Duplicate()
        {
            var dtos = new List<EndpointDto>
            {
                new()
                {
                    Body = "content",
                    Method = "GET",
                    Route = "/route",
                    StatusCode = 200
                },
                new()
                {
                    Body = "content",
                    Method = "GET",
                    Route = "/route",
                    StatusCode = 200
                }
            };

            var resultValue = (await _controller.Import(dtos)).Value;

            resultValue.Message.Should().Be("Error(s) occured during the import");
            var error = resultValue.Errors.Single();
            error.Route.Should().Be("/route");
            error.Method.Should().Be("GET");
            error.Message.Should().Be("Operation already declared");
        }

        [TestMethod]
        public async Task GetEndpoints_Empty()
        {
            var result = await _controller.GetEndpoints();

            result.Value.Should().BeEmpty();
        }

        [TestMethod]
        public async Task GetEndpoints_MultipleElements()
        {
            _controller.InjectDefaultHttpContext();
            _controller.MockUrlHelper();
            _controller.HttpContext.Request.PathBase = "";

            await _controller.RegisterEndpoint(new EndpointDto
            {
                Body = "body",
                Method = "GET",
                Route = "/route",
                StatusCode = 200
            });

            await _controller.RegisterEndpoint(new EndpointDto
            {
                Body = "body",
                Method = "GET",
                Route = "/route2",
                StatusCode = 200
            });

            var result = await _controller.GetEndpoints();

            result.Value.Count.Should().Be(2);
        }

        [TestMethod]
        public async Task ClearAllEndpoints()
        {
            var result = await _controller.ClearAllEndpoints();

            result.Should().BeOfType<OkResult>();
        }

        [TestMethod]
        public async Task CreateOrUpdateEndpoint_Success()
        {
            var dto = new EndpointDto{
                Route = "/test",
                Method = "get",
                StatusCode = 200
            };
            await _controller.RegisterEndpoint(dto);

            var newDto = new EndpointDto{
                StatusCode = 200,
                Body = "new body"
            };
            var result = await _controller.CreateOrUpdateEndpoint("%2Ftest", "get", newDto);

            result.Should().BeOfType<NoContentResult>();
            var updated = (await _controller.GetEndpoint(dto.Route, dto.Method)).Value;
            updated.Body.Should().Be("new body");
        }

        [TestMethod]
        public async Task CreateOrUpdateEndpoint_BadRequest_Exception()
        {
            await TestBadRequest<InvalidOperationException>();
            await TestBadRequest<ArgumentException>();
        }

        private async Task TestBadRequest<T>() where T : Exception
        {
            var mock = new Mock<IEndpointService>();
            mock.Setup(s => s.UpdateEndpoint(It.IsAny<Endpoint>())).ThrowsAsync((T)Activator.CreateInstance(typeof(T), "error message"));
            mock.Setup(s => s.GetEndpoint(It.IsAny<string>(), It.IsAny<HttpMethod>())).ReturnsAsync(new Endpoint());
            var controller = new EndpointController(mock.Object);

            var dto = CreateEndpointDto();
            var result = await controller.CreateOrUpdateEndpoint(dto.Route, dto.Method, dto);

            var castResult = (BadRequestObjectResult)result;
            castResult.Value = "error message";
        }

        private EndpointDto CreateEndpointDto()
        {
            return new EndpointDto
            {
                Route = "/route",
                Method = "get",
                StatusCode = 200
            };
        }
    }
}

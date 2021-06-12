using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RequestLogger.Controllers;
using RequestLogger.Domain.Services;
using RequestLogger.Dtos;
using RequestLogger.Infrastructure.Data;
using System.Threading.Tasks;

namespace RequestLogger.Tests.Controllers
{
    [TestClass]
    public class EndpointControllerTests
    {
        private EndpointController _controller;

        [TestInitialize]
        public void TestInitialize()
        {
            var repository = new InMemoryEndpointRepository();
            var service = new EndpointService(repository);
            _controller = new EndpointController(service);
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
            result.Should().BeOfType<OkResult>();
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
        public async Task Import_Success()
        {
            var dtos = new List<EndpointDto>
            {
                new EndpointDto
                {
                    Body = "content",
                    Method = "GET",
                    Route = "/route1",
                    StatusCode = 200
                },
                new EndpointDto
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
                new EndpointDto
                {
                    Body = "content",
                    Method = "GET",
                    Route = "/route",
                    StatusCode = 200
                },
                new EndpointDto
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
    }
}

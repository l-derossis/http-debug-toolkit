using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Services;
using RequestLogger.Hubs;
using RequestLogger.Infrastructure.Data;
using Endpoint = RequestLogger.Domain.Entities.Endpoint;

namespace RequestLogger.Tests.Controllers
{
    [TestClass]
    public class GenericControllerTests
    {
        [TestMethod]
        [DataRow("/route1", "GET")]
        [DataRow("/route2", "POST")]
        public async Task GenericEndpoint_DefaultEndpoint(string route, string method)
        {
            var context = new DefaultHttpContext();
            context.Request.Path = route;
            context.Request.Method = method;
            var controller = BuildController(context);

            var result = await controller.GenericResult() as ObjectResult;
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(200);
            result.Value.Should().Be(string.Empty);
        }

        [TestMethod]
        public async Task GenericEndpoint_CustomEndpoint()
        {
            var endpoint = new Endpoint
            {
                Body = "content",
                Method = new HttpMethod("GET"),
                Route = "/route",
                StatusCode = HttpStatusCode.Accepted
            };
            var repository = new InMemoryEndpointRepository();
            await repository.RegisterEndpoint(endpoint);

            var context = new DefaultHttpContext();
            context.Request.Path = "/route";
            context.Request.Method = "GET";
            var controller = BuildController(context, repository);

            var result = await controller.GenericResult() as ObjectResult;
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(202);
            result.Value.Should().Be("content");
        }

        [TestMethod]
        public async Task GenericEndpoint_EmptyBody()
        {
            var endpoint = new Endpoint
            {
                Method = new HttpMethod("GET"),
                Route = "/route",
                Body = null,
                StatusCode = HttpStatusCode.OK
            };
            var repository = new InMemoryEndpointRepository();
            await repository.RegisterEndpoint(endpoint);

            var context = new DefaultHttpContext();
            context.Request.Path = "/route";
            context.Request.Method = "GET";
            var controller = BuildController(context, repository);

            var result = await controller.GenericResult() as ObjectResult;
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(200);
            result.Value.Should().Be(null);
        }

        private RequestLogger.Controllers.GenericController BuildController(DefaultHttpContext context, InMemoryEndpointRepository repo = null)
        {
            var repository = repo ?? new InMemoryEndpointRepository();
            var service = new EndpointService(repository);
            var signalRMoq = Mock.Of<IHubContext<RequestsHub>>();
            
            Mock.Get(signalRMoq).Setup(m => m.Clients.All.SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), It.IsAny<CancellationToken>()));
            
            var controllerContext = new ControllerContext
            {
                HttpContext = context
            };

            var controller = new RequestLogger.Controllers.GenericController(signalRMoq, service)
            {
                ControllerContext = controllerContext
            };

            return controller;
        }
    }
}

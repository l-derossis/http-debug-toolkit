using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RequestLogger.Domain.Entities;
using RequestLogger.Infrastructure.Data;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace RequestLogger.Tests.Data
{
    [TestClass]
    public class InMemoryEndpointRepositoryTests
    {
        private readonly InMemoryEndpointRepository _repository = new InMemoryEndpointRepository();

        [TestMethod]
        public async Task RegisterEndpoints_Single_Success()
        {
            const string route = "/route";
            var method = HttpMethod.Get;

            var endpoint = CreateEndpoint(route, method);
            await _repository.RegisterEndpoint(endpoint);

            var saved = await _repository.GetEndpoint(method, route);
            saved.Route.Should().Be(route);
            saved.Method.Should().Be(method);
            saved.Id.Should().NotBe(default(string));
        }

        [TestMethod]
        public async Task RegisterEndpoints_Multiple_Success()
        {
            const string route1 = "/route1", route2 = "/route2";
            HttpMethod method1 = HttpMethod.Get, method2 = HttpMethod.Post;
            Endpoint resp1 = CreateEndpoint(route1, method1), resp2 = CreateEndpoint(route2, method2);

            await _repository.RegisterEndpoint(resp1);
            await _repository.RegisterEndpoint(resp2);
            var savedResp1 = await _repository.GetEndpoint(method1, route1);
            var savedResp2 = await _repository.GetEndpoint(method2, route2);

            savedResp1.Route.Should().Be(route1);
            savedResp1.Method.Should().Be(method1);
            savedResp2.Route.Should().Be(route2);
            savedResp2.Route.Should().Be(route2);
            savedResp2.Method.Should().Be(method2);
        }

        [TestMethod]
        public async Task RegisterEndpoint_DeepCopy()
        {
            var endpoint = CreateEndpoint("/original", HttpMethod.Get);

            await _repository.RegisterEndpoint(endpoint);
            endpoint.Route = "/updated";
            var storedEndpoint = (await _repository.GetAllEndpoints()).Single();

            storedEndpoint.Route.Should().Be("/original");
;        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public async Task RegisterEndpoints_Duplicate()
        {
            var resp1 = CreateEndpoint("/route", HttpMethod.Get);
            var resp2 = CreateEndpoint("/route", HttpMethod.Get);
            resp2.Body = "newValue";

            await _repository.RegisterEndpoint(resp1);
            await _repository.RegisterEndpoint(resp2);
            await _repository.GetEndpoint(resp1.Method, resp1.Route);
        }

        

        [TestMethod]
        [DataRow("route", null)]
        [DataRow("route", "")]
        [DataRow(null, "GET")]
        [ExpectedException(typeof(ArgumentException))]
        public async Task GetEndpoint_InvalidArguments(string route, string method)
        {
            await _repository.GetEndpoint(new HttpMethod(method), route);
        }

        [TestMethod]
        public async Task GetEndpoint_NotFound()
        {
            var endpoint = await _repository.GetEndpoint(HttpMethod.Post, "found");

            endpoint.Should().BeNull();
;       }

        [TestMethod]
        public async Task UpdateEndpoint_Success()
        {
            var endpoint = CreateEndpoint("/route", HttpMethod.Get);
            await _repository.RegisterEndpoint(endpoint);

            var registered = (await _repository.GetAllEndpoints()).Single();
            registered.Body = "new content";
            await _repository.UpdateEndpoint(registered);

            var updated = (await _repository.GetAllEndpoints()).Single();
            updated.Body.Should().Be("new content");
        }

        [TestMethod]
        public void UpdateEndpoint_NotFound()
        {
            var endpoint = CreateEndpoint("/route", HttpMethod.Get);
            endpoint.Id = Guid.NewGuid().ToString();

            Func<Task> act = async () => await _repository.UpdateEndpoint(endpoint);
            act.Should().Throw<InvalidOperationException>().WithMessage("No endpoint found with the ID*");
        }

        [TestMethod]
        public void UpdateEndpoint_NoId()
        {
            var endpoint = CreateEndpoint("/route", HttpMethod.Get);

            Func<Task> act = async () => await _repository.UpdateEndpoint(endpoint);
            act.Should().Throw<ArgumentException>().WithMessage("The endpoint does not come from the database context (no ID)");
        }

        [TestMethod]
        [DataRow("/route", "/newRoute", "get", "get")]
        [DataRow("/route", "/route", "get", "post")]
        public async Task UpdateEndpoint_ForbiddenUpdate(string route, string newRoute, string method, string newMethod)
        {
            var endpoint = CreateEndpoint(route, new HttpMethod(method));
            await _repository.RegisterEndpoint(endpoint);

            var registered = (await _repository.GetAllEndpoints()).Single();
            registered.Route = newRoute;
            registered.Method = new HttpMethod(newMethod);
            Func<Task> act = async () => await _repository.UpdateEndpoint(registered);

            act.Should().Throw<ArgumentException>().WithMessage("Route and method cannot be updated.");
        }

        [TestMethod]
        public async Task GetAllEndpoints_Empty()
        {
            var endpoints = await _repository.GetAllEndpoints();

            endpoints.Count.Should().Be(0);
        }

        [TestMethod]
        public async Task GetAllEndpoints()
        {
            var endpoint1 = CreateEndpoint("/route1", HttpMethod.Get);
            var endpoint2 = CreateEndpoint("/route2", HttpMethod.Get);
            await _repository.RegisterEndpoint(endpoint1);
            await _repository.RegisterEndpoint(endpoint2);

            var endpoints = await _repository.GetAllEndpoints();

            endpoints.Count.Should().Be(2);
            endpoints.Should().Contain(r => r.Route == "/route1");
            endpoints.Should().Contain(r => r.Route == "/route2");
        }

        [TestMethod]
        public async Task GetAllEndpoints_DeepCopy()
        {
            var endpoint = CreateEndpoint("/route1", HttpMethod.Get);
            await _repository.RegisterEndpoint(endpoint);

            var endpoints = await _repository.GetAllEndpoints();
            endpoints.First().Route = "/modifiedRoute";

            endpoints = await _repository.GetAllEndpoints();
            endpoints.First().Route.Should().Be("/route1");
        }

        [TestMethod]
        [DataRow(0)]
        [DataRow(1)]
        [DataRow(2)]
        public async Task DeleteAllEndpoints(int count)
        {
            for (var i = 0; i < count; i++)
            {
                await _repository.RegisterEndpoint(new Endpoint()
                {
                    Route = $"/route{i}",
                    Method = HttpMethod.Get,
                    StatusCode = HttpStatusCode.OK
                });
            }

            await _repository.DeleteAllEndpoints();

            var endpoints = await _repository.GetAllEndpoints();
            endpoints.Should().BeEmpty();
        }

        private Endpoint CreateEndpoint(string route, HttpMethod method)
        {
            var endpoint = new Endpoint
            {
                Method = method,
                Route = route,
                StatusCode = HttpStatusCode.OK,
                Body = "default",
            };

            return endpoint;
        }
    }
}

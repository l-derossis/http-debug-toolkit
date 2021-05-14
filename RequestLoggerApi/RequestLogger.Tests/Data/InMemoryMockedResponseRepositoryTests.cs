using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RequestLogger.Domain.Entities;
using RequestLogger.Infrastructure.Data;

namespace RequestLogger.Tests.Data
{
    [TestClass]
    public class InMemoryMockedResponseRepositoryTests
    {
        private readonly InMemoryMockedResponseRepository _repository = new InMemoryMockedResponseRepository();

        [TestMethod]
        public async Task RegisterResponses_Single_Success()
        {
            const string route = "/route";
            var method = HttpMethod.Get;

            var response = CreateResponse(route, method);
            await _repository.RegisterResponses(new List<MockedResponse>{ response });

            var saved = await _repository.GetMockedResponse(method, route);
            saved.Route.Should().Be(route);
            saved.Method.Should().Be(method);
        }

        [TestMethod]
        public async Task RegisterResponses_Multiple_Success()
        {
            const string route1 = "/route1", route2 = "/route2";
            HttpMethod method1 = HttpMethod.Get, method2 = HttpMethod.Post;
            MockedResponse resp1 = CreateResponse(route1, method1), resp2 = CreateResponse(route2, method2);

            await _repository.RegisterResponses(new List<MockedResponse> {resp1, resp2});
            var savedResp1 = await _repository.GetMockedResponse(method1, route1);
            var savedResp2 = await _repository.GetMockedResponse(method2, route2);

            savedResp1.Route.Should().Be(route1);
            savedResp1.Method.Should().Be(method1);
            savedResp2.Route.Should().Be(route2);
            savedResp2.Route.Should().Be(route2);
            savedResp2.Method.Should().Be(method2);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public async Task RegisterResponses_Duplicate()
        {
            var resp1 = CreateResponse("/route", HttpMethod.Get);
            var resp2 = CreateResponse("/route", HttpMethod.Get);
            resp2.Body = "newValue";

            await _repository.RegisterResponses(new List<MockedResponse>{resp1, resp2});
            await _repository.GetMockedResponse(resp1.Method, resp1.Route);
        }

        [TestMethod]
        [DataRow("route", null)]
        [DataRow("route", "")]
        [DataRow(null, "GET")]
        [ExpectedException(typeof(ArgumentException))]
        public async Task GetResponse_InvalidArguments(string route, string method)
        {
            await _repository.GetMockedResponse(new HttpMethod(method), route);
        }

        [TestMethod]
        public async Task GetResponse_NotFound()
        {
            var response = await _repository.GetMockedResponse(HttpMethod.Post, "found");

            response.Should().BeNull();
;       }

        [TestMethod]
        public async Task GetAllResponses_Empty()
        {
            var responses = await _repository.GetAllResponses();

            responses.Count.Should().Be(0);
        }

        [TestMethod]
        public async Task GetAllResponses()
        {
            var response1 = CreateResponse("/route1", HttpMethod.Get);
            var response2 = CreateResponse("/route2", HttpMethod.Get);
            await _repository.RegisterResponses(new List<MockedResponse> {response1, response2});

            var responses = await _repository.GetAllResponses();

            responses.Count.Should().Be(2);
            responses.Should().Contain(r => r.Route == "/route1");
            responses.Should().Contain(r => r.Route == "/route2");
        }

        [TestMethod]
        public async Task GetAllResponses_DeepCopy()
        {
            var response = CreateResponse("/route1", HttpMethod.Get);
            await _repository.RegisterResponses(new List<MockedResponse> { response});

            var responses = await _repository.GetAllResponses();
            responses.First().Route = "/modifiedRoute";

            responses = await _repository.GetAllResponses();
            responses.First().Route.Should().Be("/route1");
        }

        private MockedResponse CreateResponse(string route, HttpMethod method)
        {
            var response = new MockedResponse
            {
                Method = method,
                Route = route,
                StatusCode = HttpStatusCode.OK,
                Body = "default",
            };

            return response;
        }
    }
}

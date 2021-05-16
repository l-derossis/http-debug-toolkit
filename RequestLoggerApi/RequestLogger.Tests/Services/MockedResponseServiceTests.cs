using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Services;
using RequestLogger.Infrastructure.Data;

namespace RequestLogger.Tests.Services
{
    [TestClass]
    public class MockedResponseServiceTests
    {
        private readonly MockedResponseService _service;

        public MockedResponseServiceTests()
        {
            var repository = new InMemoryMockedResponseRepository();
            _service = new MockedResponseService(repository);
        }

        [TestMethod]
        public async Task RegisterResponses_Empty()
        {
            await _service.RegisterMockedResponses(new List<MockedResponse>());

            var responses = await _service.GetResponses();

            responses.Count.Should().Be(0);
        }

        [TestMethod]
        [DataRow("/a")]
        [DataRow("/a", "/b")]
        [DataRow("/a", "/b", "/c")]
        public async Task RegisterResponses_Success(params string[] routes)
        {
            await _service.RegisterMockedResponses(routes.Select(CreateResponse).ToList());

            var responses = await _service.GetResponses();

            responses.Count.Should().Be(routes.Length);
        }

        [TestMethod]
        public async Task RegisterResponses_Duplicate()
        {
            var responses = new List<MockedResponse>
            {
                CreateResponse("/a"),
                CreateResponse("/b"),
                CreateResponse("/b"),
                CreateResponse("/c"),
                CreateResponse("/c"),
                CreateResponse("/d")
            };

            var errors = (await _service.RegisterMockedResponses(responses)).ToList();
            var registeredResponses = await _service.GetResponses();

            errors.Count.Should().Be(2);
            errors.ElementAt(0).Method.Should().Be("GET");
            errors.ElementAt(0).Route.Should().Be("/b");
            errors.ElementAt(1).Method.Should().Be("GET");
            errors.ElementAt(1).Route.Should().Be("/c");

            registeredResponses.Count.Should().Be(4);
        }

        private MockedResponse CreateResponse(string route)
        {
            return new MockedResponse
            {
                Body = "body",
                Method = HttpMethod.Get,
                Route = route,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}

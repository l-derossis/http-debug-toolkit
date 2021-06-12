using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Services;
using RequestLogger.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace RequestLogger.Tests.Services
{
    [TestClass]
    public class EndpointServiceTests
    {
        private readonly EndpointService _service;

        public EndpointServiceTests()
        {
            var repository = new InMemoryEndpointRepository();
            _service = new EndpointService(repository);
        }

        [TestMethod]
        public async Task RegisterEndpoints_Empty()
        {
            await _service.RegisterEndpoints(new List<Endpoint>());

            var endpoints = await _service.GetEndpoints();

            endpoints.Count.Should().Be(0);
        }

        [TestMethod]
        [DataRow("/a")]
        [DataRow("/a", "/b")]
        [DataRow("/a", "/b", "/c")]
        public async Task RegisterEndpoints_Success(params string[] routes)
        {
            await _service.RegisterEndpoints(routes.Select(CreateEndpoint).ToList());

            var endpoints = await _service.GetEndpoints();

            endpoints.Count.Should().Be(routes.Length);
        }

        [TestMethod]
        public async Task RegisterEndpoints_Duplicate()
        {
            var endpoints = new List<Endpoint>
            {
                CreateEndpoint("/a"),
                CreateEndpoint("/b"),
                CreateEndpoint("/b"),
                CreateEndpoint("/c"),
                CreateEndpoint("/c"),
                CreateEndpoint("/d")
            };

            var errors = (await _service.RegisterEndpoints(endpoints)).ToList();
            var registeredEndpoints = await _service.GetEndpoints();

            errors.Count.Should().Be(2);
            errors.ElementAt(0).Method.Should().Be("GET");
            errors.ElementAt(0).Route.Should().Be("/b");
            errors.ElementAt(1).Method.Should().Be("GET");
            errors.ElementAt(1).Route.Should().Be("/c");

            registeredEndpoints.Count.Should().Be(4);
        }

        private Endpoint CreateEndpoint(string route)
        {
            return new Endpoint
            {
                Body = "body",
                Method = HttpMethod.Get,
                Route = route,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}

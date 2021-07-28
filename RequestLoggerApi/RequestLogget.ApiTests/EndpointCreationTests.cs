using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using RequestLogger.Dtos;

namespace RequestLogger.ApiTests
{
    [TestClass]
    public class EndpointCreationTests
    {
        readonly HttpClient _client;
        private static WebApplicationFactory<Startup> _factory;

        [ClassInitialize]
        public static void ClassInit(TestContext testContext)
        {
            _factory = new WebApplicationFactory<Startup>();
        }

        public EndpointCreationTests()
        {
            _client = _factory.CreateClient();
        }

        [TestMethod]
        public async Task CreatedEndpointShouldBeAvailable()
        {
            var dto = new EndpointDto
            {
                Route = "/route",
                Body = "body",
                Headers = new Dictionary<string, string>()
                {
                    {"key", "value"}
                },
                Method = HttpMethod.Get.ToString(),
                StatusCode = 201
            };

            var content = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");
            var postResponse = await _client.PostAsync("/api/configuration/endpoints", content);
            var location = postResponse.Headers.GetValues("Location").Single();

            postResponse.IsSuccessStatusCode.Should().BeTrue();

            var getResponse = await _client.GetAsync(location.Replace("%2F","%252F"));
            getResponse.IsSuccessStatusCode.Should().BeTrue();
            var jsonResult = await getResponse.Content.ReadAsStringAsync();
            var endpoint = JsonConvert.DeserializeObject<EndpointDto>(jsonResult);
            endpoint.Route.Should().Be(dto.Route);
            endpoint.Body.Should().Be(dto.Body);
            endpoint.Method.Should().Be(dto.Method);
            endpoint.StatusCode.Should().Be(dto.StatusCode);
        }
    }
}

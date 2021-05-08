using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.SignalR;
using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Services;
using RequestLogger.Hubs;

namespace RequestLogger.Controllers
{
    [Route("api/generic/")]
    [ApiController]
    public class GenericController : ControllerBase
    {
        private readonly IHubContext<RequestsHub> _hub;
        private readonly MockedResponseService _mockedResponseService;

        public GenericController(IHubContext<RequestsHub> hub, MockedResponseService mockedResponseService)
        {
            _hub = hub ?? throw new ArgumentNullException(nameof(hub));
            _mockedResponseService =
                mockedResponseService ?? throw new ArgumentNullException(nameof(mockedResponseService));
        }

        [HttpOptions]
        [HttpHead]
        [HttpPatch]
        [HttpPut]
        [HttpDelete]
        [HttpPost]
        [HttpGet]
        [Route("{*route}")]

        public async Task<ActionResult> GenericResult()
        {
            var serializedRequest = await SerializeRequest(Request);

            var response = await _mockedResponseService.GetMockedResponse(Request.Path.Value.Replace("/api/generic", ""), new HttpMethod(Request.Method)) ?? new MockedResponse();

            await _hub.Clients.All.SendCoreAsync("request", new []{ serializedRequest });

            foreach (var (key, value) in response.Headers)
            {
                Response.Headers.Add(key, value);
            }

            return StatusCode((int) response.StatusCode, response.Body);
        }

        private async Task<string> SerializeRequest(HttpRequest request)
        {
            var requestContent = new StringBuilder();
            requestContent.AppendLine($"{request.Method} {request.GetDisplayUrl()} {request.Protocol}");
            foreach (var requestHeader in request.Headers)
            {
                requestContent.AppendLine($"{requestHeader.Key}: {requestHeader.Value}");
            }

            var stream = new StreamReader(request.Body);
            var body = await stream.ReadToEndAsync();

            requestContent.AppendLine();
            requestContent.Append(body);

            return requestContent.ToString();
        }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.SignalR;
using RequestLogger.Domain.Services;
using RequestLogger.Hubs;
using Endpoint = RequestLogger.Domain.Entities.Endpoint;

namespace RequestLogger.Controllers
{
    [Route("api/generic/")]
    [ApiController]
    public class GenericController : ControllerBase
    {
        private readonly IHubContext<RequestsHub> _hub;
        private readonly IEndpointService _endpointService;

        public GenericController(IHubContext<RequestsHub> hub, IEndpointService endpointService)
        {
            _hub = hub ?? throw new ArgumentNullException(nameof(hub));
            _endpointService =
                endpointService ?? throw new ArgumentNullException(nameof(endpointService));
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

            var endpoint = await _endpointService.GetEndpoint(Request.Path.Value.Replace("/api/generic", ""), new HttpMethod(Request.Method)) ?? new Endpoint();

            await _hub.Clients.All.SendCoreAsync("request", new []{ serializedRequest });

            foreach (var (key, value) in endpoint.Headers)
            {
                Response.Headers.Add(key, value);
            }

            return StatusCode((int)endpoint.StatusCode, endpoint.Body);
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

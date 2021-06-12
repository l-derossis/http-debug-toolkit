using Microsoft.AspNetCore.Mvc;
using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Services;
using RequestLogger.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RequestLogger.Controllers.Results;

namespace RequestLogger.Controllers
{
    [Route("api/configuration/endpoints")]
    [ApiController]
    public class EndpointController : ControllerBase
    {
        private readonly EndpointService _service;

        public EndpointController(EndpointService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [HttpPost]
        public async Task<ActionResult> RegisterEndpoint([FromBody] EndpointDto dto)
        {
            Endpoint endpoint;

            try
            {
                endpoint = dto.ToEntity();
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
            catch (FormatException e)
            {
                return BadRequest(e.Message);
            }

            try
            {
                await _service.RegisterEndpoint(endpoint);
            }
            catch (InvalidOperationException e)
            {
                return Conflict(e.Message);
            }

            return Ok();
        }

        [HttpPost]
        [Route("import")]
        public async Task<ActionResult<EndpointImportResult>> Import([FromBody] IList<EndpointDto> dtos)
        {
            var endpoints = dtos.Select(dto => dto.ToEntity());

            var errors = (await _service.RegisterEndpoints(endpoints)).ToList();

            if (errors.Any())
            {
                return new EndpointImportResult("Error(s) occured during the import", errors);
            }

            return new EndpointImportResult("Import successful");
        }

        [HttpGet]
        public async Task<ActionResult<IList<EndpointDto>>> GetEndpoints()
        {
            var endpoints = await _service.GetEndpoints();

            var dtos = endpoints.Select(EndpointDto.FromEntity).ToList();

            return dtos;
        }
    }
}

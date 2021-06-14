using Microsoft.AspNetCore.Mvc;
using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Services;
using RequestLogger.Dtos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using RequestLogger.Controllers.Results;

namespace RequestLogger.Controllers
{
    [Route("api/configuration/endpoints")]
    [ApiController]
    public class EndpointController : ControllerBase
    {
        private readonly IEndpointService _service;

        public EndpointController(IEndpointService service)
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

            return CreatedAtAction(nameof(GetEndpoint), new { route = endpoint.Route, method = endpoint.Method}, dto);
        }

        [HttpGet]
        [Route("{route}/{method}")]
        public async Task<ActionResult<EndpointDto>> GetEndpoint(string route, string method)
        {
            // Route needs to be explicitly decoded because Kestrel & IIS omit decoding of '%2F'
            // to avoid tempering with the URL. See https://github.com/aspnet/KestrelHttpServer/issues/124#issuecomment-148787353
            var decodedRoute = System.Web.HttpUtility.UrlDecode(route);

            var endpoint = await _service.GetEndpoint(decodedRoute, new HttpMethod(method));

            if (endpoint == null)
            {
                return NotFound();
            }

            return EndpointDto.FromEntity(endpoint);
        }

        [HttpPut]
        [Route("{route}/{method}")]
        public async Task<ActionResult> CreateOrUpdateEndpoint(string route, string method, [FromBody] EndpointDto dto)
        {
            Endpoint endpoint;

            // Route needs to be explicitly decoded because Kestrel & IIS omit decoding of '%2F'
            // to avoid tempering with the URL. See https://github.com/aspnet/KestrelHttpServer/issues/124#issuecomment-148787353
            var decodedRoute = System.Web.HttpUtility.UrlDecode(route);

            var found = await _service.GetEndpoint(decodedRoute, new HttpMethod(method));

            // Override dto's route & method with the route value because it should not be possible to provide 
            // different ones in the body
            dto.Route = decodedRoute;
            dto.Method = method;

            try
            {
                endpoint = dto.ToEntity();
            }
            catch (Exception e) when (e is ArgumentException || e is FormatException)
            {
                return BadRequest(e.Message);
            }

            // Create the object if it does not already exist
            if (found == null)
            {
                await _service.RegisterEndpoint(endpoint);
                return CreatedAtAction(nameof(GetEndpoint), new { route = endpoint.Route, method = endpoint.Method }, EndpointDto.FromEntity(endpoint));
            }

            try
            {
                endpoint.Route = found.Route;
                endpoint.Method = found.Method;
                endpoint.Id = found.Id;
                await _service.UpdateEndpoint(endpoint);

                return NoContent();
            }
            catch (Exception e) when ( e is InvalidOperationException || e is ArgumentException)
            {
                return BadRequest(e.Message);
            }
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

        [HttpPost]
        [Route("clear")]
        public async Task<ActionResult> ClearAllEndpoints()
        {
            await _service.ClearEndpoints();

            return Ok();
        }
    }
}

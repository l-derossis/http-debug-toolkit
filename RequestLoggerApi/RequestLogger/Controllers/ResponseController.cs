using Microsoft.AspNetCore.Mvc;
using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Services;
using RequestLogger.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RequestLogger.Controllers
{
    [Route("api/configuration/responses")]
    [ApiController]
    public class ResponseController : ControllerBase
    {
        private readonly MockedResponseService _service;

        public ResponseController(MockedResponseService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [HttpPost]
        public async Task<ActionResult> RegisterResponse([FromBody] ResponseDto dto)
        {
            MockedResponse response;

            try
            {
                response = dto.ToEntity();
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
            catch (FormatException e)
            {
                return BadRequest(e.Message);
            }

            await _service.RegisterMockedResponse(new List<MockedResponse>{response});

            return Ok();
        }
    }
}

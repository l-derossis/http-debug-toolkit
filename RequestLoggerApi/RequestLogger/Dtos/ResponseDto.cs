using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using RequestLogger.Domain.Entities;

namespace RequestLogger.Dtos
{
    public class ResponseDto
    {
        public string Route { get; set; }

        public string Method { get; set; }

        public IDictionary<string, string> Headers { get; set; }

        public string Body { get; set; }

        public int? StatusCode { get; set; }

        public MockedResponse ToEntity()
        {
            return new MockedResponse()
            {
                Route = Route,
                Method = new HttpMethod(Method),
                Headers = Headers,
                Body = Body,
                StatusCode = (HttpStatusCode) (StatusCode ?? throw new ArgumentNullException(nameof(StatusCode)))
            };
        }
    }
}

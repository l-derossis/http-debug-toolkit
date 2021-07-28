using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using RequestLogger.Domain.Entities;

namespace RequestLogger.Dtos
{
    public class EndpointDto
    {
        public string Route { get; set; }

        public string Method { get; set; }

        public IDictionary<string, string> Headers { get; set; }

        public string Body { get; set; }

        public int? StatusCode { get; set; }

        public string Location { get; set; }

        public Endpoint ToEntity()
        {
            return new Endpoint
            {
                Route = Route,
                Method = new HttpMethod(Method),
                Headers = Headers,
                Body = Body,
                StatusCode = (HttpStatusCode) (StatusCode ?? throw new ArgumentNullException(nameof(StatusCode)))
            };
        }

        public static EndpointDto FromEntity(Endpoint entity)
        {
            return new EndpointDto
            {
                Body = entity.Body,
                Route = entity.Route,
                StatusCode = (int)entity.StatusCode,
                Headers = entity.Headers,
                Method = entity.Method.Method
            };
        }
    }
}

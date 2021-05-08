using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;

namespace RequestLogger.Domain.Entities
{
    public class MockedResponse
    {
        private string _route;
        public string Route
        {
            get => _route;
            set
            {
                if (value == null)
                {
                    throw new ArgumentNullException(nameof(Route));
                }
                if (!Uri.IsWellFormedUriString(value, UriKind.Relative) || !value.StartsWith('/'))
                {
                    throw new ArgumentException($"Route <{value}> has an invalid format");
                }

                _route = value;
            }
        }

        public HttpMethod Method { get; set; }

        public IDictionary<string, string> Headers { get; set; } = new Dictionary<string, string>();

        public string Body { get; set; } = string.Empty;

        private HttpStatusCode _statusCode = HttpStatusCode.OK;
        public HttpStatusCode StatusCode
        {
            get => _statusCode;
            set
            {
                if (!Enum.IsDefined(typeof(HttpStatusCode), value))
                {
                    throw new ArgumentException($"Invalid status code : {value}");
                }

                _statusCode = value;
            }
        }
    }
}

using System.Collections.Generic;
using RequestLogger.Domain.Errors;

namespace RequestLogger.Controllers.Results
{
    public class ResponseImportResult
    {
        public string Message { get; }

        public List<EndpointDomainError> Errors { get; }

        public ResponseImportResult(string message, List<EndpointDomainError> errors = null)
        {
            Message = message;
            Errors = errors ?? new List<EndpointDomainError>();
        }
    }
}

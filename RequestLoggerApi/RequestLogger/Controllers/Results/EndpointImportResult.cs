using System.Collections.Generic;
using RequestLogger.Domain.Errors;

namespace RequestLogger.Controllers.Results
{
    public class EndpointImportResult
    {
        public string Message { get; }

        public List<EndpointDomainError> Errors { get; }

        public EndpointImportResult(string message, List<EndpointDomainError> errors = null)
        {
            Message = message;
            Errors = errors ?? new List<EndpointDomainError>();
        }
    }
}

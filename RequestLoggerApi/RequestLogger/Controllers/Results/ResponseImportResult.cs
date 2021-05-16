using System.Collections.Generic;
using RequestLogger.Domain.Errors;

namespace RequestLogger.Controllers.Results
{
    public class ResponseImportResult
    {
        public readonly string Message;

        public readonly IList<EndpointDomainError> Errors;

        public ResponseImportResult(string message, IList<EndpointDomainError> errors = null)
        {
            Message = message;
            Errors = errors ?? new List<EndpointDomainError>();
        }
    }
}

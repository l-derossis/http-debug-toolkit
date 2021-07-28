using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Errors;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace RequestLogger.Domain.Services
{
    public interface IEndpointService
    {
        /// <summary>
        /// Get an endpoint.
        /// </summary>
        /// <param name="route">URL matching the endpoint</param>
        /// <param name="method">HTTP method matching the endpoint</param>
        /// <returns>A previously registered endpoint of null if not found</returns>
        Task<Endpoint> GetEndpoint(string route, HttpMethod method);

        /// <summary>
        /// Register a set of endpoints.
        /// </summary>
        /// <param name="endpoint">Enumerable of endpoints to register</param>
        Task RegisterEndpoint(Endpoint endpoint);

        /// <summary>
        /// Register multiple endpoints. Errors do not stop the process, they are all returned as a collection after completion.
        /// </summary>
        /// <param name="endpoints">Endpoints to register</param>
        /// <returns>A list of error</returns>
        Task<IEnumerable<EndpointDomainError>> RegisterEndpoints(IEnumerable<Endpoint> endpoints);

        /// <summary>
        /// Update an endpoint 
        /// </summary>
        /// <param name="endpoint">Endpoint to update containing the new values</param>
        Task UpdateEndpoint(Endpoint endpoint);

        /// <summary>
        /// Get all registered endpoints
        /// </summary>
        /// <returns>A list of endpoints</returns>
        Task<IList<Endpoint>> GetEndpoints();

        /// <summary>
        /// Delete all registered endpoints
        /// </summary>
        Task ClearEndpoints();
    }
}

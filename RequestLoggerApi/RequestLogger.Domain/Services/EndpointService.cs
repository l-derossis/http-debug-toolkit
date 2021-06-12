using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Errors;
using RequestLogger.Domain.Repositories;

namespace RequestLogger.Domain.Services
{
    public class EndpointService
    {
        private readonly IEndpointRepository _repository;

        public EndpointService(IEndpointRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        /// <summary>
        /// Get an endpoint.
        /// </summary>
        /// <param name="route">URL matching the endpoint</param>
        /// <param name="method">HTTP method matching the endpoint</param>
        /// <returns>A previously registered endpoint of null if not found</returns>
        public async Task<Endpoint> GetEndpoint(string route, HttpMethod method)
        {
            return await _repository.GetEndpoint(method, route);
        }

        /// <summary>
        /// Register a set of endpoints.
        /// </summary>
        /// <param name="endpoint">Enumerable of endpoints to register</param>
        public async Task RegisterEndpoint(Endpoint endpoint)
        {
            await _repository.RegisterEndpoint(endpoint);
        }

        /// <summary>
        /// Register multiple endpoints. Errors do not stop the process, they are all returned as a collection after completion.
        /// </summary>
        /// <param name="endpoints">Endpoints to register</param>
        /// <returns>A list of error</returns>
        public async Task<IEnumerable<EndpointDomainError>> RegisterEndpoints(IEnumerable<Endpoint> endpoints)
        {
            var errors = new List<EndpointDomainError>();

            foreach (var endpoint in endpoints)
            {
                try
                {
                    await _repository.RegisterEndpoint(endpoint);
                }
                catch (InvalidOperationException e) when (e.Message.Contains("already exists"))
                {
                    errors.Add(new EndpointDomainError(endpoint.Route, endpoint.Method.ToString(), "Operation already declared"));
                }
            }

            return errors;
        }

        /// <summary>
        /// Get all registered endpoints
        /// </summary>
        /// <returns>A list of endpoints</returns>
        public async Task<IList<Endpoint>> GetEndpoints()
        {
            return await _repository.GetAllEndpoints();
        }

        /// <summary>
        /// Delete all registered endpoints
        /// </summary>
        public async Task ClearEndpoints()
        {
            await _repository.DeleteAllEndpoints();
        }
    }
}

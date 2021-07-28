using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Errors;
using RequestLogger.Domain.Repositories;

namespace RequestLogger.Domain.Services
{
    public class EndpointService : IEndpointService
    {
        private readonly IEndpointRepository _repository;

        public EndpointService(IEndpointRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task<Endpoint> GetEndpoint(string route, HttpMethod method)
        {
            return await _repository.GetEndpoint(method, route);
        }

        public async Task RegisterEndpoint(Endpoint endpoint)
        {
            await _repository.RegisterEndpoint(endpoint);
        }

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

        public async Task UpdateEndpoint(Endpoint endpoint)
        {
            await _repository.UpdateEndpoint(endpoint);
        }

        public async Task<IList<Endpoint>> GetEndpoints()
        {
            return await _repository.GetAllEndpoints();
        }

        public async Task ClearEndpoints()
        {
            await _repository.DeleteAllEndpoints();
        }
    }
}

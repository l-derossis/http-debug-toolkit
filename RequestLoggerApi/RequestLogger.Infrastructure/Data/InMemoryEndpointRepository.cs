using System;
using RequestLogger.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using RequestLogger.Domain.Repositories;

namespace RequestLogger.Infrastructure.Data
{
    public class InMemoryEndpointRepository : IEndpointRepository
    {
        private readonly List<Endpoint> _endpoints = new List<Endpoint>();

        public async Task<Endpoint> GetEndpoint(HttpMethod httpMethod, string route)
        {
            if (route == null)
            {
                throw new ArgumentException($"{nameof(httpMethod)} and {nameof(route)} must have a value");
            }

            await Task.Yield();

            return _endpoints.Find(r => r.Route == route && r.Method == httpMethod);
        }

        public async Task RegisterEndpoint(Endpoint endpoint)
        {
            await Task.Yield();

            var searchedEndpoint =
                _endpoints.Find(r => r.Route == endpoint.Route && r.Method == endpoint.Method);

            if (searchedEndpoint != null)
            {
                throw new InvalidOperationException($"Route {endpoint.Route} already exists");
            }
             
            _endpoints.Add(endpoint);
        }

        public async Task<IList<Endpoint>> GetAllEndpoints()
        {
            await Task.Yield();

            // Create a copy for each element to avoid returning a reference pointing to
            // the original one stored in memory
            return _endpoints.Select(r => new Endpoint
            {
                Body = r.Body,
                Route = r.Route,
                Headers = r.Headers,
                Method = r.Method,
                StatusCode = r.StatusCode
            }).ToList();
        }

        public async Task DeleteAllEndpoints()
        {
            await Task.Yield();

            _endpoints.Clear();
        }
    }
}

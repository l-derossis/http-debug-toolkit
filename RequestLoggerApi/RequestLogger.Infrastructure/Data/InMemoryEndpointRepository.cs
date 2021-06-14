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

        public async Task<Endpoint> GetEndpoint(HttpMethod method, string route)
        {
            if (route == null)
            {
                throw new ArgumentException($"{nameof(method)} and {nameof(route)} must have a value");
            }

            await Task.Yield();

            var found = FindEndpoint(route, method);

            return found == null ? null : new Endpoint(found);
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

            _endpoints.Add(new Endpoint(endpoint)
            {
                Id = Guid.NewGuid().ToString()
            });
        }

        public async Task UpdateEndpoint(Endpoint endpoint)
        {
            await Task.Yield();

            if (endpoint.Id == default)
            {
                throw new ArgumentException("The endpoint does not come from the database context (no ID)");
            }

            var found = FindEndpoint(endpoint.Id);

            if (found == null)
            {
                throw new InvalidOperationException(
                    $"No endpoint found with the ID {endpoint.Id}");
            }

            if (endpoint.Route != found.Route || endpoint.Method != found.Method)
            {
                throw new ArgumentException(
                    "Route and method cannot be updated.");
            }

            _endpoints.Remove(found);
            _endpoints.Add(new Endpoint(endpoint));
        }

        public async Task<IList<Endpoint>> GetAllEndpoints()
        {
            await Task.Yield();

            // Create a copy for each element to avoid returning a reference pointing to
            // the original one stored in memory
            return _endpoints.Select(e => new Endpoint(e)).ToList();
        }

        public async Task DeleteAllEndpoints()
        {
            await Task.Yield();

            _endpoints.Clear();
        }

        private Endpoint FindEndpoint(string route, HttpMethod method)
        {
            return _endpoints.SingleOrDefault(r => r.Route == route && r.Method == method);
        }

        private Endpoint FindEndpoint(string id)
        {
            return _endpoints.SingleOrDefault(r => r.Id == id);
        }
    }
}

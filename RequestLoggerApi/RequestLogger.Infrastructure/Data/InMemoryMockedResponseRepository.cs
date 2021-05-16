using System;
using RequestLogger.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using RequestLogger.Domain.Repositories;

namespace RequestLogger.Infrastructure.Data
{
    public class InMemoryMockedResponseRepository : IMockedResponseRepository
    {
        private readonly List<MockedResponse> _responses = new List<MockedResponse>();

        public async Task<MockedResponse> GetMockedResponse(HttpMethod httpMethod, string route)
        {
            if (route == null)
            {
                throw new ArgumentException($"{nameof(httpMethod)} and {nameof(route)} must have a value");
            }

            await Task.Yield();

            return _responses.Find(r => r.Route == route && r.Method == httpMethod);
        }

        public async Task RegisterResponse(MockedResponse response)
        {
            var searchedResponse =
                _responses.Find(r => r.Route == response.Route && r.Method == response.Method);

            if (searchedResponse != null)
            {
                throw new InvalidOperationException($"Route {response.Route} already exists");
            }
             
            _responses.Add(response);
        }

        public async Task<IList<MockedResponse>> GetAllResponses()
        {
            return _responses.Select(r => new MockedResponse()
            {
                Body = r.Body,
                Route = r.Route,
                Headers = r.Headers,
                Method = r.Method,
                StatusCode = r.StatusCode
            }).ToList();
        }
    }
}

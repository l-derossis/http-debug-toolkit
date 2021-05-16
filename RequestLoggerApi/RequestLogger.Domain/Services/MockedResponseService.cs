using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using RequestLogger.Domain.Entities;
using RequestLogger.Domain.Errors;
using RequestLogger.Domain.Repositories;

namespace RequestLogger.Domain.Services
{
    public class MockedResponseService
    {
        private readonly IMockedResponseRepository _repository;

        public MockedResponseService(IMockedResponseRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        /// <summary>
        /// Get a mocked response.
        /// </summary>
        /// <param name="route">URL matching the mocked response</param>
        /// <param name="method">HTTP method matching the mocked response</param>
        /// <returns>A previously registered mocked response of null if not found</returns>
        public async Task<MockedResponse> GetMockedResponse(string route, HttpMethod method)
        {
            var response = await _repository.GetMockedResponse(method, route);

            return response;
        }

        /// <summary>
        /// Register a set of mocked responses.
        /// </summary>
        /// <param name="response">Enumerable of responses to register</param>
        public async Task RegisterMockedResponse(MockedResponse response)
        {
            await _repository.RegisterResponse(response);
        }

        /// <summary>
        /// Register multiple responses. Errors do not stop the process, they are all returned as a collection after completion.
        /// </summary>
        /// <param name="responses">Responses to register</param>
        /// <returns>A list of error</returns>
        public async Task<IEnumerable<EndpointDomainError>> RegisterMockedResponses(IEnumerable<MockedResponse> responses)
        {
            var errors = new List<EndpointDomainError>();

            foreach (var response in responses)
            {
                try
                {
                    await _repository.RegisterResponse(response);
                }
                catch (InvalidOperationException e) when (e.Message.Contains("already exists"))
                {
                    errors.Add(new EndpointDomainError(response.Route, response.Method.ToString(), "Operation already declared"));
                }
            }

            return errors;
        }

        /// <summary>
        /// Get all registered mocked responses
        /// </summary>
        /// <returns>A list of mocked responses</returns>
        public async Task<IList<MockedResponse>> GetResponses()
        {
            return await _repository.GetAllResponses();
        }
    }
}

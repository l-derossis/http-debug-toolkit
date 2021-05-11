using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using RequestLogger.Domain.Entities;
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
        /// Register a set of mocked responses. Register a response to an already registered route & method will override the existing value.
        /// </summary>
        /// <param name="responses">Enumerable of responses to register</param>
        /// <returns></returns>
        public async Task RegisterMockedResponse(IEnumerable<MockedResponse> responses)
        {
            await _repository.RegisterResponses(responses);
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

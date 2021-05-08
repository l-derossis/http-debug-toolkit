using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using RequestLogger.Domain.Entities;

namespace RequestLogger.Domain.Repositories
{
    public interface IMockedResponseRepository
    {
        Task<MockedResponse> GetMockedResponse(HttpMethod httpMethod, string route);

        Task RegisterResponses(IEnumerable<MockedResponse> responses);
    }
}

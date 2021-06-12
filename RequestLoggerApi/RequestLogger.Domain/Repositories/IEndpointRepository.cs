using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using RequestLogger.Domain.Entities;

namespace RequestLogger.Domain.Repositories
{
    public interface IEndpointRepository
    {
        Task<Endpoint> GetEndpoint(HttpMethod httpMethod, string route);

        Task RegisterEndpoint(Endpoint endpoint);

        Task<IList<Endpoint>> GetAllEndpoints();
    }
}

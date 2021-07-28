using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using RequestLogger.Domain.Entities;

namespace RequestLogger.Domain.Repositories
{
    public interface IEndpointRepository
    {
        Task<Endpoint> GetEndpoint(HttpMethod method, string route);

        Task RegisterEndpoint(Endpoint endpoint);

        Task UpdateEndpoint(Endpoint endpoint);

        Task<IList<Endpoint>> GetAllEndpoints();

        Task DeleteAllEndpoints();
    }
}

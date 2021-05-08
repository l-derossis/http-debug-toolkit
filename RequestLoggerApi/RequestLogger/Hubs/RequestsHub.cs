using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace RequestLogger.Hubs
{
    public class RequestsHub : Hub
    {
        public async Task SendSerializedRequest(string user, string serializedRequest)
        {
            await Clients.All.SendAsync("request", user, serializedRequest);
        }
    }
}

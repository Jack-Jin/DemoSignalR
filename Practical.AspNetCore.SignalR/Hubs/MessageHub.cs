using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Practical.AspNetCore.SignalR.Hubs
{
    public class MessageHub: Hub
    {
        public async Task SendMessageToAll(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendMessageToCaller(string user, string message)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendMessageToUser(string connectionId, string user, string message)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveMessage", user, message);
        }

        public Task JoinGroup(string group)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, group);
        }

        public async Task SendMessageToGroup(string group, string user, string message)
        {
            await Clients.Group(group).SendAsync("ReceiveMessage", user, message);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("UserConnected", Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
    }
}

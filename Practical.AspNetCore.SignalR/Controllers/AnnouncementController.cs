using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Practical.AspNetCore.SignalR.Hubs;

namespace Practical.AspNetCore.SignalR
{
    public class AnnouncementController : Controller
    {
        private IHubContext<MessageHub> _hubContext;

        public AnnouncementController(IHubContext<MessageHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet]
        [Route("/announcement")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("/announcement")]
        public async Task<IActionResult> Post([FromForm] string message)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Controller", message);
            return RedirectToAction("Index");
        }
    }
}


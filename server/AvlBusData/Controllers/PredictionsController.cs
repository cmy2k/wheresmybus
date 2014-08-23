using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Results;
using NextBus.NET.ApiCommands;
using NextBus.NET.Entities;

namespace AvlBusData.Controllers
{
    [EnableCors(origins:"*", headers: "*", methods: "*")]
    public class PredictionsController : ApiController
    {
        public JsonResult<Predictions> Get(string routeName, string stopName)
        {
            var stop = Data.GetStop(routeName, stopName);
            var route = Data.Routes.Values.First(r => r.Title.Equals(routeName, StringComparison.OrdinalIgnoreCase));

            var command = new PredictionsCommand(route.Tag, stop.Tag);
            try
            {
                var predictions = command.Execute();
                return Json(predictions, Data.JsonSettings);
            }
            catch (Exception)
            {
                return Json(new Predictions(), Data.JsonSettings);
            }
        }
    }
}
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Results;

namespace AvlBusData.Controllers
{
    [EnableCors(origins:"*", headers: "*", methods: "*")]
    public class RouteColorsController : ApiController
    {
        public JsonResult<Dictionary<string, string>> Get()
        {
            return Json(Data.Routes.ToDictionary(x => x.Value.Title, x => x.Value.ColorHex), Data.JsonSettings);
        }
    }
}
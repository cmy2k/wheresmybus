using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Results;
using NextBus.NET.Entities;

namespace AvlBusData.Controllers
{
    [EnableCors(origins:"*", headers: "*", methods: "*")]
    public class RoutesController : ApiController
    {
        public JsonResult<List<Route>> Get()
        {
            return Json(Data.Routes.Values.ToList(), Data.JsonSettings);
        }
    }
}
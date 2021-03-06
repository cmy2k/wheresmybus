﻿using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Results;
using NextBus.NET.ApiCommands;

namespace AvlBusData.Controllers
{
    [EnableCors(origins:"*", headers: "*", methods: "*")]
    public class LocationsController : ApiController
    {
        public JsonResult<List<VehicleLocation>> Get()
        {
            return Json(Data.Locations.Locations, Data.JsonSettings);
        }
    }
}
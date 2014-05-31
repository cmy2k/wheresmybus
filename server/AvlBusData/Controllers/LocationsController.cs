using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Results;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NextBus.NET;
using NextBus.NET.ApiCommands;
using NextBus.NET.Entities;

namespace AvlBusData.Controllers
{
    [EnableCors(origins:"*", headers: "*", methods: "*")]
    public class LocationsController : ApiController
    {
        private static VehicleLocations _locations;
        private static Dictionary<string, Route> _routes = new Dictionary<string, Route>();

        private static readonly JsonSerializerSettings _jsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            Formatting = Formatting.Indented
        };

        public LocationsController()
        {
            NextBusApi.AgencyTag = "art";
        }

        public JsonResult<List<VehicleLocation>> Get()
        {
            if (!_routes.Any())
            {
                var command = new RouteListCommand();
                try
                {
                    var routes = command.Execute().Result;
                    _routes = routes.ToDictionary(r => r.Tag);
                }
                catch
                {
                    return Json(new List<VehicleLocation>());
                }
            }

            List<VehicleLocation> locations;
            if (_locations == null || (_locations.LastTimeUtc - DateTime.UtcNow) > TimeSpan.FromSeconds(10))
            {
                var command = new VehicleLocationsCommand();
                try
                {
                    locations = command.Execute().Result.Locations;
                    locations.ForEach(l => l.RouteTitle = _routes[l.RouteTag].Title);
                }
                catch (Exception)
                {
                    return Json(new List<VehicleLocation>());
                }
            }
            else
            {
                locations = _locations.Locations;
            }

            return Json(locations, _jsonSettings);
        }
    }
}

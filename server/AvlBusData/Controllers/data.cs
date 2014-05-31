using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NextBus.NET.ApiCommands;
using NextBus.NET.Entities;

namespace AvlBusData.Controllers
{
    public static class Data
    {
        public static readonly JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            Formatting = Formatting.Indented
        };

        public static VehicleLocations Locations
        {
            get
            {
                if (_locations == null || (_locations.LastTimeUtc - DateTime.UtcNow) > TimeSpan.FromSeconds(10))
                {
                    var command = new VehicleLocationsCommand();
                    try
                    {
                        var locations = command.Execute().Result;
                        locations.Locations.ForEach(l => l.RouteTitle = Routes[l.RouteTag].Title);
                        _locations = locations;
                    }
                    catch (Exception)
                    {
                        return new VehicleLocations();
                    }
                }

                return _locations;
            }
        }
        private static VehicleLocations _locations;

        public static Dictionary<string, Route> Routes
        {
            get
            {
                if (_routes == null)
                {
                    var command = new RouteListCommand();
                    try
                    {
                        var routes = command.Execute().Result.ToList();
                        foreach (var route in routes)
                        {
                            var routeConfigCommand = new RouteConfigCommand(route.Tag);
                            try
                            {
                                var routeConfig = routeConfigCommand.Execute().Result;
                                route.Stops = routeConfig.Stops;
                                route.ColorHex = routeConfig.ColorHex;
                                route.OppositeColorHex = routeConfig.OppositeColorHex;
                                route.Directions = routeConfig.Directions;
                            }
                            catch (Exception)
                            {
                                return null;
                            }
                        }
                        _routes = routes.ToDictionary(r => r.Tag);
                    }
                    catch
                    {
                        return new Dictionary<string, Route>();
                    }
                }

                return _routes;
            }
        }
        private static Dictionary<string, Route> _routes;

        public static Stop GetStop(string routeName, string stopName)
        {
            var route = Routes.Values.First(r =>
                r.Title.Equals(routeName, StringComparison.OrdinalIgnoreCase));
            return route.Stops.FirstOrDefault(
                s => s.Title.Equals(stopName, StringComparison.OrdinalIgnoreCase));
        }
    }
}
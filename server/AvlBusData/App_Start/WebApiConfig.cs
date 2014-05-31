using System.Web.Http;
using NextBus.NET;

namespace AvlBusData
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            NextBusApi.AgencyTag = "art";

            // Web API configuration and services
            config.EnableCors();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}

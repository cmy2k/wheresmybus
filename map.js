$(document).ready(function() {

    var restEndpoint = 'http://api.ashevilletechevents.com/api/locations';
    //var restEndpoint = './mock.json';
    var busMarkers = [];

    var map = L.map('map', {
        // options here
    }).setView([35.596, -82.55], 14);

    var osmBaseLayer = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 20
    }).addTo(map);

    var busStops = L.tileLayer.wms("http://opendataserver.ashevillenc.gov/geoserver/ows", {
	    layers: 'coa_transit_bus_stops',
	    format: 'image/png',
	    transparent: true,
	    attribution: "Bus stops"
    }).addTo(map);

    var routes = L.tileLayer.wms("http://opendataserver.ashevillenc.gov/geoserver/ows", {
	    layers: 'coa_transit_bus_routes',
	    format: 'image/png',
	    transparent: true,
	    attribution: "Bus routes"
    }).addTo(map);

    var layerControl = L.control.layers(
	    {
            'Open Street Map' : osmBaseLayer
	    },
	    {
	        'Routes': routes,
	        'Stops': busStops
	    }, 
	    {}).addTo(map);

    L.control.locate().addTo(map);

    getBusLocations();

    // this will refresh the map every 10 seconds
    var interval = setInterval(function() {
        getBusLocations();
    }, 10000);

    var busLayerGroup = null;

    function getBusLocations() {
        $.getJSON(restEndpoint, function(buses) {
	        busMarkers.length = 0;
	        $.each(buses, function(i, bus) {
	            translateJson(bus);

	        });

	        if (busLayerGroup !== null) {
	            map.removeLayer(busLayerGroup);
	        }

	        busLayerGroup =	L.layerGroup(busMarkers);
	        busLayerGroup.addTo(map);
        });
    }

    function translateJson(bus) {
        var latlng = new L.latLng(bus.location.lat, bus.location.lon);
        var marker = L.marker(latlng, { });
        busMarkers.push(marker);
    }

});


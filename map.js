$(document).ready(function() {

    var restEndpoint = 'http://api.ashevilletechevents.com/api/locations';
    //var restEndpoint = './mock.json';
    var busMarkers = [];

    var map = L.map('map', {
        // options here
    }).setView([35.596, -82.55], 14);

    map.zoomControl.removeFrom(map);

    var osmBaseLayer = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18
    }).addTo(map);

    var busStops = L.tileLayer.wms("http://opendataserver.ashevillenc.gov/geoserver/ows", {
	    layers: 'coa_transit_bus_stops',
	    format: 'image/png',
	    transparent: true,
	    attribution: "Bus stops"
    }).addTo(map);

    $.getJSON('data/busstops.json', function(json) {
	L.geoJson( json, {
	    style: function(feature) {
		return {color: '#000000'};
	    }
	} ).addTo(map);
    });

/*

    var routes = L.tileLayer.wms("http://opendataserver.ashevillenc.gov/geoserver/ows", {
	    layers: 'coa_transit_bus_routes',
	    format: 'image/png',
	    transparent: true,
	    attribution: "Bus routes"
    }).addTo(map);
*/

$.getJSON('http://api.ashevilletechevents.com/api/routecolors/', function(colors){
    $.getJSON('data/busroutes.json', function(json) {
	L.geoJson( json, {
	    style: function(feature) {
		//console.log( colors[feature.properties.route_number.toLowerCase()] );
		return {weight: 10,
			opacity: 1.0,
			color: colors[feature.properties.route_number]};
	    }
	} ).addTo(map);
    });
});

//    
//    

    

    /*
    var layerControl = L.control.layers(
	    {
            'Open Street Map' : osmBaseLayer
	    },
	    {
	        'Routes': routes,
	        'Stops': busStops
	    }, 
	    {}).addTo(map);
*/

    var locate = L.control.locate({}).addTo(map);

    $('#locateBtn').on('click', function(){
	$('#contentLayer').trigger('click');
	locate.locate();
    });

    $('.leaflet-control-locate').hide();

    // move locate to another container



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


    function roundToNearest45(angle) {
        var val = Math.round(angle/45.0) * 45.0
        if (val === 360) { val = 0; }
        return val;
    }

    function translateJson(bus) {
        var latlng = new L.latLng(bus.location.lat, bus.location.lon);

        var iconUrl   = 'server/AvlBusData/img/' + bus.routeTitle + '.png';
        var shadowUrl = 'server/AvlBusData/img/Arrow' + roundToNearest45(bus.heading) + '.png';

        var busIcon = L.icon({
            "iconUrl"       : iconUrl,
            "iconSize"      : [30, 30], // size of the icon
            "iconAnchor"    : [15, 15], // point of the icon which will correspond to marker's location

            "shadowUrl"     : shadowUrl,
            "shadowSize"    : [40, 40], // size of the shadow
            "shadowAnchor"  : [20, 20],  // the same for the shadow

            //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var marker = L.marker(latlng, { icon : busIcon });
        busMarkers.push(marker);
    }

    var live = 'https://maps.googleapis.com/maps/api/directions/json?origin=35.598127,-82.552533&destination=35.436967,-82.536871&sensor=false&key=AIzaSyBKy2YUCCMY79tYdTkcdAYJJAEN6WsIhIE&departure_time=1401549743&mode=transit';

    $('#clickair').on('click', function(){
	$.getJSON('fakeRoutes/airport.json', function(data) {
	    $('#airport').html('');
	    $('#home').html('');
	    $('#downtown').html('');
	    $('#hiwire').html('');
	    $.each(data.routes[0].legs[0].steps, function(i, inst) {
		$('#airport').append('<li>' + inst.html_instructions + '</li>');
	    });
	});

    });

    $('#clickhome').on('click', function(){
	$.getJSON('fakeRoutes/home.json', function(data) {
	    $('#airport').html('');
	    $('#home').html('');
	    $('#downtown').html('');
	    $('#hiwire').html('');
	    $.each(data.routes[0].legs[0].steps, function(i, inst) {
		$('#home').append('<li>' + inst.html_instructions + '</li>');
	    });
	});
    });

    $('#clickdown').on('click', function(){
	$.getJSON('fakeRoutes/downtown.json', function(data) {
	    $('#airport').html('');
	    $('#home').html('');
	    $('#downtown').html('');
	    $('#hiwire').html('');
	    $.each(data.routes[0].legs[0].steps, function(i, inst) {
		$('#downtown').append('<li>' + inst.html_instructions + '</li>');
	    });
	});
    });

    $('#take').on('click', function(){
	$.getJSON('fakeRoutes/hiwire.json', function(data) {
	    $('#airport').html('');
	    $('#home').html('');
	    $('#downtown').html('');
	    $('#hiwire').html('');
	    $.each(data.routes[0].legs[0].steps, function(i, inst) {
		$('#hiwire').append('<li>' + inst.html_instructions + '</li>');
	    });
	});
    });


});


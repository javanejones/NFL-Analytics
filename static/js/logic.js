  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + "NFL Conference :" +feature.properties.conference +
      "</h3><hr><p>"+ "Division:"+feature.properties.division + "Team:" + feature.properties.club + "Stadium Name:" + feature.properties.stadium + "Capacity:" + feature.properties.capacity+ "Head Coach:" + feature.properties.head_coach +"</p>");
  }

     //  Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Sateliite Map": satellite
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [39.5501, -105.7821],
  zoom: 4,
  layers: [streetmap]     //default selected layer
  });

 // Add streetmap tile to map; if only one tile defined then this is a good way of doing this.
// If only one tile layer then the following will be used "L.control.layers(null, overlayMaps, " later in the code

streetmap.addTo(myMap);

// create layer; will attach data later on
var nflteams = new L.LayerGroup();
// Alternate method and same as above
// var earthquakes = L.layerGroup();

// Create overlay object to hold our overlay layer
var overlayMaps = {
  "NFL": nflteams
};

var overlayMap = {
  "Conference": nflteams
};
// Create a layer control
// Pass in our baseMaps and overlayMaps

L.control.layers(baseMaps, overlayMaps, overlayMap, {
  collapsed: false
}).addTo(myMap);

// Use this link to get the geojson data.
var link = "static/data/teaminfo.geojson";

// Perform a GET request to the query URL
d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
    onEachFeature: popUpMsg
  }).addTo(nflteams);

  nflteams.addTo(myMap);

  console.log(data)

});
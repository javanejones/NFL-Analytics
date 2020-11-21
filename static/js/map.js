
// Store our API endpoint inside queryUrl
var queryUrl2 = 'https://raw.githubusercontent.com/DanielKarpowicz/final_project_plays_prediction/jiaping/jiaping/Resources/team_info.geojson';
var myMap = L.map("map", {
    center: [35.52, -100.67],
    zoom: 4
    // layers: [grayscale]
});
// create a titlelayer as the background
// var grayscale = 
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);


// add conference and division filtration layers 

let checkboxStates

d3.json(queryUrl2).then(function (teams) {

    var geojsonLayer = L.geoJSON(null, {
        pointToLayer: (feature, latlng) => {
            var myIcon = L.icon({
                iconUrl: feature.properties.logo_address,
                iconSize: [32, 32],
            });
            var coordinates = feature.geometry.coordinates;
            return L.marker(latlng, { icon: myIcon });
        },

        filter: (feature) => {
            const isDivisionChecked = checkboxStates.divisions.includes(feature.properties.division)
            const isConferenceChecked = checkboxStates.conferences.includes(feature.properties.conference)
            return isDivisionChecked && isConferenceChecked //only true if both are true
        },
        onEachFeature: (feature,layer) => {
            layer.bindPopup(`<a>${feature.properties.club}</a><hr>
            <a>
            Head Coach: ${feature.properties.head_coach}<br>
            Confercence: ${feature.properties.conference}<br>
            Division: ${feature.properties.division}<br>
            City: ${feature.properties.city}<br>
            Statium: ${feature.properties.stadium}<br>
            Capacity: ${feature.properties.capacity}
            </a>`);
        }
    }).addTo(myMap)

    function updateCheckboxStates() {
        checkboxStates = {
            divisions: [],
            conferences: []
        }

        for (let input of document.querySelectorAll('input')) {
            if (input.checked) {
                switch (input.className) {
                    case 'conference': checkboxStates.conferences.push(input.value); break
                    case 'division': checkboxStates.divisions.push(input.value); break
                }
            };
        }
    };

    for (let input of document.querySelectorAll('input')) {
        //Listen to 'change' event of all inputs
        input.onchange = (e) => {
            geojsonLayer.clearLayers()
            updateCheckboxStates()
            geojsonLayer.addData(teams)
        }
    }

    /****** INIT ******/
    updateCheckboxStates()
    geojsonLayer.addData(teams)
});
























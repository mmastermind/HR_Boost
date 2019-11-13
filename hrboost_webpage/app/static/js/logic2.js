var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="http://mapbox.com">Mapbox</a>',
mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmdhdmlzaCIsImEiOiJjaXFheHJmc2YwMDdoaHNrcWM4Yjhsa2twIn0.8i1Xxwd1XifUU98dGE9nsQ';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
outdoors = L.tileLayer(mbUrl, {id: 'mapbox.outdoors', attribution: mbAttr}),
satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr}),
dark = L.tileLayer(mbUrl, {id: 'mapbox.dark', attribution: mbAttr}),
light = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
satellitestreets = L.tileLayer(mbUrl, {id: 'mapbox.streets-satellite', attribution: mbAttr});


// function getColor(d) {
//   return d == 1 ?
//       "#ffffd4" :
//       d ==2 ?
//       "#fed98e" :
//       d == 3 ?
//       "#fe9929" :
//       d == 4 ?
//       "#d95f0e" :
//       d == 5 ?
//       "#993404" :
//       "#ffffff";
// }

function getColor(d) {
  return d == 1 ?
      "#FEEDF0" :
      d ==2 ?
      "#fdae6b" :
      d == 3 ?
      "#fd8d3c" :
      d == 4 ?
      "#e6550d" :
      d == 5 ?
      "#a63603" :
      "#feedde";
}

function style(feature) {
  return {
      fillColor: getColor(feature.properties.NB),
      weight: .8,
      opacity: .2,
      color: "black",
      dashArray: "1",
      fillOpacity: 0.6
  };
}
function style2(feature) {
  return {
      fillColor: "",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "1",
      fillOpacity: 0.002
  };
}

var baseLayers = {
"Grayscale": grayscale,
"Streets": streets,
"Outdoors": outdoors,
"Satellite": satellite,
"Satellite Streets": satellitestreets,
"Dark Map": dark,
"Light Map": light
};


function onEachFeature(feature, layer) {
  layer.on({
      mouseover: popToFeature,
      click:wayToFeature
  });
}

function popToFeature(e) {
  var layer = e.target;
  layer.bindPopup(
      "<h5>Worker ID:</h5><p>"+ layer.feature.properties.id_trbj+
      "</p><br><h5>Distance (km): </h5><p>" + layer.feature.properties.TiempVj +"</p>"+
      "<h5>Travel Time (min): </h5><p>" + layer.feature.properties.Distanc +"<p>"+
      "<h5>Work Center: </h5><p>" + layer.feature.properties.Dprtmnt +"<p>"
  );
} 
var geojson5;//= L.geoJson(Rutas);


function wayToFeature(e) {
  if (map.hasLayer(geojson5)) { map.removeLayer(geojson5); }
//  map.removeLayer(geojson5);
  var layer = e.target;
  function routFilter(feature) {
    if (feature.properties.id_Tr === layer.feature.properties.id_trbj) return true
  }
  var geojson5 =L.geoJson(Rutas, {
    filter: routFilter,
    color: 'blue',
    weight: 4,
    opacity: .7,
    dashArray: '1',
    lineJoin: 'round'
  });
  map.addLayer(geojson5);
  map.fitBounds(geojson5.getBounds());
}

function createCustomIcon2 (feature, latlng) {
  let  startIcon = L.icon({
    iconUrl: 'static/ct.png',
    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 30], // point of the icon which will correspond to marker's location
  })
  return L.marker(latlng, { icon: startIcon })
}
let myLayerOptions2 = {
  pointToLayer: createCustomIcon2
}
var endIcon = L.icon({
	iconUrl: 'static/pin3.png',
	iconSize:     [30, 30], // size of the icon
	iconAnchor:   [15, 30], // point of the icon which will correspond to marker's location
});

// // Worker Icon
function createCustomIcon (feature, latlng) {
  let myIcon = L.icon({
    iconUrl: 'static/pin6.png',
    iconSize:     [12, 12], // width and height of the image in pixels
    iconAnchor:   [6, 12], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  })
  return L.marker(latlng, { icon: myIcon })
}

let myLayerOptions = {
  pointToLayer: createCustomIcon,
  onEachFeature: onEachFeature
}


//  d3.json(Trabajadores, function(data) {
//   // Creating a GeoJSON layer with the retrieved data
var geojson1=  L.geoJson(Trabajadores, myLayerOptions);
var geojson2=  L.geoJson(Departamentos, myLayerOptions2);
var geojson3=  L.geoJson(Agebs,{
    style: style,
  });


var overlayMaps = {
  "Worker's homes": geojson1,
  'Work centers': geojson2,
  'AGEBS (Crime index)': geojson3
};

  var map = L.map('map', {
    center: [19.47075, -99.13868], /*Default location */
    zoom: 10.5, /*Default Zoom */
    layers: [dark, geojson1, geojson2, geojson3 ] // Default basemaplayer on startrup, can also give another layer here to show by default)
    });
    
var geojson4=  L.geoJson(Estados,{
  style: style2,
}).addTo(map);

L.easyButton('fa-globe', function(btn, map){
  map.setView([19.47075, -99.13868], 10.5);
}).addTo(map);

L.control.layers(baseLayers,overlayMaps).addTo(map);
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var magnitudes = ["Ciminality"+ "<br>"+ "Rate" +"<br>"+"Crimes per "+"<br>"+"1,000 inhabitants","960-1,482","455-959","146-454", "35-145", "0-34"];
  var colors = ["#ffffff","#a63603", "#e6550d", "#fd8d3c", "#fdae6b", "#FEEDF0"];
  var labels = [""];

  magnitudes.forEach(function(mag, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\">" + magnitudes[index] + "</li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

legend.addTo(map);
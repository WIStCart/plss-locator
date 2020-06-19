// Set max view
var maxView = L.latLngBounds(
  L.latLng(48.5, -82),
  L.latLng(41, -97.5)
);

// Set initial map view
const map = L.map('map',{
  minZoom: 7,
  maxZoom: 18,
  maxBounds: maxView
}).setView([45,-90], 7);

map.createPane("backgroundPane").style.zIndex = 100;
map.createPane("foregroundPane").style.zIndex = 200;

// OSM Basemap
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  pane:'backgroundPane'
}).addTo(map);

map.addLayer(osm);

// Google Satellite Basemap
var google = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3'],
  pane:'backgroundPane'
});

// Add locate control
var lc = L.control.locate({
  position: 'topleft',
  flyTo: true,
  drawCircle: true,
  locateOptions: {
    enableHighAccuracy: true
  },
  strings: {
    title: "Find my location",
    outsideMapBoundsMsg: "Sorry, your Web browser or mobile device is providing a location outside the PLSS map extent."
  }
}).addTo(map);

// Add search control
$(map).addSearchControl({
  latLng: true,
  address: true,
  gazeteer: true,
  county: true,
  cityTownVillage: true,
  twnRng: false,
  twnRngSec: false,
  quad: false,
  theme: 'grey-leaflet',
  position: 'topleft',
  mobilePosition: 'raisedbottomright',
  order: ["latLng", "address", "gazetteer", "county", "cityTownVillage"],
  searchText: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 8 8"> <path d="M3.5 0c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c.59 0 1.17-.14 1.66-.41a1 1 0 0 0 .13.13l1 1a1.02 1.02 0 1 0 1.44-1.44l-1-1a1 1 0 0 0-.16-.13c.27-.49.44-1.06.44-1.66 0-1.93-1.57-3.5-3.5-3.5zm0 1c1.39 0 2.5 1.11 2.5 2.5 0 .66-.24 1.27-.66 1.72-.01.01-.02.02-.03.03a1 1 0 0 0-.13.13c-.44.4-1.04.63-1.69.63-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5z"/> </svg>',
  mobileSearchText: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 8 8"> <path d="M3.5 0c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c.59 0 1.17-.14 1.66-.41a1 1 0 0 0 .13.13l1 1a1.02 1.02 0 1 0 1.44-1.44l-1-1a1 1 0 0 0-.16-.13c.27-.49.44-1.06.44-1.66 0-1.93-1.57-3.5-3.5-3.5zm0 1c1.39 0 2.5 1.11 2.5 2.5 0 .66-.24 1.27-.66 1.72-.01.01-.02.02-.03.03a1 1 0 0 0-.13.13c-.44.4-1.04.63-1.69.63-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5z"/> </svg>'
});

// Initilize carto client
var client = new carto.Client({
  apiKey: 'x8vPLNqzI5hRLT6RV-922Q',
  username: 'sco-admin'
});

// Add toggle for base map (osm, google satellite)
$(document).ready(function() {
  $('#basemapToggle').click(function() {
    if(this.checked) {
      map.removeLayer(osm);
      map.addLayer(google);
    } else {
      map.removeLayer(google);
      map.addLayer(osm);
    }    
  });
});

// Prepare layer sources
const townshipsSource = new carto.source.SQL(`
  SELECT *, 
  CASE
    WHEN dir=2 THEN 'W'
      WHEN dir=4 THEN 'E'
      ELSE NULL
  END AS west_east
  FROM "sco-admin".scobase_wi_plss_townships_24k
`);
const sectionsSource = new carto.source.SQL(`
  SELECT * 
  FROM "sco-admin".scobase_wi_plss_sections_24k
`);
const qsectionsSource = new carto.source.SQL(`
  SELECT *,
  CASE
    WHEN q=1 THEN 'NE'
      WHEN q=2 THEN 'NW'
      WHEN q=3 THEN 'SW'
      WHEN q=4 THEN 'SE'
      ELSE NULL
  END AS q_text
  FROM "sco-admin".scobase_wi_plss_qsections_24k
`);
const qqsectionsSource = new carto.source.SQL(`
  SELECT *, 
  CASE
    WHEN d=2 THEN 'W'
      WHEN d=4 THEN 'E'
      ELSE NULL
  END AS dir,
  CASE
    WHEN q=1 THEN 'NE'
    WHEN q=2 THEN 'NW'
    WHEN q=3 THEN 'SW'
    WHEN q=4 THEN 'SE'
    ELSE NULL
  END AS q_text,
  CASE
    WHEN qq=1 THEN 'NE'
    WHEN qq=2 THEN 'NW'
    WHEN qq=3 THEN 'SW'
    WHEN qq=4 THEN 'SE'
    ELSE NULL
  END AS qq_text
  FROM "sco-admin".scobase_wi_plss_qqsections_24k
`);

// Utility to dynamically generate syling for layer and labels at different zoom levels
function scaleMapElements(zoomStart, zoomEnd, valueStart, valueEnd, styleString) {
  
  var zoomCSS = '';
  
  var zoomDelta = zoomEnd - zoomStart;
  var valueDelta = valueEnd - valueStart;

  // Iterate through zoom level index
  for (i = 0; i <= zoomDelta; i++){
    // zoomCSS += '[zoom = ' + (zoomStart + i) + ']{' + styleString + ':' + (Math.pow(i, 2)*scaleFactor + scaleInitial) + ';}'
    zoomCSS += '\n[zoom = ' + (zoomStart + i) + ']{' + styleString + ':' + ((1/(1+Math.E**(5-10*i/zoomDelta)))*valueDelta + valueStart) + ';}'
  }

  return zoomCSS
}

// Township style
var townshipsCSS = `
  #layer {
    ::outline {
      line-opacity: 0;` +
      scaleMapElements(10, 18, 1.5, 10, 'line-width') +
      scaleMapElements(10, 18, 0.2, 1, 'line-opacity') +
    `}

    ::labels {

      [zoom>=11][zoom<=12] {
        text-name: 'TWP '+[twp]+' N\\nRNG '+[rng]+' '+[west_east];
        text-face-name: 'Lato Bold';
        text-fill: #465159;
        text-label-position-tolerance: 0;
        text-halo-radius: 1.5;
        text-halo-fill: #FFFFFF;
        text-allow-overlap: true;
        text-placement: point;
        text-placement-type: dummy;
      }` +
      scaleMapElements(11, 12, 20, 30, 'text-size') +
      scaleMapElements(11, 12, 0.7, 1, 'text-opacity') +
    `}
  }
`
const townshipsStyle = new carto.style.CartoCSS(townshipsCSS);

// Section style
var sectionsCSS = `
  #layer {
    ::outline {
      line-color: #000; /* dcdfe3 */
      line-opacity: 0;` +
      scaleMapElements(13, 18, 1, 4, 'line-width') +
      scaleMapElements(13, 18, 0.7, 1, 'line-opacity') +
    `}
    
    ::labels {
      [zoom >= 13][zoom <= 15]{
        text-name: 'SEC\\n'+[sec];
        text-face-name: 'Lato Bold';
        text-fill: #465159;
        text-label-position-tolerance: 0;
        text-halo-radius: 1.5;
        text-halo-fill: #FFFFFF;
        text-allow-overlap: true;
        text-placement: point;
        text-placement-type: dummy;
      }` +
      scaleMapElements(13, 15, 18, 28, 'text-size') +
      scaleMapElements(13, 15, 0.7, 1, 'text-opacity') +
    `}
  }
`
const sectionsStyle = new carto.style.CartoCSS(sectionsCSS);

// Quarter section style
var qSectionsCSS = `
  #layer {
    ::outline {
      line-color: #727d85;
      line-opacity: 0;` +
      scaleMapElements(14, 18, 1, 4, 'line-width') +
      scaleMapElements(14, 18, 0.7, 1, 'line-opacity') +
    `}
    
    ::labels {
      [zoom>=14][zoom <= 16] {
        text-name: '[q_text]';
        text-face-name: 'Lato Bold';
        text-fill: #727d85;
        text-label-position-tolerance: 0;
        text-halo-radius: 1.5;
        text-halo-fill: #FFFFFF;
        text-allow-overlap: true;
        text-placement: point;
        text-placement-type: dummy;
      }` +
      scaleMapElements(14, 16, 18, 28, 'text-size') +
      scaleMapElements(14, 16, 0.7, 1, 'text-opacity') +
    `}
  }
`
const qsectionsStyle = new carto.style.CartoCSS(qSectionsCSS);

// Quarter-quarter section style
var qqSectionsCSS = `
  #layer {
    ::outline {
      line-color: #99a2a8;
      line-dasharray: 8,16;
      line-opacity: 0;` +
      scaleMapElements(15, 18, 1, 2, 'line-width') +
      scaleMapElements(15, 18, 0.2, 1, 'line-opacity') +
    `}
    
    ::labels {
      [zoom >= 15][zoom <= 18]{
        text-name: [qq_text];
        text-face-name: 'Lato Bold';
        text-fill: #99a2a8;
        text-label-position-tolerance: 0;
        text-halo-radius: 1.5;
        text-halo-fill: #FFFFFF;
        text-allow-overlap: true;
        text-placement: point;
        text-placement-type: dummy;
      }` +
      scaleMapElements(15, 18, 18, 28, 'text-size') +
      scaleMapElements(15, 18, 0.7, 1, 'text-opacity') +
    `}
  }
`
const qqsectionsStyle = new carto.style.CartoCSS(qqSectionsCSS);

// console.log(townshipsCSS)
// console.log(sectionsCSS)
// console.log(qSectionsCSS)
// console.log(qqSectionsCSS)

// Create layers
const townships = new carto.layer.Layer(townshipsSource, townshipsStyle, {});
const sections = new carto.layer.Layer(sectionsSource, sectionsStyle, {});
const qsections = new carto.layer.Layer(qsectionsSource, qsectionsStyle, {});
const qqsections = new carto.layer.Layer(qqsectionsSource, qqsectionsStyle, {});

// Add layers to client then add to map
client.addLayers([qqsections],{pane:'foregroundPane'});
client.addLayers([qsections],{pane:'foregroundPane'});
client.addLayers([sections],{pane:'foregroundPane'});
client.addLayers([townships],{pane:'foregroundPane'});
client.getLeafletLayer().addTo(map);

// Add empty layer in to which selected features will be added
var selectedStyle = {
  "color": "#e8b756",
  "fillOpacity": 0.1,
  "weight": 4,
  "opacity": 0.75
};
var selectedFeatures = L.geoJson(null,{style: selectedStyle}).addTo(map);


// Set Global Variable that will hold the marker that goes at our location when found
var locationMarker = null;

// Set marker icon
var redIcon = L.icon({
  iconUrl: 'assets/img/redIcon.png',
  shadowUrl: 'assets/img/marker-shadow.png',
  iconAnchor: [13, 41]
});

// Listen for a click event on the Map element
map.on('click', function(e){
  addMarker(e.latlng);
  selectFeatures(e.latlng);
  toggleWidget('map');
  selectNearbyFeatures(e.latlng);
});

// Function to add marker
function addMarker(latlng) {
  // Remove locationMarker if on map
  if(map.hasLayer(locationMarker)){
    map.removeLayer(locationMarker);
  };

  locationMarker = L.marker(latlng, {icon: redIcon});
  map.addLayer(locationMarker); 
}

// Select and highlight the features a user clicks on
function selectFeatures(latlng) {

  selectedFeatures.clearLayers();

  $.getJSON(`https://sco-admin.carto.com/api/v2/sql?format=GEOJSON&q=SELECT * FROM "sco-admin".scobase_wi_plss_townships_24k WHERE ST_Contains(the_geom, ST_GeomFromText('POINT(`+latlng.lng+` `+latlng.lat+`)',4326));`, function(data) {
    selectedFeatures.addData(data);
  });
  $.getJSON(`https://sco-admin.carto.com/api/v2/sql?format=GEOJSON&q=SELECT * FROM "sco-admin".scobase_wi_plss_sections_24k WHERE ST_Contains(the_geom, ST_GeomFromText('POINT(`+latlng.lng+` `+latlng.lat+`)',4326));`, function(data) {
    selectedFeatures.addData(data);
  });
  $.getJSON(`https://sco-admin.carto.com/api/v2/sql?format=GEOJSON&q=SELECT * FROM "sco-admin".scobase_wi_plss_qsections_24k WHERE ST_Contains(the_geom, ST_GeomFromText('POINT(`+latlng.lng+` `+latlng.lat+`)',4326));`, function(data) {
    selectedFeatures.addData(data);
  });
  // Use qq section selection to fill in info widget
  $.getJSON(`https://sco-admin.carto.com/api/v2/sql?format=GEOJSON&q=SELECT *, CASE WHEN d=2 THEN 'W'WHEN d=4 THEN 'E'ELSE NULL END AS dir, CASE WHEN q=1 THEN 'NE'WHEN q=2 THEN 'NW'WHEN q=3 THEN 'SW'WHEN q=4 THEN 'SE'ELSE NULL END AS q_text, CASE WHEN qq=1 THEN 'NE'WHEN qq=2 THEN 'NW'WHEN qq=3 THEN 'SW'WHEN qq=4 THEN 'SE'ELSE NULL END AS qq_text FROM "sco-admin".scobase_wi_plss_qqsections_24k as qqsec WHERE ST_Contains(the_geom, ST_GeomFromText('POINT(`+latlng.lng+` `+latlng.lat+`)',4326));`, function(data) {
    selectedFeatures.addData(data);

    var cardinalDir = {
      'N' : 'north',
      'E': 'east',
      'S' : 'south',
      'W': "west",
      'NW': 'northwest',
      'NE': 'northeast',
      'SE': 'southeast',
      'SW': 'southwest'
    };

    // Grab vaiables from returned data
    var properties = data.features[0].properties
    var dir = properties.dir.toString();
    var twp = properties.t.toString();
    var rng = properties.r.toString();
    var sec = properties.s.toString();
    var q   = properties.q_text.toString();
    var qq  = properties.qq_text.toString();
    var qText = cardinalDir[q];
    var qqText = cardinalDir[qq];
    var dirText = cardinalDir[dir];

    // Build text strings for inserting
    var townshipStr = "Township: " + twp + "N";
    var rangeStr = "<br>Range: " + rng + dir;
    var sectionStr =  "<br>Section: " + sec; 
    var qSectionStr =  "<br>Quarter Section: " + q;
    var qqSectionStr =  "<br>Quarter Quarter Section: " + qq;
    var verbalDesc = "The " + qqText + " quarter of the " + qText + " quarter of Section " + sec + ", Township " + twp + " north, Range " + rng + " " + dirText + ", fourth Principal Meridian.";

    // Insert strings into widget
    $('#township-within').html(townshipStr)
    $('#range-within').html(rangeStr)
    $('#section-within').html(sectionStr)
    $('#quarter-within').html(qSectionStr)
    $('#qq-within').html(qqSectionStr)
    $('#verbal-desc').html(verbalDesc)

    // Update lat/long in widget
    $('.lat-long-output').html(latlng.lat.toPrecision(6) + `, ` + latlng.lng.toPrecision(6))
  });
}

// Select features within a specified distance of the current location
function selectNearbyFeatures(latlng){
  
  // Clear nearby numbers while query runs
  $('#nearby').html('\
    <div class="spinner text-center">\
      <div class="bounce1"></div>\
      <div class="bounce2"></div>\
      <div class="bounce3"></div>\
    </div>\
  ');
  $('#nearby').css('display','inherit');

  // Query quarter quarter sections to get nearby info
  $.getJSON(`https://sco-admin.carto.com/api/v2/sql?format=GEOJSON&q=SELECT NULL AS the_geom, CASE WHEN d=2 THEN 'W' WHEN d=4 THEN 'E' ELSE NULL END AS dir, t, r, s, CASE WHEN q=1 THEN 'NE' WHEN q=2 THEN 'NW' WHEN q=3 THEN 'SW' WHEN q=4 THEN 'SE' ELSE NULL END AS q_text, CASE WHEN qq=1 THEN 'NE' WHEN qq=2 THEN 'NW' WHEN qq=3 THEN 'SW' WHEN qq=4 THEN 'SE' ELSE NULL END AS qq_text FROM "sco-admin".scobase_wi_plss_qqsections_24k AS qqsections WHERE ST_DWithin( ST_Transform(qqsections.the_geom, 3070), ST_Transform(ST_GeomFromText('POINT(`+latlng.lng+` `+latlng.lat+`)',4326), 3070), 15 ) AND NOT ST_Contains( qqsections.the_geom, ST_GeomFromText('POINT(`+latlng.lng+` `+latlng.lat+`)',4326));`, function(data) {

    // Exit function if there is nothing nearby
    if (data.features.length===0) {
      $('#nearby').html('');
      $('#nearby').css('display','none');
      return
    }

    var nearbyHTML = '<u>The point clicked may be in:</u>';
    
    // For each feature
    for (i=0; i<data.features.length; i++) {
      // Grab properties
      properties = data.features[i].properties;

      var twp = properties.t.toString() + 'N';
      var rng = properties.r.toString() + properties.dir.toString();
      var sec = properties.s.toString();
      var q   = properties.q_text.toString();
      var qq  = properties.qq_text.toString();

      var dtrsqqq = '<div>T' + twp + ' R' + rng + ' S' + sec + ' ' + q + ' ' + qq + '</div>';

      nearbyHTML += dtrsqqq;
    }

    // Add more info link
    nearbyHTML += '<a id="nearby-info-button" href="#nearby-info-modal" data-toggle="modal" data-target="#nearby-info-modal">more info</a>';
    
    // Add nearbyHTML to document
    $('#nearby').html(nearbyHTML);
    $('#nearby').css('display','inherit');
  });
}

// Get the township and section from latitude and longitude
function getPlssInfo(latlng) {
  addMarker(latlng);
  selectFeatures(latlng);
  selectNearbyFeatures(latlng);
}

// Toggle hide/display the Widget depending if widget button is clicked or map is clicked
function toggleWidget(whereClicked) {
  if (document.getElementById("widget").style.width === "0px") {
    if (screen.width < "600") {
      document.getElementById("widget").style.width = "80%";
    }
    else {
      document.getElementById("widget").style.width = "300px";
    }
  }
  else if (whereClicked === "widget") {
    document.getElementById("widget").style.width = "0px";
  }
}
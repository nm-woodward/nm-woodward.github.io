
mapboxgl.accessToken = bt+'t'+aj;
currentMarkers = [];
    //mapboxgl.accessToken = at1+at2;

    var map = new mapboxgl.Map({
        container: 'boston_map', // container id
        style: 'mapbox://styles/nm-woodward/ck9vqhooi02411ioeajj1ptr4', //hosted style id
        center: [-71.077083,42.331145], // starting position
        zoom: 10.2 // starting zoom
        });


// add initial set of markers to map
dat.forEach(function(marker) {

      // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';

    // make a marker for each feature and add to the map
    newMarker = new mapboxgl.Marker(el)
      .setLngLat([parseFloat(marker.longitude),parseFloat(marker.latitude)])
      .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML('<span id="marker_tooltip">' + marker.type + '<span></br>' + marker.open_dt.split(' ')[0]+
                '</br> '+ marker.location_street_name + '</span>'))
      .addTo(map);

    currentMarkers.push(newMarker);
  });

// Function to change markers for filtered sub-type
// Will be called inside of ChangeChartCategory function

function ChangeMapMarkers(val) {

//Remove current markers
  if (currentMarkers!==null) {
    for (var i = currentMarkers.length - 1; i >= 0; i--) {
      currentMarkers[i].remove();
    }
  }

//Get relevant lookback date in JS
var lookback_date = new Date();
lookback_date.setDate(lookback_date.getDate() - 7);

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

lookback_date_string = formatDate(lookback_date);

//Change the title of the map
$('#map_title').text(val + " locations");
$('#map_explainer').text("* Markers above indicate requests within the last 7 days.");

//Make request for lat/longitude data for recent calls for this sub-type
var url_base = 'https://data.boston.gov/api/3/action/datastore_search_sql?sql=';
var query = 'SELECT * FROM \"6ff6a6fd-3141-4440-a880-6f60a37fe789\" WHERE type = \''+ val +'\' AND open_dt >= \''+ lookback_date_string +'\' LIMIT 2000';

var dat_type = [];

    $.ajax({
        url: url_base + query,
        async: false,
        dataType: 'json',
        success: function(data) {
          dat_type = data.result.records;
        }
    });

//Add new markers
dat_type.forEach(function(marker) {

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    newMarker = new mapboxgl.Marker(el)
      .setLngLat([parseFloat(marker.longitude),parseFloat(marker.latitude)])
      .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML('<span id="marker_tooltip">' + marker.type + '<span></br>' + marker.open_dt.split(' ')[0]+
                '</br> '+ marker.location_street_name + '</span>'))
      .addTo(map);

    currentMarkers.push(newMarker);
    });

}

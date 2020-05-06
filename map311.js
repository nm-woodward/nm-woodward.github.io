
mapboxgl.accessToken = bt+'v'+aj;

    //mapboxgl.accessToken = at1+at2;

    var map = new mapboxgl.Map({
        container: 'boston_map', // container id
        style: 'mapbox://styles/nm-woodward/ck9vqhooi02411ioeajj1ptr4', //hosted style id
        center: [-71.077083,42.331145], // starting position
        zoom: 10.2 // starting zoom
        });


// add markers to map
dat.forEach(function(marker) {

      // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
      .setLngLat([parseFloat(marker.longitude),parseFloat(marker.latitude)])
      .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML('<span id="marker_tooltip">' + marker.type + '<span></br>' + marker.open_dt.split(' ')[0]+
                '</br> '+ marker.location_street_name + '</span>'))
      .addTo(map);
  });
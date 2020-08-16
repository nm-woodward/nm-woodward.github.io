d3.csv("by_county.csv").then(function(data) {
    console.log(data[0]); 
    console.log(data.length);

  
  d3.json("us-county-boundaries.geojson").then(function(county_shapes) {
    //var temp = parseFloat(county_shapes.features.properties.countyfp_nozero);
    //county_shapes.features.properties.county_fip_nozero = temp;

    //county_shapes.features.properties.fips = county_shapes.features.properties[geoid];

    currentMarkers = [];
    
    // Seed county shape file with new absentee variables
    for(let j = 0; j < county_shapes.features.length; j++){ 
        county_shapes.features[j].properties.apps = parseInt(0);
        county_shapes.features[j].properties.d_apps = parseInt(0);
        county_shapes.features[j].properties.r_apps = parseInt(0);
        county_shapes.features[j].properties.d_app_rejections = parseInt(0);
        county_shapes.features[j].properties.d_percent_returned = parseFloat(0.01);
    }
    
    //Add absentee data to county shapefile
    for(let i = 0; i < data.length; i++){ 
      for(let j = 0; j < county_shapes.features.length; j++){ 
        if (data[i].fips === county_shapes.features[j].properties.geoid) {
          county_shapes.features[j].properties.apps = parseInt(data[i].apps);
          county_shapes.features[j].properties.d_apps = parseInt(data[i].d_apps);
          county_shapes.features[j].properties.r_apps = parseInt(data[i].r_apps);
          county_shapes.features[j].properties.d_app_rejections = parseInt(data[i].d_app_rejections);
          county_shapes.features[j].properties.d_percent_returned = parseFloat(data[i].d_percent_returned);
        }
      }
    }

    console.log(county_shapes.features[1].properties);
    console.log(county_shapes.length);

    mapboxgl.accessToken = at+'cm'+jp;

    var map = new mapboxgl.Map({
        container: 'map_here', // container id
        style: 'mapbox://styles/mapbox/light-v10', //hosted style id
        center: [-83.452001, 32.8542500], // starting position
        zoom: 6 // starting zoom
        });

        map.on('load', function() {
          map.addSource('ga-counties', {
            'type': 'geojson',
            'data': county_shapes});


            map.addLayer({
              'id': 'county-fill',
              'type': 'fill',
              'source': 'ga-counties',
              'paint': {
                'fill-color': {
                  property: 'd_app_rejections',
                  stops: [[1, '#fff'], [450, '#000']]
                  },
              'fill-opacity': 0.7
              },
              'filter': ['==', '$type', 'Polygon']
              });
      
    
              map.addLayer({
                'id': 'county-outline',
                'type': 'line',
                'source': 'ga-counties',
                'paint': {
                'line-color': 'black',
                'line-width': 1.5
                },
                'filter': ['==', '$type', 'Polygon']
                });
           
         


            var popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
              });

            map.on('mousemove', 'county-fill', function(e) {
              // Change the cursor style as a UI indicator.
              map.getCanvas().style.cursor = 'pointer';

              popup
              .setLngLat(e.lngLat)
              .setHTML('<span id="marker_tooltip"> <b>' + e.features[0].properties.namelsad + '</b></br>' + 
                                                      e.features[0].properties.d_apps + ' App Requests (D) </br><b>' +
                                                      e.features[0].properties.d_app_rejections + ' App Rejections (D)</b> </br>' +
                                                      parseInt(parseFloat(e.features[0].properties.d_percent_returned)*100) + '% Ballot Return Rate (D)' +          
              '</span>')
              .addTo(map);
              });

            map.on('mouseleave', 'county-fill', function() {
                map.getCanvas().style.cursor = '';
                popup.remove();
              });



            });
              
});

});
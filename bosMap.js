
//Part 1: Grab data from API and reformat:

//var url_base = 'https://cors-anywhere.herokuapp.com/https://data.boston.gov/api/3/action/datastore_search?resource_id=6ff6a6fd-3141-4440-a880-6f60a37fe789';
//var query = "&limit=5";
var map_url = "https://mapservices.bostonredevelopmentauthority.org/arcproxy/arcgis/rest/services/Maps/Bos_Neighborhoods_2018/mapserver/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";

console.log(map_url);

$.getJSON(map_url, function(data) {
    //var df = data.result.records;    
    map_data = data.features;

    for (i=0; i<map_data.length; i++) {
        map_data[i]['type'] = "Feature";
        map_data[i].geometry.type = 'MultiPolygon';
        map_data[i].geometry['coordinates'] = map_data[i].geometry['rings'];

    }

    console.log(map_data);

    var text = 'Success';

// Width and Height of the whole visualization
var width = 700;
var height = 580;

// Create SVG
var svg = d3.select("#boston_map")
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

// Append empty placeholder g element to the SVG
// g will contain geometry elements
var g = svg.append( "g" );

// Width and Height of the whole visualization
// Set Projection Parameters
var albersProjection = d3.geoAlbers()
    .scale( 190000 )
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate( [width/2,height/2] );

// Create GeoPath function that uses built-in D3 functionality to turn
// lat/lon coordinates into screen coordinates
var geoPath = d3.geoPath()
    .projection(albersProjection);

// Classic D3... Select non-existent elements, bind the data, append the elements, and apply attributes
g.selectAll( "path" )
    .data(map_data)
    .enter()
    .append( "path" )
    .attr( "fill", "#ccc" )
    .attr( "stroke", "#333")
    .attr( "d", geoPath );

});

//d3.json to do this
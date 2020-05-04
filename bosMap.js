
//Part 1: Grab data from API and reformat:

//var url_base = 'https://cors-anywhere.herokuapp.com/https://data.boston.gov/api/3/action/datastore_search?resource_id=6ff6a6fd-3141-4440-a880-6f60a37fe789';
//var query = "&limit=5";
var map_url = "https://mapservices.bostonredevelopmentauthority.org/arcproxy/arcgis/rest/services/Maps/Bos_Neighborhoods_2018/mapserver/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";
var test_url = 'https://gist.githubusercontent.com/floledermann/92a56b764a92b55a857f5115236146b2/raw/b80ac35cc40de5651c6715c6abc4f8dd23b78c5e/streetnames_gender.geojson';
console.log(map_url);

$.getJSON(test_url, function(data) {
    //var df = data.result.records;    
    console.log(data.features);

    var text = 'Success';

// Width and Height of the whole visualization
var width = 700;
var height = 580;
var margin = 20;

// Create SVG
var svg = d3.select("#boston_map")
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

    // Append empty placeholder g element to the SVG
// g will contain geometry elements
//var g = svg.append( "g" );

// Using the test data
var street = data.features.filter(street => street.properties.name == "Billrothstraße")[0]
var projection = d3.geoMercator();
var pathGenerator = d3.geoPath().projection(projection)
var test_point = [16.34636, 48.24332];
var projectedPoint = projection(test_point);
/*/

/* Using the BOS data
var street = map_data.features.filter(street => street.attributes.Name == "Roslindale")[0];
var projection = d3.geoMercator().center([0, 42.313]);
var pathGenerator = d3.geoPath().projection(projection);
var test_point = [-71.12592717485386, 42.272013107957406];
var projectedPoint = projection(test_point);

  // construct the element
  svg.append('path')
    .datum(street)
    .attr('d', pathGenerator)
    .attr('fill', 'none')
    .attr('stroke', '#999999')
    .attr('stroke-width', '2')
    
*/
//mapPath = pathGenerator(street);



console.log(projection);
console.log(street);
console.log(projectedPoint[0]);
console.log(projectedPoint[1]);

svg.append('circle')
    .attr('cx', projectedPoint[0])
    .attr('cy', projectedPoint[1])
    .attr('r', 2.5)
    .attr('fill', '#000000')
    .attr('stroke', 'none')

/*


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
    .data(map_data.features)
    .enter()
    .append( "path" )
    .attr( "fill", "#ccc" )
    .attr( "stroke", "#333")
    .attr( "d", geoPath );

    */

});

//d3.json to do this
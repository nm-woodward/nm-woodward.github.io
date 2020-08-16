/*
python3 -m http.server
*/

d3.csv("by_week.csv").then(function(data) {
  
  var d_returned_sum = 0;
  var d_app_sum = 0;
  var d_reject_sum = 0;

  for (var row = 0; row < data.length; row++) {
      d_returned_sum += parseFloat( data[row].d_ballot_returned );
      d_app_sum += parseFloat( data[row].d_apps);
      d_reject_sum += parseFloat( data[row].d_app_rejections);
  }
  
//Calculate percentage of ballots issued that were returned (from loop above)
var d_pct_returned = parseInt(parseInt(d_returned_sum)/(parseInt(d_app_sum) - parseInt(d_reject_sum))*100);
var content = '<div style=\'text-align:right\'> <span id=\"submission_rate\" >'+ d_pct_returned +'% </span>     (through Aug. 10th)</div>';
var jp = 'QiLCJhIjoiY2tkeGd3YWxzMXpjdDJ3bnVhOHptbnZlaCJ9.wZn4Da7fVXi8A9S9fIvFVQ'
$('#ballot_submission_number').append(content);

/*
//Add the bar chart for submission rate for ballots issued by week
var svgContainer = d3.select('#ballot_chart_here');
var width = 600;
var height = 600;
var margin = {top: 40, right: 30, bottom: 40, left: 50};

var svg = svgContainer.append('svg')
    .attr("width", width)
    .attr("height", height);


var xScale = d3.scaleBand().range ([0, width]).padding(0.01),
    yScale = d3.scaleLinear().range ([height, 0]);

var g = svg.append("g")
       .attr("transform", "translate(" + 10 + "," + 10 + ")");

       xScale.domain(data.map(function(d) { return d.AppDate; }));
       yScale.domain([0, d3.max(data, function(d) { return parseInt(d.d_pct_returned*100); })]);

  g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    var xAxis = d3.axisBottom()
        .scale(xScale);

    var yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10);
    
  
    svg.append("g")
        .attr("class", "axis")
        .attr('id','xAxis') 
        .attr("transform", "translate("+ margin.left + "," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-55)" );
  

    svg.append("g")
        .attr('class','axis')
        .attr('id','yAxis')    
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

    svg.selectAll("rect")
        .data(data)
        .style("fill", "grey")
        .attr("transform", "translate(" + margin.left + ",0)")
        .attr("x", function(d) { return x(d.AppDate); })
        .attr("width", xScale.bandwidth())
        .attr("y", function(d) { return y(parseInt(d.d_pct_returned*100)); })
        .attr("height", function(d) { return height - y(parseInt(d.d_pct_returned*100)); });
*/
  });




//Part 1: Grab data from API and reformat:

//var url_base = 'https://cors-anywhere.herokuapp.com/https://data.boston.gov/api/3/action/datastore_search?resource_id=6ff6a6fd-3141-4440-a880-6f60a37fe789';
//var query = "&limit=5";
var url_base = "https://data.boston.gov/api/3/action/datastore_search_sql?sql=";
var group_query = `SELECT CAST(open_dt as date) as open_dt, type, count(*) as cnt 
                 FROM \"f53ebccd-bc61-49f9-83db-625f209c95f5\" 
                 GROUP BY CAST(open_dt as date), type 
                 ORDER BY CAST(open_dt as date)`;

console.log(url_base+group_query);

//Create a master list of request types and aggregated counts for each type (accessed globally)  
var request_types = [];

var df = [];
    $.ajax({
        url: url_base + group_query,
        async: false,
        dataType: 'json',
        success: function(data) {
            df = data.result.records;
        }
    });


    console.log(df);
    var content = `<span> test </span>`;

    nested = d3.nest()
        .key(function(d) { return d.open_dt; })
        .entries(df);  

    //Create object structure: aggregated objects for each day, and "values" objects within containing specific request types within that day.    
    nested.forEach(function(group) {
        var y0 = 0;
            group.values.forEach(function(entry, index) {
              entry.y0 = y0;
              entry.y1 = +entry.cnt + y0;
              y0 = entry.y1;
            });
            group.total = group.values[group.values.length - 1].y1;
          });       

    console.log(nested);

    //Create a total count of all 2020 311 requests made (first row of the dropdown):
    var overall_obj = {};
    overall_obj["text"] = 'All Requests';
    overall_obj["cnt"] = 0;
    overall_obj["cnt_trend"] = 0;
    request_types.push(overall_obj);

    //Get current date (for use in trend counting later on)
    var today = new Date();
    var trend_lookback = 30;

    //Loop through each day in the nested object:
              for(i=0; i<nested.length; i++)
            {
              //Add the day's count to the 2020 total
              overall_obj["cnt"] += parseInt(nested[i].total);   
              
              //Add the day's count to the 30-day total if within the window:
              day = new Date(nested[i].key);
              if ((today.getTime() - day.getTime()) / (1000 * 3600 * 24) <= trend_lookback)
              {
                overall_obj["cnt_trend"] += parseInt(nested[i].total);  
              }
    
              //Loop through each request type within that day: 
                for(j=0; j<nested[i].values.length; j++)
                {
                    var type_add = nested[i].values[j].type;
                    var cnt_add = nested[i].values[j].cnt;
                    var found = -1;

                    for(k=0; k<request_types.length; k++)
                    {
                      //Check if the request_types array contains an object with this specific request type
                        if(request_types[k].text == type_add){
                            found = k;
                            break;
                        }
                    }
                    //If that request type is accounted for, add the count for the day to the master count
                    if (found >= 0) {
                        request_types[found].cnt += parseInt(cnt_add);

                        //If within trend window, add the day's count to the trend count as well
                        if ((today.getTime() - day.getTime()) / (1000 * 3600 * 24) <= trend_lookback)
                        {
                          request_types[found].cnt_trend += parseInt(cnt_add); 
                        }
                    }
                    //If the request type is not accounted for, create a new object for it
                    else { 
                        var obj = {};
                        obj["text"] = type_add;
                        obj["cnt"] = parseInt(cnt_add);
                        
                        //If within trend window, start out the trend count. Otherwise, set to 0
                        if ((today.getTime() - day.getTime()) / (1000 * 3600 * 24) <= trend_lookback)
                        {
                          obj["cnt_trend"] = parseInt(cnt_add); 
                        }  else {
                          obj["cnt_trend"] = 0; 
                        }                      
                        request_types.push(obj);
                    }

                }
            }
    //Sort request type list by most frequent first:
    //var request_types = d.values.sort((a, b) => (parseInt(b.cnt) > parseInt(a.cnt)) ? 1 : -1);
    console.log(request_types);

    //Add trend percentage to request

            
            
  ///Part 2: SVG, d3 work:

    //Create the container and svg canvas    
    var svgContainer = d3.select('#bar_chart');

    var svg = svgContainer.append('svg')
    .attr("width", 600)
    .attr("height", 500);

    //Add the dropdown for specific call types
    var span = svgContainer.append('span')
        .text('Specific Call Type: ');
    var xInput = svgContainer.append('select')
        .attr('id','callselect')
        .style('text-align-last', 'center')
        .on('change', function() {ChangeChartCategory(this.value);})
        .selectAll('option')
        .data(request_types)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text + ':  ('+ d.cnt +') requests in 2022' ;});
    svgContainer.append('br')
    
    // Set the dimensions of the canvas / graph
    var svg = d3.select("svg"),
        margin = {top: 40, right: 30, bottom: 40, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //////// Adding Tooltip on type per day:

    // Define the div for the tooltip
        var tooltip = svgContainer.append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // tooltip mouseover event handler
      var tipMouseover = function(d) {
        
          //Change fill of selected bar to blue
          d3.select(this).style("fill", "darkblue");

          //Create string of the top requests in that day
          var day_type_string = "";
          var sorted = d.values.sort((a, b) => (parseInt(b.cnt) > parseInt(a.cnt)) ? 1 : -1);

          for(i=0; i<10; i++){
            if(sorted[i].cnt >= 10) {
              day_type_string += sorted[i].type +": "+ sorted[i].cnt + "<br>";
            }
          }
         

        //Create tooltip text
        var html  = "<span style='font-size:20px'>" + d.key + ": " + d.total  
                    + " requests </span> </br></br> <span style='font-size:16px'>Top Requests:</span></br>" 
                    + day_type_string;

        //Show and format tooltip
          tooltip.html(html)
              .style("left", d3.select(this).attr("x") - 50 + "px")     
              .style("top", (d3.select(this).attr("y")+300) + "px")
            .transition()
              .duration(200) // ms
              .style("opacity", .9) // started as 0!

      };
      // tooltip mouseout event handler
      var tipMouseout = function(d) {     
        //Set fill back to grey
        d3.select(this).style("fill", "grey");
        //Hide tooltip
          tooltip.transition()
              .duration(300) // ms
              .style("opacity", 0); // don't care about position!
      };  

 
    var x = d3.scaleBand().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    //Set domain according to relevant request type (function)
    function set_scale(dataset) {  
      x.domain(dataset.map(function(d) { return d.key; }));
      y.domain([0, d3.max(dataset, function(d) { return d.total; })*1.1]);

      var yAxis = d3.axisLeft()
      .scale(y);    
      d3.select('#yAxis') // redraw the yAxis
        .transition().duration(1000)
        .call(yAxis)
    }

    //Initialize the scale with overall requests:
    set_scale(nested);

    var xAxis = d3.axisBottom()
        .scale(x)
      //  .tickFormat(d3.timeFormat("%Y-%m-%d"))
        .tickValues(x.domain().filter(function(d,i){ return !(i%10)}));

    var yAxis = d3.axisLeft()
        .scale(y);
      //  .ticks(10);
    
  
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

    svg.selectAll("bar")
      .data(nested)
      .enter().append("rect")
  
    function plot_bars(dataset) {   
      svg.selectAll("rect")
          .data(dataset)
          .style("fill", "grey")
          .attr("transform", "translate(" + margin.left + ",0)")
          .attr("x", function(d) { return x(d.key); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.total); })
          .attr("height", function(d) { return height - y(d.total); })
          .on("mouseover", tipMouseover)
          .on("mouseout", tipMouseout);
    }

    //Initialize the page with the "overall" bar chart:
    plot_bars(nested);

        function ChangeChartCategory(val) {
            var value = val;// grab user selection
            var single_type_object = [];

            if (value == 'All Requests'){
              set_scale(nested);
              plot_bars(nested);
              $('#bar_title').text("311 Request Volume");
            }

            else {
              $('#bar_title').text("Trend: " + value);
              //Build dataset specific to this type
            for(i=0; i<nested.length; i++){
                var obj = {};
                obj['key'] = nested[i].key;

                //Find the index of the desired request type in that day's array
                var index = nested[i].values.map(function(e) { return e.type; }).indexOf(value);
                
                if (index >= 0) {
                  obj['total'] = parseInt(nested[i].values[index].cnt);
                }
                else {
                  obj['total'] = 0;
                }
                single_type_object.push(obj);  
            }
            //Change the scale:
            set_scale(single_type_object);
            //Re-plot the bars:
            plot_bars(single_type_object);
            //Change Map Markers:
            ChangeMapMarkers(val); 
          }

        }

//                                                         //
// JS code producing the "Trends" section of the dashboard //
//                                                         //

// 1) Calculate % changes in request volume for each sub-type over the past 30 days
// 2) Generate alert panel at top of dashboard
// 3) Generate specific item buttons for top trending sub-types


// 1) % changes in request volume over the past 30 days

up_trend_types = [];
down_trend_types = [];
var today = new Date();
var start = new Date('2022-01-01');

for(i=0; i<request_types.length; i++)
{
    if ((request_types[i].cnt_trend / 30) /
        (request_types[i].cnt / ((today.getTime() - start.getTime()) / (1000 * 3600 * 24))) < 1) 
    {
        request_types[i].trend_perc = parseInt(100* (1- (request_types[i].cnt_trend / 30) /
        (request_types[i].cnt / ((today.getTime() - start.getTime()) / (1000 * 3600 * 24)))));  
        request_types[i].trend = "down";
        //Add to down-trend list
        down_trend_types.push(request_types[i]);

    } else {
        request_types[i].trend_perc = parseInt(100* ((request_types[i].cnt_trend / 30) /
        (request_types[i].cnt / ((today.getTime() - start.getTime()) / (1000 * 3600 * 24)))-1));  
        request_types[i].trend = "up";
        //Add to up-trend list
        up_trend_types.push(request_types[i]);
    }
}

var bt = 'pk.eyJ1Ijoibm0td29vZHdhcmQiLCJhIjoiY2s5dnc5aGd3MDN';

//Sort each trend category in descending order
var up_trend_types = up_trend_types.sort((a, b) => (parseInt(b.trend_perc) > parseInt(a.trend_perc)) ? 1 : -1);
var down_trend_types = down_trend_types.sort((a, b) => (parseInt(b.trend_perc) > parseInt(a.trend_perc)) ? 1 : -1);

//Filter out low-count request types
var up_trend_types = up_trend_types.filter(function (el) {
  return el.cnt >= 75 &&
         el.text != "All Requests";
});
var down_trend_types = down_trend_types.filter(function (el) {
  return el.cnt >= 75 &&
         el.text != "All Requests" &&
         el.text != "Unshoveled Sidewalk" &&
         el.text != "Request for Snow Plowing" &&
         el.text != "Misc. Snow Complaint";
});

// 2) Generate alert panel at top of dashboard

var overall_trend_text = request_types[0].trend == "down" ? "311 requests are down " : "311 requests are up "

var trend_message_content = '<div class="alert alert-dark" role="alert"><b>'+
                              overall_trend_text + request_types[0].trend_perc + '%</b> ' +
                              'in the last 30 days (relative to the 2022 average)'
                            + '</div>';

$('#trend_message').append(trend_message_content);

// 3) Generate specific item buttons for top trending sub-types
var up_content = "";
//Up-trending buttons
for(i=0; i<9; i++){
  up_content += '<button type="button" id = "up_button" class="btn btn-primary btn" value=\"'+
              up_trend_types[i].text+'\" onclick="ChangeChartCategory(this.value);">' +
              up_trend_types[i].text + ' (+' + up_trend_types[i].trend_perc + '%)'
          + '</button>';
}

console.log(up_content);

$('#trend_up_buttons').append(up_content);

//Down-trending buttons
var down_content = "";

for(i=0; i<6; i++){
  down_content += '<button type="button" id = "down_button" class="btn btn-primary btn" value=\"'+
              down_trend_types[i].text+'\" onclick="ChangeChartCategory(this.value);">' +
              down_trend_types[i].text + ' (-' + down_trend_types[i].trend_perc + '%)'
          + '</button>';
}

console.log(down_content);

$('#trend_down_buttons').append(down_content);



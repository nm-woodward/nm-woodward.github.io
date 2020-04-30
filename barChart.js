//Part 1: Grab data from API and reformat:

//var url_base = 'https://cors-anywhere.herokuapp.com/https://data.boston.gov/api/3/action/datastore_search?resource_id=6ff6a6fd-3141-4440-a880-6f60a37fe789';
//var query = "&limit=5";
var url_base = "https://data.boston.gov/api/3/action/datastore_search_sql?sql=";
var group_query = `SELECT CAST(open_dt as date) as open_dt, type, count(*) as cnt 
                 FROM \"6ff6a6fd-3141-4440-a880-6f60a37fe789\" 
                 GROUP BY CAST(open_dt as date), type 
                 ORDER BY CAST(open_dt as date)`;

console.log(url_base+group_query);


$.getJSON(url_base + group_query, function(data) {
    df = data.result.records;    
    var text = 'Success';

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


    //Create a master list of request types and aggregated counts for each type          
    var request_types = [];

    //Create a total count of all 2020 311 requests made (first row of the dropdown):
    var overall_obj = {};
    overall_obj["text"] = 'All Requests';
    overall_obj["cnt"] = 0;
    request_types.push(overall_obj);

    //Loop through each day in the nested object:
              for(i=0; i<nested.length; i++)
            {
              //Add the day's count to the 2020 toal
              overall_obj["cnt"] += parseInt(nested[i].total);            
    
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
                    }
                    //If the request type is not accounted for, create a new object for it
                    else { 
                        var obj = {};
                        obj["text"] = type_add;
                        obj["cnt"] = parseInt(cnt_add);
                        request_types.push(obj);
                    }

                }
            }
    //Sort request type list by most frequent first:
    //var request_types = d.values.sort((a, b) => (parseInt(b.cnt) > parseInt(a.cnt)) ? 1 : -1);
    console.dir(request_types);
            
  ///Part 2: SVG, d3 work:

    //Create the container and svg canvas    
    var svgContainer = d3.select('#bar_chart');

    //Add the dropdown for specific call types
    var span = svgContainer.append('span')
        .text('Specific Call Type: ')
    var xInput = svgContainer.append('select')
        .attr('id','callselect')
        .style('text-align-last', 'center')
        .on('change',ChangeChartCategory)
        .selectAll('option')
        .data(request_types)
        .enter()
        .append('option')
        .attr('value', function (d) { return d.text })
        .text(function (d) { return d.text + ':  ('+ d.cnt +') requests in 2020' ;})
    svgContainer.append('br')

    var svg = svgContainer.append('svg')
      .attr("width", 800)
      .attr("height", 500);
    
    // Set the dimensions of the canvas / graph
    var svg = d3.select("svg"),
        margin = {top: 100, right: 30, bottom: 40, left: 50},
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
              .style("left", (d3.event.pageX + 15) + "px")
              .style("top", (d3.event.pageY - 28) + "px")
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

        function ChangeChartCategory() {
            var value = this.value // grab user selection
            var single_type_object = [];

            if (value == 'All Requests'){
              set_scale(nested);
              plot_bars(nested);
            }

            else {
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
          }

        }

              //Sub-function to create dataset
              //Re-render chart

        function xChange() {
          var value = this.value // get the new x value
          xScale // change the xScale
          .domain([
              d3.min([d3.min(data,function (d) { return d[value] })]),
              d3.max([d3.max(data,function (d) { return d[value] })])
              ])
          xAxis.scale(xScale) // change the xScale
          d3.select('#xAxis') // redraw the xAxis
          .transition().duration(1000)
          .call(xAxis)
          d3.select('#xAxisLabel') // change the xAxisLabel
          .transition().duration(1000)
          .text(value)
          d3.selectAll('circle') // move the circles
          .transition().duration(1000)
          .delay(function (d,i) { return i*10})
              .attr('cx',function (d) { return xScale(d[value]) })
      }
  


        
});
  
    //$('#bar_chart').append(content);
                


 //Create recent records table

 
 //console.log(response.responseJSON.result);
 //var dat = JSON.parse(response.responseJSON.result.records);

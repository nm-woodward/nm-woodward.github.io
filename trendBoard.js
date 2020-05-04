// JS code producing the "Trends" section of the dashboard


// 1) Calculate % changes in request volume for each sub-type over the past 30 days
// 2) Generate alert panel at top of dashboard
// 3) Generate specific item buttons for top trending sub-types


// 1) % changes in request volume over the past 30 days
test =
var up_trend_types = [];
var down_trend_types = [];
var today = new Date();
var start = new Date('2020-01-01');

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


console.log(request_types);
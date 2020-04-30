
//var url_base = 'https://cors-anywhere.herokuapp.com/https://data.boston.gov/api/3/action/datastore_search?resource_id=6ff6a6fd-3141-4440-a880-6f60a37fe789';
//var query = "&limit=5";
var url_base = 'https://data.boston.gov/api/3/action/datastore_search_sql?sql=';
var query = `SELECT * FROM \"6ff6a6fd-3141-4440-a880-6f60a37fe789\" ORDER BY open_dt DESC LIMIT 10`;

console.log(url_base+query);

$.getJSON(url_base + query, function(data) {
    dat = data.result.records;    
    var text = 'Success';

    console.log(dat);
    var content = `<table class=\"table table-hover table-striped\" id=\"table_text\"> 
                    <tr> 
                        <th style=\"width: 15%\">Date</th> 
                        <th>Type</th> 
                        <th>Department</th> 
                        <th>Neighborhood</th> 
                        <th style=\"width: 20%\">Open/Closed</th> 
                        </tr>`;

    for(i=0; i<dat.length; i++){
        content += '<tr>';
        content += '<td>' + dat[i].open_dt.split(' ')[0] + '</td>';
        content += '<td>' + dat[i].type + '</td>';
        content += '<td>' + dat[i].reason + '</td>';
        content += '<td>' + dat[i].neighborhood + '</td>';
        if (dat[i].case_status == "Open") { 
            content += '<td>' + dat[i].case_status + '</td>';
        } else {content += '<td>' + dat[i].closure_reason + '</td>';}
        content += '</tr>';
       };
    content += "</table>";
    
    $('#recent_records_table').append(content);
                
 });


 //Create recent records table

 
 //console.log(response.responseJSON.result);
 //var dat = JSON.parse(response.responseJSON.result.records);

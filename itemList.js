var url_base = 'https://data.boston.gov/api/3/action/datastore_search_sql?sql=';
var query = `SELECT * FROM \"f53ebccd-bc61-49f9-83db-625f209c95f5\" ORDER BY open_dt DESC LIMIT 500`;

console.log(url_base+query);

var dat = [];

    $.ajax({
        url: url_base + query,
        async: false,
        dataType: 'json',
        success: function(data) {
            dat = data.result.records;
        }
    });

    console.log(dat);

    var content = `<table class=\"table table-hover table-striped\" id=\"table_text\"> 
                    <tr> 
                        <th style=\"width: 15%\">Date</th> 
                        <th>Type</th> 
                        <th>Department</th> 
                        <th>Neighborhood</th> 
                        <th style=\"width: 20%\">Open/Closed</th> 
                        </tr>`;

    for(i=0; i<50; i++){
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
    
    var aj = 'MDNlbnozaWN3OHVqMiJ9.ReuFYKLl4TKXXFywZwiPNw';     
    $('#recent_records_table').append(content);
                
console.log(content);
 //Create recent records table

 
 //console.log(response.responseJSON.result);
 //var dat = JSON.parse(response.responseJSON.result.records);

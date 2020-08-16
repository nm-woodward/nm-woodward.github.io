/*
python3 -m http.server
*/

d3.csv("by_week.csv").then(function(data) {
  console.log(data[data.length - 1].d_apps); 
  console.log(parseInt(
    (parseFloat(data[data.length - 1].d_apps) / 
    parseFloat(data[data.length - 2].d_apps) - 1) * 100));

  var d_app_total = data.reduce(function(prev, cur) {
    return prev + parseFloat(cur.d_apps);
  }, 0);

  var r_app_total = data.reduce(function(prev, cur) {
    return prev + parseFloat(cur.r_apps);
  }, 0);

  var at = 'pk.eyJ1Ijoibm0td29vZHdh';

  //Pull % change on application submissions from prior week:
  if (parseFloat(data[data.length - 1].d_apps) / parseFloat(data[data.length - 2].d_apps) > 1) 
    {var d_chg = '+' + parseInt((parseFloat(data[data.length - 1].d_apps) / parseFloat(data[data.length - 2].d_apps) - 1) * 100); }
  else {var d_chg = parseInt(1-(parseFloat(data[data.length - 1].d_apps) / parseFloat(data[data.length - 2].d_apps)) * 100); }

  //Pull % change on application submissions from prior week:
  if (parseFloat(data[data.length - 1].r_apps) / parseFloat(data[data.length - 2].r_apps) > 1) 
    {var r_chg = '+' + parseInt((parseFloat(data[data.length - 1].r_apps) / parseFloat(data[data.length - 2].r_apps) - 1) * 100); }
  else {var r_chg =  parseInt(1-(parseFloat(data[data.length - 1].r_apps) / parseFloat(data[data.length - 2].r_apps)) * 100); }

  //Format numbers with commas (function)
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

var content = `<table class=\"table table-hover table-striped\" id=\"table_text\"> 
    <tr> 
      <th></th> 
      <th>Total</th> 
      <th>This Week</th> 
      <th style=\"width: 40%\">Change (on prior week)</th> 
    </tr>
    
    <tr class=\"d_row\">
      <td>D</td>
      <td>` + numberWithCommas(d_app_total) + '</td>' +
      '<td>' + numberWithCommas(data[data.length - 1].d_apps) + '</td>' +
      '<td>' + d_chg + '%' + '</td>' +
    `</tr>

    <tr class=\"r_row\">
      <td>R</td>
      <td>` + numberWithCommas(r_app_total) + '</td>' +
      '<td>' + numberWithCommas(data[data.length - 1].r_apps) + '</td>' +
      '<td>' + r_chg + '%' + '</td>' +
    `</tr>`
    ;

    $('#application_table_here').append(content);

  });




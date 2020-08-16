d3.csv("by_week.csv").then(function(data) {
  console.log(data[data.length - 1].d_app_rejections); 
  console.log(parseInt(
    (parseFloat(data[data.length - 1].d_app_rejections) / 
    parseFloat(data[data.length - 2].d_app_rejections) - 1) * 100));

  var d_rejection_total = data.reduce(function(prev, cur) {
    return prev + parseFloat(cur.d_app_rejections);
  }, 0);

  var r_rejection_total = data.reduce(function(prev, cur) {
    return prev + parseFloat(cur.r_app_rejections);
  }, 0);

  //Pull % change on application submissions from prior week:
  if (parseFloat(data[data.length - 1].d_app_rejections) / parseFloat(data[data.length - 2].d_app_rejections) > 1) 
    {var d_rejection_chg = '+' + parseInt((parseFloat(data[data.length - 1].d_app_rejections) / parseFloat(data[data.length - 2].d_app_rejections) - 1) * 100); }
  else {var d_rejection_chg =  parseInt(1-(parseFloat(data[data.length - 1].d_app_rejections) / parseFloat(data[data.length - 2].d_app_rejections)) * 100); }

  //Pull % change on application submissions from prior week:
  if (parseFloat(data[data.length - 1].r_app_rejections) / parseFloat(data[data.length - 2].r_app_rejections) > 1) 
    {var r_rejection_chg = '+' + parseInt((parseFloat(data[data.length - 1].r_app_rejections) / parseFloat(data[data.length - 2].r_app_rejections) - 1) * 100); }
  else {var r_rejection_chg = parseInt(1-(parseFloat(data[data.length - 1].r_app_rejections) / parseFloat(data[data.length - 2].r_app_rejections)) * 100); }

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
      <td>` + numberWithCommas(d_rejection_total) + '</td>' +
      '<td>' + numberWithCommas(data[data.length - 1].d_app_rejections) + '</td>' +
      '<td>' + d_rejection_chg + '%' + '</td>' +
    `</tr>

    <tr class=\"r_row\">
      <td>R</td>
      <td>` + numberWithCommas(r_rejection_total) + '</td>' +
      '<td>' + numberWithCommas(data[data.length - 1].r_app_rejections) + '</td>' +
      '<td>' + r_rejection_chg + '%' + '</td>' +
    `</tr>`
    ;

    $('#rejection_table_here').append(content);

  });
/*
d3.csv("STATEWIDE.csv").then(function(data) {
  console.log(data[0]);
});
*/

d3.csv("https://dl.dropboxusercontent.com/s/f8aju9n410fyql1/STATEWIDE.csv?dl=1").then(function(data) {
  console.log(data[1]); // [{"Hello": "world"}, …]
});
/*
*    main.js
*/
var svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

var circle = svg.append("circle")
  .attr("cx", 100)
  .attr("cy", 250)
  .attr("r", 70)
  .attr("fill", "red");

var rect = svg.append("rect")
  .attr("x", 20)
  .attr("y", 20)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "red");

var text = svg.append("text")
  .attr("x", 200)
  .attr("y", 50)
  .attr("text-anchor", "middle")
  .attr("font-size", "24px")
  .attr("font-weight", "bold")
  .attr("fill", "darkblue")
  .text("But I'm greater!");

var pentagon = svg.append("polygon")
  .attr("points", "300,100 350,150 330,220 270,220 250,150")
  .attr("fill", "purple")
  .attr("stroke", "darkviolet")
  .attr("stroke-width", 3);

var triangle = svg.append("polygon")
  .attr("points", "100,100 150,150 50,150")
  .attr("fill", "green")
  .attr("stroke", "darkgreen")
  .attr("stroke-width", 2);

var hexagon = svg.append("polygon")
  .attr("points", "250,250 300,250 325,300 300,350 250,350 225,300")
  .attr("fill", "orange")
  .attr("stroke", "darkorange")
  .attr("stroke-width", 2);

var star = svg.append("polygon")
  .attr("points", "350,250 365,290 410,290 375,310 390,350 350,330 310,350 325,310 290,290 335,290")
  .attr("fill", "gold")
  .attr("stroke", "goldenrod")
  .attr("stroke-width", 2);

const recW = 40;
const w = 400;
const h = 400;

var svg = d3.select("#chart-area")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var data = [25, 20, 15, 10, 5];

var recs = svg.selectAll("rect").data(data);


recs.enter()
    .append("rect")
    .attr("x", (d, i) => {return (i * (recW + 25));})
    .attr("y", (d) => {return (h - d);})
    .attr("width", recW)
    .attr("height", (d) => {return d;})
    .attr("fill", "blue");



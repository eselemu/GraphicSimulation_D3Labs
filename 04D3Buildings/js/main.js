/*
*    main.js
*/

d3.json("data/buildings.json").then((data) => {
    var svg = d3.select("#chart-area")
                .append("svg")
                .attr("width", 400)
                .attr("height", 400);
    
    data.forEach((d) => {
        console.log(d);
    });
    
    var rectangles = svg.selectAll("rect").data(data);
      
    rectangles.enter()
            .append("rect")
            .attr("x", (d, i) => 50 + i * 50)
            .attr("y", (d) => 400 - (d.height / 5))
            .attr("width", 25)
            .attr("height", (d) => (d.height / 5))
            .attr("fill", "blue");
}).catch((error) => {
    console.warn(error);
});

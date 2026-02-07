/*
*    main.js
*/

d3.json("data/ages.json").then((data) => {
    var svg = d3.select("#chart-area")
                .append("svg")
                .attr("width", 400)
                .attr("height", 400);
    
    data.forEach((d) => {
        console.log(d);
    });
    
    var circles = svg.selectAll("circle").data(data);
    
    circles.enter()
            .append("circle")
            .attr("cx", (d, i) => 50 + i * 50)
            .attr("cy", 250)
            .attr("r", (d) => d.age || d)
            .attr("fill", "green");
}).catch((error) => {
    console.warn(error);
});

/*
*    main.js
*    Exercise: Margins, groups, axes and labels
*/

const canvasWidth = 600;
const canvasHeight = 400;

var margin = {
    left: 100,
    right: 10,
    top: 10,
    bottom: 100
};

const width = canvasWidth - margin.left - margin.right;
const height = canvasHeight - margin.top - margin.bottom;

d3.json("data/buildings.json").then((data) => {
    data.forEach(d => {
        d.height = Number(d.height);
    });
    
    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight);
    
    var g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    var x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);
    
    var y = d3.scaleLinear()
        .domain([0, 828])
        .range([height, 0]);
    
    var color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.schemeSet3);
    
    var bottomAxis = d3.axisBottom(x);
    
    g.append("g")
        .attr("class", "bottom axis")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");
    
    var leftAxis = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => d + "m");
    
    g.append("g")
        .attr("class", "left axis")
        .call(leftAxis);
    
    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 140)
        .attr("font-size", "16px")
        .attr("text-anchor", "middle")
        .text("The world's tallest buildings");
    
    g.append("text")
        .attr("class", "y axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "16px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Height (m)");
    
    var rectangles = g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.height))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.height))
        .attr("fill", d => color(d.name));
        
}).catch((error) => {
    console.warn(error);
});

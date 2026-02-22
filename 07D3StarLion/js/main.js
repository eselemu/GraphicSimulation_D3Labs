/*
*    main.js
*/
const canvasWidth = 800;
const canvasHeight = 500;

var margin = {
    left: 80,
    right: 30,
    top: 30,
    bottom: 80
};

const width = canvasWidth - margin.left - margin.right;
const height = canvasHeight - margin.top - margin.bottom;

d3.json("data/revenues.json").then((data) => {
    data.forEach(d => {
        d.revenue = Number(d.revenue);
        d.profit = Number(d.profit);
    });
    
    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight);
    
    var g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    var x = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0, width])
        .padding(0.3);
    
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.revenue)])
        .range([height, 0]);
    
    var color = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.revenue)])
        .range(["#69b3a2", "#2c7fb8"]);
    
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
        .ticks(8)
        .tickFormat(d => `$${d/1000}k`);
    
    g.append("g")
        .attr("class", "left axis")
        .call(leftAxis);
    
    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 60)
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .text("Month");
    
    g.append("text")
        .attr("class", "y axis-label")
        .attr("x", -(height / 2))
        .attr("y", -50)
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Revenue (USD)");
    
    g.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("font-size", "16px")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("Star Lion Brewery - Monthly Revenue");
    
    var bars = g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.month))
        .attr("y", d => y(d.revenue))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.revenue))
        .attr("fill", d => color(d.revenue))
        .attr("stroke", "#333")
        .attr("stroke-width", "1px");
    
    g.selectAll(".revenue-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "revenue-label")
        .attr("x", d => x(d.month) + x.bandwidth()/2)
        .attr("y", d => y(d.revenue) - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text(d => `$${d.revenue}`);
    
    function makeYGridlines() {
        return d3.axisLeft(y)
            .ticks(8);
    }
    
    g.append("g")
        .attr("class", "grid")
        .call(makeYGridlines()
            .tickSize(-width)
            .tickFormat("")
        )
        .selectAll(".tick line")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-dasharray", "4,4");
    
}).catch((error) => {
    console.warn("Error loading data:", error);
});

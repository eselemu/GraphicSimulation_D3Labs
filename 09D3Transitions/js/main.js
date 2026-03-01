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

var flag = true;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);

var g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var x = d3.scaleBand()
    .range([0, width])
    .padding(0.3);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxisGroup = g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", `translate(0, ${height})`);

var yAxisGroup = g.append("g")
    .attr("class", "left axis");

var yLabel = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -50)
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue (USD)");

g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 60)
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .text("Month");

g.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .text("Star Lion Brewery - Monthly Revenue");

d3.json("data/revenues.json").then((data) => {
    data.forEach(d => {
        d.revenue = Number(d.revenue);
        d.profit = Number(d.profit);
    });
    
    d3.interval(() => {
        var newData = flag ? data : data.slice(1);
        update(newData);
        flag = !flag;
    }, 1000);
    
    update(data);
    
}).catch((error) => {
    console.warn("Error loading data:", error);
});

function update(data) {
    var value = flag ? "revenue" : "profit";
    var label = flag ? "Revenue" : "Profit";
    
    x.domain(data.map(d => d.month));
    y.domain([0, d3.max(data, d => d[value])]);
    
    var color = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[value])])
        .range(["#69b3a2", "#2c7fb8"]);
    
    var t = d3.transition().duration(750);
    
    var bottomAxis = d3.axisBottom(x);
    xAxisGroup.transition(t).call(bottomAxis)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");
    
    var leftAxis = d3.axisLeft(y)
        .ticks(8)
        .tickFormat(d => `$${d/1000}k`);
    
    yAxisGroup.transition(t).call(leftAxis);
    
    yLabel.text(`${label}`);
    
    g.selectAll(".grid").remove();
    
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
    
    var bars = g.selectAll("rect").data(data, d => d.month);
    
    bars.exit()
        .attr("fill", "red")
        .transition(t)
        .attr("y", y(0))
        .attr("height", 0)
        .remove();
    
    bars.enter().append("rect")
        .attr("fill", "grey")
        .attr("y", y(0))
        .attr("height", 0)
        .attr("x", d => x(d.month))
        .attr("width", x.bandwidth())
        .merge(bars)
        .transition(t)
        .attr("x", d => x(d.month))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d[value]))
        .attr("height", d => height - y(d[value]))
        .attr("fill", d => color(d[value]))
        .attr("stroke", "#333")
        .attr("stroke-width", "1px");
    
    var labels = g.selectAll(".revenue-label").data(data, d => d.month);
    
    labels.exit().remove();
    
    labels.enter().append("text")
        .attr("class", "revenue-label")
        .attr("x", d => x(d.month) + x.bandwidth()/2)
        .attr("y", d => y(d[value]) - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text(d => `$${d[value]}`)
        .merge(labels)
        .transition(t)
        .attr("x", d => x(d.month) + x.bandwidth()/2)
        .attr("y", d => y(d[value]) - 5)
        .text(d => `$${d[value]}`);
}

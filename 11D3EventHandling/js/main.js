const canvasWidth = 1200;
const canvasHeight = 700;
var margin = {
    left: 100,
    right: 30,
    top: 50,
    bottom: 100
};
const width = canvasWidth - margin.left - margin.right;
const height = canvasHeight - margin.top - margin.bottom;

var formattedData = [];
var time = 0;
var interval = null;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);

var g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var xScale = d3.scaleLog()
    .domain([142, 150000])
    .range([0, width])
    .clamp(true);

var yScale = d3.scaleLinear()
    .domain([0, 90])
    .range([height, 0]);

var areaScale = d3.scaleLinear()
    .domain([2000, 1400000000])
    .range([25 * Math.PI, 1500 * Math.PI]);

var colorScale = d3.scaleOrdinal()
    .domain(["africa", "americas", "asia", "europe", "oceania"])
    .range(d3.schemePastel1);

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`);

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 60)
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .text("Income per person (GDP/capita, PPP$ inflation-adjusted)");

g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Life expectancy (years)");

var yearLabel = g.append("text")
    .attr("class", "year-label")
    .attr("x", width - 100)
    .attr("y", height - 30)
    .attr("font-size", "60px")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("fill", "#e0e0e0")
    .text("1800");

var legend = g.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 150}, 20)`);

var continents = ["africa", "americas", "asia", "europe", "oceania"];
continents.forEach((continent, i) => {
    var legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 25})`);

    legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colorScale(continent))
        .attr("stroke", "#333")
        .attr("stroke-width", "0.5px");

    legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("font-size", "12px")
        .text(continent.charAt(0).toUpperCase() + continent.slice(1));
});

var tooltipDiv = d3.select("body")
    .append("div")
    .attr("class", "d3-tip")
    .style("opacity", 0)
    .style("position", "fixed")
    .style("pointer-events", "none");

function tipShow(event, d) {
    var text = "<strong>Country:</strong>";
    text += "<span style='color:#ff8a80'> " + d.country + "</span><br>";
    text += "<strong>Continent:</strong> ";
    text += "<span style='color:#ff8a80;text-transform:capitalize'>" + d.continent + "</span><br>";
    text += "<strong>Life Expectancy:</strong> ";
    text += "<span style='color:#ff8a80'>" + d3.format(".2f")(d.life_exp) + "</span><br>";
    text += "<strong>GDP Per Capita:</strong> ";
    text += "<span style='color:#ff8a80'>" + d3.format("$,.0f")(d.income) + "</span><br>";
    text += "<strong>Population:</strong> ";
    text += "<span style='color:#ff8a80'>" + d3.format(",.0f")(d.population) + "</span><br>";

    tooltipDiv
        .html(text)
        .style("opacity", 1)
        .style("left", (event.clientX + 14) + "px")
        .style("top", (event.clientY - 10) + "px");
}

function tipMove(event) {
    tooltipDiv
        .style("left", (event.clientX + 14) + "px")
        .style("top", (event.clientY - 10) + "px");
}

function tipHide() {
    tooltipDiv.style("opacity", 0);
}

function step() {
    time = (time < formattedData.length - 1) ? time + 1 : 0;
    update(formattedData[time]);
}

function update(yearData) {
    var continent = $("#continent-select").val();

    var data = yearData.countries.filter((d) => {
        if (continent === "all") { return true; }
        return d.continent === continent;
    });

    $("#date-slider").slider("value", yearData.year);
    $("#year")[0].innerHTML = yearData.year;
    yearLabel.text(yearData.year);

    var t = d3.transition().duration(750);

    var xAxis = d3.axisBottom(xScale)
        .tickValues([400, 4000, 40000])
        .tickFormat(d => `$${d}`);

    var yAxis = d3.axisLeft(yScale).ticks(10);

    xAxisGroup.transition(t).call(xAxis);
    yAxisGroup.transition(t).call(yAxis);

    g.selectAll(".grid").remove();

    g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale)
            .ticks(10)
            .tickSize(-width)
            .tickFormat("")
        )
        .selectAll(".tick line")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-dasharray", "4,4");

    g.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale)
            .tickValues([400, 4000, 40000])
            .tickSize(-height)
            .tickFormat("")
        )
        .selectAll(".tick line")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-dasharray", "4,4");

    var circles = g.selectAll("circle")
        .data(data, d => d.country);

    circles.exit()
        .transition(t)
        .attr("r", 0)
        .remove();

    var entered = circles.enter()
        .append("circle")
        .attr("cx", d => xScale(d.income))
        .attr("cy", d => yScale(d.life_exp))
        .attr("r", 0)
        .attr("fill", d => colorScale(d.continent))
        .attr("stroke", "#333")
        .attr("stroke-width", "0.5px")
        .attr("opacity", 0.7)
        .on("mouseover", tipShow)
        .on("mousemove", tipMove)
        .on("mouseout", tipHide);

    entered.merge(circles)
        .transition(t)
        .attr("cx", d => xScale(d.income))
        .attr("cy", d => yScale(d.life_exp))
        .attr("r", d => Math.sqrt(areaScale(d.population) / Math.PI));
}

d3.json("data/data.json").then((rawData) => {
    formattedData = rawData.map((yearData) => {
        return {
            year: yearData.year,
            countries: yearData.countries.filter((country) => {
                return country.income != null &&
                       country.life_exp != null &&
                       country.population != null;
            }).map((country) => {
                return {
                    continent: country.continent,
                    country: country.country,
                    income: +country.income,
                    life_exp: +country.life_exp,
                    population: +country.population
                };
            })
        };
    }).filter(yd => yd.countries.length > 0);

    $("#date-slider").slider({
        min: 1800,
        max: 2014,
        step: 1,
        slide: (event, ui) => {
            clearInterval(interval);
            interval = null;
            $("#play-button").attr("data-playing", "false").html("&#9654; Play");

            time = ui.value - 1800;
            update(formattedData[time]);
        }
    });

    update(formattedData[0]);

    $("#play-button").on("click", function() {
        var button = $(this);
        if (button.attr("data-playing") !== "true") {
            button.attr("data-playing", "true");
            button.html("&#9646;&#9646; Pause");
            interval = setInterval(step, 100);
        } else {
            button.attr("data-playing", "false");
            button.html("&#9654; Play");
            clearInterval(interval);
            interval = null;
        }
    });

    $("#reset-button").on("click", () => {
        clearInterval(interval);
        interval = null;
        $("#play-button").attr("data-playing", "false").html("&#9654; Play");

        time = 0;
        update(formattedData[time]);
    });

    $("#continent-select").on("change", () => {
        update(formattedData[time]);
    });

}).catch((error) => {
    console.warn("Error loading data:", error);
});

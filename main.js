const width = 1000;
const height = 700;

let xScale;
let yScale;
let asianData;
let degreeScale;
let tooltip;

const margin = { top: 25, right: 30, bottom: 100, left: 30 };

const line8 = d3.select("#line8");
const line16 = d3.select("#line16");
const line20= d3.select("#line20");

let svg = d3.select("#svg")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width, height]);

function setupChart() {
    svg = d3.select("#svg")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr("viewBox", [0, 0, width, height]);

    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    degreeScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);
}

async function loadAsianData() {
    await d3.csv('../assets/data/asian-groups.csv').then(data => {
        asianData = data;
        console.log(data);
    });
}

function drawChart() {
    svg.selectAll("*").remove();

    let xScale = d3.scaleBand()
        .domain(asianData.map(d => d['Ethnicity']))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    let yScale = d3.scaleLinear()
        .domain([0, 140000])
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
    .attr("fill", "steelblue")
    .selectAll(".income-bar")
    .data(asianData)
    .enter()
    .append("rect")
        .attr("class", "income-bar")
        .attr("x", d => xScale(d['Ethnicity']))
        .attr("y", d => yScale(+d['Median household income']))
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => height - margin.bottom - yScale(+d['Median household income']));

    svg.append("g")
        .attr("fill", "Coral")
        .selectAll(".degree-bar")
        .data(asianData)
        .enter()
        .append("rect")
            .attr("class", "degree-bar")
            .attr("x", d => xScale(d['Ethnicity']) + xScale.bandwidth() / 2)
            .attr("y", d => degreeScale(+d['Percentage of adults with bachelors']))
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", d => height - margin.bottom - degreeScale(+d['Percentage of adults with bachelors']));

    // second y axis for the degree scale
    svg.append("g")
        .attr("transform", `translate(${width - margin.right}, 0)`)
        .call(d3.axisRight(degreeScale))
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("font-size", "12px")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .style("fill", "Coral");

    // second y axis label
    svg.append("text")
        .text("Percentage with Bachelor's Degree")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", width - margin.right + 50)
        .attr("text-anchor", "middle")
        .style("fill", "Coral")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .attr("font-size", "18px");

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-0.6em")
        .attr("dy", "0.3em")
        .attr("font-size", "12px")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .style("fill", "black");

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .style("fill", "steelblue");

    svg.append("text")
        .text("Ethnicity")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .style("fill", "#2d3a5e")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .attr("font-size", "18px");

    svg.append("text")
        .text("Median Household Income")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", margin.left - 65)
        .attr("text-anchor", "middle")
        .style("fill", "steelblue")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .attr("font-size", "18px");

    // Visualization Title
    svg.append("text")
        .text("Median Household Income & Percentage of Adults with a Bachelor's Degree by Asian Ethnicity, 2021")
        .attr("x", width / 2)
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle")
        .style("fill", "#2d3a5e")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .attr("font-size", "19px");

    incomeTooltip();
    degreeTooltip();

    line8.on("click", function () {
        console.log("line 8 clicked");
        drawBachelorPercentageChart();
    });

    line16.on("click", function () {
        console.log("line 16 clicked");
        drawMedianIncomeChart();
    });

    line20.on("click", function () {
        drawChart();
    });
}

function drawMedianIncomeChart() {
    svg.selectAll("*").remove();
    // Sort the data ascending based on Median Household Income
    asianData.sort((a, b) => d3.ascending(+a['Median household income'], +b['Median household income']));

    // Create scales for the Median Household Income chart
    let xScale = d3.scaleBand()
        .domain(asianData.map(d => d['Ethnicity']))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    let yScale = d3.scaleLinear()
        .domain([0, 140000])
        .range([height - margin.bottom, margin.top]);

    // Draw the Median Household Income chart
    svg.append("g")
        .attr("fill", "steelblue")
        .selectAll(".income-bar")
        .data(asianData)
        .enter()
        .append("rect")
            .attr("class", "income-bar")
            .attr("x", d => xScale(d['Ethnicity']))
            .attr("y", d => yScale(+d['Median household income']))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(+d['Median household income']));

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-0.6em")
        .attr("dy", "0.3em")
        .attr("font-size", "12px")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .style("fill", "black");

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .attr("font-size", "12px")
        .style("fill", "steelblue");

    svg.append("text")
        .text("Ethnicity")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .style("fill", "#2d3a5e")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .attr("font-size", "18px");

    svg.append("text")
        .text("Median Household Income")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", margin.left - 65)
        .attr("text-anchor", "middle")
        .style("fill", "steelblue")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .attr("font-size", "18px");

    // Visualization Title
    svg.append("text")
        .text("Median Household Income by Asian Ethnicity, 2021")
        .attr("x", width / 2)
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle")
        .style("fill", "#2d3a5e")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .attr("font-size", "19px");

    incomeTooltip();

}

function drawBachelorPercentageChart() {
    svg.selectAll("*").remove();
    // Sort the data ascending based on Percentage of Adults with Bachelor's Degree
    asianData.sort((a, b) => d3.ascending(+a['Percentage of adults with bachelors'], +b['Percentage of adults with bachelors']));

    // Create scales for the Bachelor's Degree chart
    let xScale = d3.scaleBand()
        .domain(asianData.map(d => d['Ethnicity']))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    let yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

    // Draw the Bachelor's Degree chart
    svg.append("g")
        .attr("fill", "Coral")
        .selectAll(".degree-bar")
        .data(asianData)
        .enter()
        .append("rect")
            .attr("class", "degree-bar")
            .attr("x", d => xScale(d['Ethnicity']))
            .attr("y", d => yScale(+d['Percentage of adults with bachelors']))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(+d['Percentage of adults with bachelors']));

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-0.6em")
        .attr("dy", "0.3em")
        .attr("font-size", "12px")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .style("fill", "black");

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(degreeScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .style("fill", "Coral");

    svg.append("text")
        .text("Ethnicity")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .style("fill", "#2d3a5e")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .attr("font-size", "18px");

    svg.append("text")
        .text("Percentage of adults with bachelors")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", margin.left - 50)
        .attr("text-anchor", "middle")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .style("fill", "Coral")
        .attr("font-size", "18px");

    // Visualization Title
    svg.append("text")
        .text("Percentage of Adults age 25 and up with a Bachelor's Degree by Asian Ethnicity, 2021")
        .attr("x", width / 2)
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle")
        .style("fill", "#2d3a5e")
        .style("font-family", "Ubuntu, Roboto, sans-serif")
        .attr("font-size", "19px");

    degreeTooltip();
}

function highlightPoetry(lines) {
    const poemLines = d3.selectAll(".line");
    poemLines.classed("highlighted", false);
    lines.forEach(line => {
        d3.select(`#line${line}`).classed("highlighted", true);
    });

    setTimeout(() => {
        poemLines.classed("highlighted", false);
    }, 1000);
}

function incomeTooltip() {
    // Tooltips for the income bar
    svg.selectAll(".income-bar")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .style("fill", "lightblue")
                .style("cursor", "pointer");

            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(
                `<strong>Ethnicity:</strong> ${d['Ethnicity']}<br>` +
                `<strong>Median Household Income:</strong> $${(+d['Median household income']).toLocaleString()}`
            )
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .style("fill", "steelblue");

        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    })
    .on("click", function(d) {
        highlightPoetry([16]);
    });
}

function degreeTooltip() {
    // Tooltips for the degree bar
    svg.selectAll(".degree-bar")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style("fill", "lightcoral")
                .style("cursor", "pointer");

            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(
                `<strong>Ethnicity:</strong> ${d['Ethnicity']}<br>` +
                `<strong>Bachelor's Degree:</strong> ${d['Percentage of adults with bachelors']}%`
            )
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px")
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .style("fill", "Coral");

        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    })
    .on("click", function(d) {
        highlightPoetry([8]);
    });
}

async function initialise() {
    await loadAsianData();
    setupChart();
    drawChart();
}

initialise();

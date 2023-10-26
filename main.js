const width = 800;
const height = 500;

let xScale;
let yScale;

const margin = { top: 30, right: 30, bottom: 80, left: 30 };


let svg = d3.select("#svg")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width, height])

d3.csv('../assets/data/asian-groups.csv').then(function (data) {
    console.log(data);

    // Sorting the data ascending
    data.sort((a, b) => d3.ascending(+a['Median household income'], +b['Median household income']));

    // incorporate percentage of adults with a bachelors
    let degreeScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleBand()
        .domain(data.map(d => d['Ethnicity']))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return parseInt(d['Median household income']);
        })])
        .range([height - margin.bottom, margin.top]);

    let colourScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return parseInt(d['Median household income']);
        })])
        .range([255, 0]);

    svg.append("g")
        .attr("fill", "steelblue")
        .selectAll(".income-bar")
        .data(data)
        .enter()
        .append("rect")
            .attr("class", "income-bar")
            .attr("x", d => xScale(d['Ethnicity']))
            .attr("y", d => yScale(+d['Median household income']))
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", d => height - margin.bottom - yScale(+d['Median household income']));

    svg.append("g")
        .attr("fill", "orange")
        .selectAll(".degree-bar")
        .data(data)
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
        .style("fill", "orange");

    // second y axis label
    svg.append("text")
        .text("Percentage with Bachelor's Degree")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", width - margin.right + 50)
        .attr("text-anchor", "middle")
        .style("fill", "orange")
        .attr("font-size", "16px");

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-0.6em")
        .attr("dy", "0.3em")
        .style("fill", "black")

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("fill", "steelblue");

    svg.append("text")
        .text("Ethnicity")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px");

    svg.append("text")
        .text("Median Household Income")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", margin.left - 50)
        .attr("text-anchor", "middle")
        .style("fill", "steelblue")
        .attr("font-size", "16px");
});

svg.node();

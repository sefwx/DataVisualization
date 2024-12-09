// Fetch the data from the JSON file and draw the chart
async function fetchData() {
  const url = "./data.json"; // Path to data.json
  let response = await fetch(url);

  if (response.ok) {
    let json = await response.json();
    drawChart(json.milks); // Use the milk dataset
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

// Draw the chart
function drawChart(data) {
  const container = document.getElementById("container");
  container.innerHTML = ""; // Clear any existing content

  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  // Create the SVG container
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height);

  // Scales
  const xScale = d3
    .scaleBand()
    .domain(data.map(d => d.type))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);

  // Axes
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", "#fff");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  // Bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.type))
    .attr("y", d => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d.value))
    .attr("fill", "white");

  // Labels
  svg
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.type) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.value) - 5)
    .attr("text-anchor", "middle")
    .style("fill", "#fff")
    .text(d => `${d.value}%`);

  // Append the SVG to the container
  container.append(svg.node());
}

// Fetch and render the chart
fetchData();
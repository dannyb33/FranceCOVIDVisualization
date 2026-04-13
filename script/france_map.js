async function drawMap() {

  // --- Load datasets ---
  const tx_data = await d3.csv("Data/tx_incid_clean.csv", d => ({
    lib_dep: d.lib_dep,
    val: +d.tx_incid
  }));

  const to_data = await d3.csv("Data/to_clean.csv", d => ({
    lib_dep: d.lib_dep,
    val: +d.TO
  }));

  const r_data = await d3.csv("Data/r_clean.csv", d => ({
    lib_dep: d.lib_dep,
    val: +d.R
  }));

  // --- Store datasets ---
  const datasets = {
    tx: tx_data,
    to: to_data,
    r: r_data
  };

  let currentKey = "tx";

  // --- Load geo ---
  const geo = await d3.json("Data/departements.geojson");

  // --- Projection ---
  const projection = d3.geoMercator().fitSize([975, 610], geo);
  const path = d3.geoPath(projection);

  // --- Tooltip ---
  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "8px 10px")
    .style("border-radius", "6px")
    .style("box-shadow", "0 2px 10px rgba(0,0,0,0.2)")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("font-size", "13px")
    .style("z-index", 9999);

  // --- SVG ---
  const svg = d3.select("#chart1")
    .append("svg")
    .attr("width", 975)
    .attr("height", 610)
    .attr("viewBox", [0, 0, 975, 610])
    .attr("style", "max-width: 100%; height: auto;");

  // --- Draw map once ---
  svg.append("g")
    .selectAll("path")
    .data(geo.features)
    .join("path")
    .attr("d", path)
    .attr("stroke", "none");

  // --- Update function ---
  function updateMap(key) {
    const data = datasets[key];

    let domain;

    if (key === "r") domain = [1.0, 1.05];
    else if (key === "to") domain = [0.0, 0.5];
    else domain = [290, 450];

    const color = d3.scaleSequential()
      .domain(domain)
      .interpolator(
        key === "r" ? d3.interpolateBlues :
        key === "to" ? d3.interpolateGreens :
        d3.interpolateOranges
      );

    const valuemap = new Map(data.map(d => [d.lib_dep, d.val]));

    // --- Update legend ---
    svg.selectAll(".legend").remove();
    addColorbarLegend(svg, color, key);

    // --- Update fills ---
    svg.selectAll("path")
      .transition()
      .duration(500)
      .attr("fill", d => {
        const v = valuemap.get(d.properties.nom);
        return v != null ? color(v) : "#eee";
      });

    // --- Update interactions ---
    svg.selectAll("path")
      .on("mouseover", function (event, d) {
        const v = valuemap.get(d.properties.nom);

        d3.select(this)
          .style("cursor", "pointer")
          .attr("stroke", "#762d00")
          .attr("stroke-width", 1.2)
          .attr("opacity", 0.75);

        tooltip
          .style("opacity", 1)
          .html(`
            <strong>${d.properties.nom}</strong><br/>
            ${getLabel(key)}: ${v != null ? v.toFixed(3) : "No data"}
          `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke", "none")
          .attr("opacity", 1);

        tooltip.style("opacity", 0);
      });
  }

  // --- Legend ---
  function addColorbarLegend(svg, color, key, width = 260) {

    const height = 10;

    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(600,20)");

    const defs = svg.append("defs");

    const [min, max] = color.domain();

    // --- Gradient ---
    const gradientId = `color-gradient-${key}`;

    const gradient = defs.append("linearGradient")
      .attr("id", gradientId);

    const stops = d3.range(10).map(i => ({
      offset: i / 9,
      color: color(min + (i / 9) * (max - min))
    }));

    gradient.selectAll("stop")
      .data(stops)
      .join("stop")
      .attr("offset", d => `${d.offset * 100}%`)
      .attr("stop-color", d => d.color);

    legend.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", `url(#${gradientId})`);

    legend.append("text")
      .attr("x", 0)
      .attr("y", -10)
      .style("font-size", "13px")
      .style("font-weight", "600")
      .text(getLabel(key));

    // --- Ticks ---
    const ticks = d3.scaleLinear()
      .domain([min, max])
      .ticks(5);

    const xScale = d3.scaleLinear()
      .domain([min, max])
      .range([0, width]);

    const tickGroup = legend.append("g")
      .attr("transform", `translate(0, ${height})`);

    tickGroup.selectAll("line")
      .data(ticks)
      .join("line")
      .attr("x1", d => xScale(d))
      .attr("x2", d => xScale(d))
      .attr("y1", 0)
      .attr("y2", 6)
      .attr("stroke", "#333");

    tickGroup.selectAll("text")
      .data(ticks)
      .join("text")
      .attr("x", d => xScale(d))
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .text(d => d.toFixed(2));
  }

  function getLabel(key) {
    if (key === "tx") return "Incidence Rate";
    if (key === "to") return "Occupancy Rate";
    if (key === "r") return "Virus Reproduction Rate";
  }

  // --- Initial render ---
  updateMap(currentKey);

  // --- Dropdown control ---
  d3.select("#dataset-select")
    .on("change", function () {
      currentKey = this.value;
      updateMap(currentKey);
    });
}

drawMap();
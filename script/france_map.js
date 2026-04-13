async function drawMap() {
  const data = await d3.csv("Data/cleaned_france.csv", d => ({
    lib_dep: d.lib_dep,
    tx_incid: +d.tx_incid
  }));

const color = d3.scaleSequential()
  .domain(d3.extent(data, d => d.tx_incid))
  .interpolator(d3.interpolateOranges);

  const valuemap = new Map(data.map(d => [d.lib_dep, d.tx_incid]));

  const geo = await d3.json("Data/departements.geojson");

  const projection = d3.geoMercator().fitSize([975, 610], geo);
  const path = d3.geoPath(projection);

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
    .style("z-index", 9999);   // ✅ ADD THIS

  const svg = d3.select("#chart1")
    .append("svg")
      .attr("width", 975)
      .attr("height", 610)
      .attr("viewBox", [0, 0, 975, 610])
      .attr("style", "max-width: 100%; height: auto;");

  addColorbarLegend(svg, color);

  svg.append("g")
    .selectAll("path")
    .data(geo.features)
    .join("path")
    .attr("fill", d => {
      const v = valuemap.get(d.properties.nom);
      return v != null ? color(v) : "#eee";
    })
    .attr("d", path)
    .attr("stroke", "none")

    // 🖱️ Hover interactions
    .on("mouseover", function (event, d) {

      const v = valuemap.get(d.properties.nom);

      d3.select(this)
        .style("cursor", "pointer")   // 👈 change cursor
        .attr("stroke", "#762d00")
        .attr("stroke-width", 1.2)
        .attr("opacity", 0.75);

      tooltip
        .style("opacity", 1)
        .html(`
          <strong>${d.properties.nom}</strong><br/>
          Incidence: ${v != null ? v.toFixed(1) : "No data"}
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

function addColorbarLegend(svg, color, width = 260) {

  const height = 10;

  const legend = svg.append("g")
    .attr("transform", "translate(600,20)");

  const defs = svg.append("defs");

  const domain = color.domain();
  const min = domain[0];
  const max = domain[1];

  // --- Gradient ---
  const gradient = defs.append("linearGradient")
    .attr("id", "color-gradient");

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
    .style("fill", "url(#color-gradient)");

  legend.append("text")
    .attr("x", 0)
    .attr("y", -10)
    .style("font-size", "13px")
    .style("font-weight", "600")
    .text("Incidence Rate");

  // --- Ticks ---
  const tickCount = 5;

  const ticks = d3.scaleLinear()
    .domain([min, max])
    .ticks(tickCount);

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
    .text(d => d.toFixed(1));
}

drawMap();


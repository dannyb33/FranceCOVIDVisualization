async function sankey() {
  const width = 928;
  const height = 600;
  const format = d3.format(",");

    const data = {
        nodes: [
            { name: "Hospitalized" },
            { name: "Recovered" },
            { name: "Deaths" },
            { name: "Unknown" }
        ],
        links: [
            { source: "Hospitalized", target: "Recovered", value: 907351 },
            { source: "Hospitalized", target: "Deaths", value: 139592 },
            { source: "Hospitalized", target: "Unknown", value: 27449 }
        ]
    };  

  const color = d => ({
    "Recovered": "#006aff",
    "Deaths": "#aeabab",
    "Unknown": "#ff4c4c",
    "Hospitalized": "#727272"
  }[d.name]);

  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "8px 10px")
    .style("border-radius", "6px")
    .style("box-shadow", "0 2px 10px rgba(0,0,0,0.2)")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("font-size", "13px");

  const svg = d3.select("#chart5")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("max-width", "100%")
    .style("height", "auto");

    const defs = svg.append("defs");

  const sankeyGen = d3.sankey()
    .nodeId(d => d.name)
    .nodeAlign(d3.sankeyLeft)   // ✅ fixed
    .nodeWidth(20)
    .nodePadding(15)
    .extent([[1, 1], [width - 1, height - 1]]);

  const { nodes, links } = sankeyGen({
    nodes: data.nodes.map(d => ({ ...d })),
    links: data.links.map(d => ({ ...d }))
  });

  // 🔷 LINKS
// 🔷 LINKS (with gradients)
svg.append("g")
  .attr("fill", "none")
  .selectAll("path")
  .data(links)
  .join("path")
  .attr("d", d3.sankeyLinkHorizontal())
  .attr("stroke", d => {

    const id = `${d.source.name}-${d.target.name}`;

    const gradient = defs.append("linearGradient")
      .attr("id", id)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", d.source.x1)
      .attr("x2", d.target.x0)
      .attr("y1", 0)
      .attr("y2", 0);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color(d.source));

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color(d.target));

    return `url(#${id})`;
  })
  .attr("stroke-width", d => Math.max(1, d.width))
  .attr("opacity", 0.8)
  .on("mouseover", function (event, d) {

    d3.select(this)
      .style("cursor", "pointer");

    tooltip
      .style("opacity", 1)
      .html(`
        <strong>${d.source.name} → ${d.target.name}</strong><br/>
        ${d.value}
      `);
  })

  .on("mousemove", function (event) {
    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY + 10) + "px");
  })
  .on("mouseout", function () {
    tooltip.style("opacity", 0); 
  });


  // 🔷 NODES
  const rect = svg.append("g")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => color(d));

  // 🏷️ TOOLTIP
  rect.append("title")
    .text(d => `${d.name}: ${format(d.value)}`);

  // 🔤 LABELS
  svg.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.name);
}

sankey();
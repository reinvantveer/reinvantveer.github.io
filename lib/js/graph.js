/**
 * Created by reinv on 4-11-2016.
 */
var simulation;

function renderGraph(graph) {
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(100).strength(0.5))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  var nodes = graph.nodes,
    nodeById = d3.map(nodes, function(d) { return d.id; }),
    links = graph.links,
    bilinks = [];

  links.forEach(function(link) {
    var s = link.source = nodeById.get(link.source),
      t = link.target = nodeById.get(link.target),
      i = {}; // intermediate node
    nodes.push(i);
    links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
  });

  var link = svg.selectAll(".link")
    .data(bilinks)
    .enter().append("path")
    .attr("class", "link");

  var node = svg.selectAll(".node")
    .data(nodes.filter(function(d) { return d.id; }))
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("title")
    .text(function(d) { return d.id; });

  node.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.id });

  simulation
    .nodes(nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(links);

  function ticked() {
    link.attr("d", positionLink);
    node.attr("transform", positionNode);
  }
}

function positionLink(d) {
  return "M" + d[0].x + "," + d[0].y
    + "S" + d[1].x + "," + d[1].y
    + " " + d[2].x + "," + d[2].y;
}

function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x, d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x, d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null, d.fy = null;
}
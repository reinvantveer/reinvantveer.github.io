/**
 * Created by reinv on 24-10-2016.
 */
"use strict";

$('#csv').on('keypress', function (e) {
  if (e.which == 13) {
    $('#nquads').trigger('change');
    return true;
  }
});

function createTable(csvData) {
// create the table & table head
  var table = d3.select('#table')
    .append('table')
    .attr('class', 'table-striped');

  table.append('thead')
    .append('tr')
    .selectAll('th')
    .data(csvData.columns).enter()
    .append('th')
    .attr('style', 'color: #774141;')
    .text(function (d) {
      return d;
    });

  table.append('tbody')
    .selectAll('tr')
    .data(csvData).enter()
    .append('tr')
    .selectAll('td')
    .data(function (row, i) {
      return csvData.columns.map(function (column) {
        return row[column];
      });
    }).enter()
    .append('td')
    .text(function (d) {
      return d;
    });
};

function createGraph(csvData) {
  var d3graph = {};
  d3graph.nodes = [];

  csvData.forEach(function (record) {
    var source = {
      id: record.name,
      group: 1
    };
    var already = d3graph.nodes
      .filter(function (node) { return node.id === source.id; });
    if (!already.length) d3graph.nodes.push(source);

    var target = {
      id: record.link,
      group: 1
    };
    var already = d3graph.nodes
      .filter(function (node) { return node.id === target.id; });
    if (!already.length) d3graph.nodes.push(target);

    d3graph.links = csvData.map(function (row) {
      var link = {
        source: row.name,
        target: row.link,
        value: 'foaf:knows'
      };
      return link;
    })

  });

  console.log(d3graph);
  renderGraph(d3graph);
}

$('#csv').bind('input propertychange', function() {
  $('#table').empty();
  var csvData = d3.csvParse(this.value);
  createTable(csvData);

  $('#svg').empty();

  createGraph(csvData);

  if (csvData.length) {
    var context = JSON.parse($('#context').text());
    var jsonld = compact(csvData[0], context, 0);
    $('#JSON-LD').text(JSON.stringify(jsonld, null, 2));

    var data = csvData;
    try {
      delete data.columns;
      checkKeys(data, context);
      checkContext(context);
      transform(data, context)
        .then(function (nquads) {
          $('#nquads').text(nquads.join(''));
        });
    } catch (err) {
      return console.error(err);
    }
  }

});
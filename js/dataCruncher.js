/**
 * Created by reinv on 24-10-2016.
 */
$('#csv').keypress(function (e) {
  if (e.which == 13) {
    $('#nquads').trigger('change');
    return true;
  }
});

$('#csv').bind('input propertychange', function() {
  $( "#table" ).empty();
  var csvData = d3.csvParse(this.value);
  // console.log('d3 said', csvData);

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
    .text(function(d){return d;});

  table.append('tbody')
    .selectAll('tr')
    .data(csvData).enter()
    .append('tr')
    .selectAll('td')
    .data(function(row, i) {
      return csvData.columns.map(function(column) {
        return row[column];
      });
    }).enter()
    .append('td')
    .text(function(d){return d;});

  if (csvData.length) {
    var context = JSON.parse($("#context").text());

    try {
      var data = csvData;
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
/**
 * Created by reinv on 28-10-2016.
 */
'use strict';
var socialNetwork;
var mimeType = 'text/turtle';
var sparqlQuery = 'select * where { ' +
  '?name <http://xmlns.com/foaf/0.1/knows>/<http://xmlns.com/foaf/0.1/knows>/<http://xmlns.com/foaf/0.1/knows> ?name . ' +
  '}';

rdfstore.create(function(err, store) {
  if (err) return console.error(err);
  socialNetwork = store;
});

$('#nquads').on('change', function() {
  socialNetwork.load(mimeType, $('#nquads').text(), function (err, result) {
    if (err) return console.error(err);
    console.log(result + ' triples loaded');
    socialNetwork.execute(sparqlQuery, function (status, results) {
      if (results.length) {
        alert('Hey! You\'re part of a circle!');
        console.log(results);
      }
    });
  });
});

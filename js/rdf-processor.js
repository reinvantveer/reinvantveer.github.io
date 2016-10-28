/**
 * Created by reinv on 28-10-2016.
 */
'use strict';

var uri = 'http://mysocialnetwork.org/graph';
var store = $rdf.graph();
var mimeType = 'text/turtle';

$('#nquads').on('change', function() {
  try {
    $rdf.parse($('#nquads').text(), store, uri, mimeType);
  } catch (err) {
    console.error(err);
  }
});
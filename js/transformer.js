'use strict';

function checkKeys(csvData, context) {
  var missingKeys = [];

  Object.keys(csvData[0]).forEach(function (key) {
    if (!_.has(context, '@context.' + key)) missingKeys.push(key);
  });

  var bootstrapContext = {};
  missingKeys.forEach(function (missingKey) {
    bootstrapContext[missingKey] = 'prefix:' + missingKey;
  });
  if (missingKeys.length) throw Error('Add ' + JSON.stringify(bootstrapContext, null, 2) + ' to context file.');
}

function checkContext(context) {
  if (!context) throw Error('Please supply a non-empty context');
  if (!context['@context']) throw Error('missing "@context" key in context');
  if (!context['@context']['@base']) throw Error('missing "@base" URL key in "@context"');
  return 'OK';
}

function transformRow(row, context, index) {
  return new Promise(function (resolve, reject) {
    var compacted = row;
    var subjectKey = context['@subject'];

    Object.keys(compacted).forEach(function (compactedKey) {
      if (compacted[compactedKey].toLowerCase() === 'null') {
        if (compactedKey === subjectKey) {
          //reject(new Error(`Unable to create rdf subject from NULL value on ${subjectKey} at row line ${index + 2}`));
          console.warn('Unable to drop rdf subject NULL value on ' + subjectKey + ' at row line ' + (index + 2));
        } else {
          delete compacted[compactedKey];
        }
      }
    });

    compacted['@context'] = context['@context'];
    compacted['@type'] = context['@type'];

    if (!compacted[subjectKey]) return reject(new Error('There is no column ' + subjectKey + ' in the table, see row: ' + JSON.stringify(compacted)));
    compacted['@id'] = compacted[subjectKey];

    return jsonld.toRDF(compacted, { format: 'application/nquads' }, function (rdfErr, rdfSnippet) {
      if (rdfErr) return reject(rdfErr);
      if (rdfSnippet === '') {
        return reject(new Error('Unable to serialize rdf from data "' + JSON.stringify(compacted, null, 2) + '"'));
      }
      return resolve(rdfSnippet);
    });
  });
}

function transform(csvData, context) {
  return Promise.all(csvData.map(function (row, index) {
    return transformRow(row, context, index);
  }));
}

---
title: Linked Data presentation for Utrecht.js
layout: presentation
---
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.7/d3.min.js"></script>
<script src="/js/d3-jetpack.js"></script>
<script src="/js/rdflib.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jsonld/0.4.2/jsonld.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.4/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.4.6/bluebird.core.min.js"></script>
<script src="/js/transformer.js"></script>
<section markdown="1">
# Linked Data

<h3 style="font-size: 1.2em;">(And what it can do for the JS developer)</h3>
<br>
<br>

© 2016 [CC-BY-SA](https://creativecommons.org/licenses/by-sa/3.0/deed.en) Rein van 't Veer
<div><img src="/images/geodan-logo.png" style="height:40px;vertical-align:middle;"> Rein.van.t.Veer@geodan.nl</div>
<div><img src="/images/kadaster-logo.png" style="height:40px;vertical-align:middle;"> Rein.vanVeer@kadaster.nl</div>
<div><img src="/images/VU-logo.png" style="height:40px;vertical-align:middle;"> Rein.vant.Veer@vu.nl</div>

<a href="#/1" class="navigate-down" />
</section>

<section markdown="1">
# What Is

## Semantic Web?
A movement for changing the web from a collection of documents to a global database of semantically rich information sources; a collection of strategies for gathering and utilizing knowledge.

## Linked Data?
The language of the semantic web, highly interoperable, expressed in the Resource Description Framework (RDF)
<a href="#/2" class="navigate-down" />
</section>

<section markdown="1">
# So...
What is RDF, what do you mean by 'semantic', what's the interoperability, how is Linked Data a 'language', what collection of strategies is in the semantic web, what global database are you blabbering about?

## I could tell you
But then I'd have to... you know
<a href="#/3" class="navigate-down" />
</section>

<section markdown="1">
# Keep you here for several weeks
So... we're going to do linked data by example. With a twist. Serverless.
<a href="#/4" class="navigate-down" />
</section>

<section id="table-section" markdown="1">
<h1>Our own little social network</h1>
<div>
    <div style="float:left;"><textarea id="csv" cols="50" rows="20"></textarea></div>
    <div style="float:left;" id="table"></div>
</div>
<script type="application/javascript">
    $('#csv').bind('input propertychange', function() {
        $( "#table" ).empty();
        var csvData = d3.csvParse(this.value);
        console.log('d3 said', csvData);

        if (csvData.length) {
            var context = JSON.parse($("#context").val());
            console.log('context', context);
        }

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
    })
</script>
<a href="#/5" class="navigate-down" />
</section>

<section id="semantics-section" markdown="1">
<h1>Our semantics</h1>
<div>
    <div style="float:left;"><textarea id="context" cols="50" rows="15">
{
    "@subject": "name",
    "@type": "foaf:Person",
    "@context": {
        "foaf": "http://xmlns.com/foaf/0.1/",
        "@base": "http://mysocialnetwork.org/id/"
    }
}
    </textarea></div>
    <div style="float:left;" id="table"></div>
</div>
<script type="application/javascript">
    $('#semantics-section').bind('input propertychange', function() {
        $('#semantics-section')
            .removeAttr('style')
            .animate({
                top: 0
            }, 500, function() {});

        $( "#table" ).empty();
        var csvData = d3.csvParse(this.value);
        console.log('d3 said', csvData);

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
                console.log(row, i);
                return csvData.columns.map(function(column) {
                    return row[column];
                });
            }).enter()
            .append('td')
            .text(function(d){return d;});
    })
</script>
<a href="#/6" class="navigate-down" />
</section>

<section markdown="1">
<a href="#/7" class="navigate-down" />
</section>
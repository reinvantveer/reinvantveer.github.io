---
title: Linked Data presentation for Utrecht.js
layout: presentation
---
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.7/d3.min.js"></script>
<script src="/js/d3-jetpack.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

<section markdown="1">
# Linked Data

(And what it can do for the JS developer)

CC-BY

(C)2016 Rein van 't Veer 2016
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
<a href="#/4" class="navigate-down" />
</section>

<section id="table-section" markdown="1">
<h1 style="display:table-cell;vertical-align:top">Our own little social network</h1>
<textarea id="csv" cols="50" rows="5" oninput></textarea>
<script type="application/javascript">
    $('#csv').bind('input propertychange', function() {
        $('#table-section')
            .removeAttr('style')
            .css('top', '0px');

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
<div id="table"></div>
<a href="#/5" class="navigate-down" />
</section>

<section markdown="1">
<a href="#/6" class="navigate-down" />
</section>
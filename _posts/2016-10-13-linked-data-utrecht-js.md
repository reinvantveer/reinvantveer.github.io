---
title: Linked Data presentation for Utrecht.js
layout: presentation
---
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.7/d3.min.js"></script>
<script src="/js/d3-jetpack.js"></script>
<script src="/plugin/rdfstore/rdfstore_min.js"></script>
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
    <div style="float:left;">
        <h3>People</h3>
        <h3>(CSV)</h3>
        <textarea id="csv" cols="20" rows="15">name,link</textarea>
        </div>
    <div style="float:left;width:500px;">
        <h3>Linked Data</h3>
        <pre><code style="max-height:300px;" id="nquads" data-trim contenteditable></code></pre>
    </div>
    <div style="float:left;width:200px;" id="table"></div>
</div>
<script type="application/javascript" src="/js/rdf-processor.js"></script>
<script type="application/javascript" src="/js/dataCruncher.js"></script>
<a href="#/5" class="navigate-down" />
</section>

<section id="semantics-section" markdown="1">
<h1>Our semantics</h1>
<div>
    <pre>
        <code id="context" cols="80" rows="15" data-trim contenteditable>
{
    "@subject": "name",
    "@type": "foaf:Person",
    "@context": {
        "foaf": "http://xmlns.com/foaf/0.1/",
        "@base": "http://mysocialnetwork.org/id/",
        "name": "foaf:name",
        "link": {
            "@id": "foaf:knows",
            "@type": "@id"
        }
    }
}
        </code>
    </pre>
</div>
<a href="#/6" class="navigate-down" />
</section>

<section markdown="1">
# Crunching...
# Converting...
<a href="#/7" class="navigate-down" />
</section>

<section markdown="1">
# The result: Linked Data
<a href="#/8" class="navigate-down" />
</section>
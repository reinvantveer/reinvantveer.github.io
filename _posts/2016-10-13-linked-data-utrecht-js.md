---
title: Linked Data presentation for Utrecht.js
layout: presentation
---
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.7/d3.min.js"></script>
<script src="/js/d3-jetpack.js"></script>
<script src="/plugin/rdfstore/rdfstore_modified.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jsonld/0.4.2/jsonld.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.4/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.4.6/bluebird.core.min.js"></script>
<script src="/js/transformer.js"></script>
<script src="/js/graph.js"></script>

<link href='//cdn.jsdelivr.net/yasqe/2.11.4/yasqe.min.css' rel='stylesheet' type='text/css'/>
<script src='//cdn.jsdelivr.net/yasqe/2.11.4/yasqe.bundled.min.js'></script>

<section markdown="1">

# Linked Data

<h3 style="font-size: 1.2em;">(And what it can do for the JS developer)</h3>
<br>
<br>

© 2016 [CC-BY-SA](https://creativecommons.org/licenses/by-sa/3.0/deed.en) Rein van 't Veer
<div><img src="/images/geodan-logo.png" style="height:40px;vertical-align:middle;"> Rein.van.t.Veer@geodan.nl</div>
<div><img src="/images/kadaster-logo.png" style="height:40px;vertical-align:middle;"> Rein.vanVeer@kadaster.nl</div>
<div><img src="/images/VU-logo.png" style="height:40px;vertical-align:middle;"> Rein.vant.Veer@vu.nl</div>

<aside class="notes" markdown="1">
- Rein van 't Veer
- Been working as pro JS developer for a year, but been hacking away for a few years
- Brought several identities:
    - My employer is Geodan
    - I am seconded to the National Cadastre, where, {they do what?}
    - I am a researcher at the Free University of Amsterdam, embedded at Cadastre
    - My job at the Cadastre is to build geospatially enabled semantic web infrastructure
    - Today I'm giving a Semantic Web / Linked Data primer, with a twist
    - Most of the semantic web stuff can be done with JS {most, not all}
    - So what's the SW?
</aside>
</section>

<section markdown="1">

# What Is

## Semantic Web?
A movement for changing the web from a collection of documents to a global database of semantically rich information sources; a collection of strategies for gathering and utilizing knowledge.

## Linked Data?
The language of the semantic web, highly interoperable, expressed in the Resource Description Framework (RDF)

<aside class="notes" markdown="1">
The web is mostly unstructured. We can structure it from text -> knowledge

This knowledge part is pretty central. Knowledge is something you can reason about.

A lot of the intelligence to do with the SW is about reasoning over knowledge.

We'll get into that.
</aside>

</section>

<section markdown="1">

# So...
What is RDF, what do you mean by 'semantic', what's the interoperability, how is Linked Data a 'language', what collection of strategies is in the semantic web, what global database are you blabbering about?

## I could tell you
But then I'd have to... you know
</section>

<section markdown="1">

# Keep you here for several weeks
So... we're going to do linked data by example. With a twist. Serverless.
<aside class="notes" markdown="1">
- So, I'm not going to do a talk where I explain all this stuff. It's dreary.
- Most of it is interesting, some verbose, some misguided.
- So real catch of this talk: no 'classical' impression. It's what I like about the SW
- We're making our own social network.
- Its USP: tell in what circle of acquaintances you participate
</aside>
</section>

<section id="table-section" markdown="1">

# Our own little social network
<div>
    <div style="float:left;">
        <h3>People</h3>
        <h3>Links</h3>
        <h3>(CSV)</h3>
        <textarea id="csv" cols="20" rows="12">name,link</textarea>
    </div>
    <div style="float:left;width:200px;" id="table"></div>
    <div style="float:left;width:200px;" id="graph">
        <style>

        .node {
          stroke: #fff;
          stroke-width: 1.5px;
        }

        .link {
          fill: none;
          stroke: #bbb;
        }

        </style>
        <svg id="svg" width="960" height="600"></svg>
    </div>
</div>
<aside class="notes" markdown="1">
{fill in first row}
- Semi-structured data: table
- It has table headers. It's json parsed from csv to keys and values. Semi-structured.
{second row}
- We have a directed graph, from linked data
- It allows us to reason over it
{third row}
- Hey, we have a cyclical graph!
We did actual network analysis on the graph to make an application feature
- So how does this work?
</aside>
</section>

<section markdown="1">

# SPARQL
<textarea type="text" class="form-control" id="query" rows="30">select ?person where { ?person <http://xmlns.com/foaf/0.1/knows>/<http://xmlns.com/foaf/0.1/knows>/<http://xmlns.com/foaf/0.1/knows> ?person . }</textarea>
<script>
    var yasqe = YASQE.fromTextArea(document.getElementById("query"));
</script>

<aside class="notes" markdown="1">
1. Who knows him/herself through three degrees {slash} of separation?
2. This (client side) deviates. SW is usually heavy infrastructure. Multi-node stuff.
3. Just a start of what you can do. Like SQL you can aggregate, count, subquery. It's even more expressive than SQL.
4. This JS impl. is limited in the standard. Normally property paths can be expressed through +, * and {}.
With the used library, you can't. There's no support (yet, that's only a matter of time).
</aside>
</section>

<section id="semantics-section" markdown="1">

# Semantics
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

<aside class="notes" markdown="1">
- The semantics: strategy called JSON-LD - LD for JSON. It's a sane way of expressing semantics for JSON
- In this case, it provides a context for all JSON documents or SN relationships
- We saw something called FOAF {explain}
</aside>
</section>

<section markdown="1">

# JSON-LD
<div>
    <pre>
        <code id="JSON-LD" cols="80" rows="15" data-trim contenteditable>
        </code>
    </pre>
</div>

<aside class="notes" markdown="1">
- The JSON-LD is just JSON with some context
</aside>
</section>

<section id="8" markdown="1">
# The result: Linked Data
<h3>Linked Data</h3>
<pre><code style="max-height:300px;" id="nquads" data-trim contenteditable></code></pre>
<script type="application/javascript" src="/js/rdf-processor.js"></script>
<script type="application/javascript" src="/js/dataCruncher.js"></script>
</section>
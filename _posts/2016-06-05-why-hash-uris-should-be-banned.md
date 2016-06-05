---
title: Why hash URIs should be banned
layout: default
---

Full history of the post [here](https://github.com/reinvantveer/reinvantveer.github.io/commits/master/_posts/2016-06-05-why-hash-uris-should-be-banned.md)

# Why hash URIs should be banned
The Semantic Web excites me in a lot of ways. I love the way it makes network analysis manageable in an easy way. Reasoning is fantastic. Serving documents as well-described data with shared vocabularies is definitely the way to go. One can only admire the expressivity of SPARQL, the interoperability of Linked Data, the open standards and a lot of the open data initiatives that are bound to its use. I can go on for ages, I'm hooked, committed.

# But 
I know that I'm a rookie compared to the folks who were at the birth of the Semantic Web, but I think there's still a lot of debatable stuff on some of the most basic intentions of Linked Data and the way it is or should be implemented. One of the core concepts is interoperability. By using common, easy to understand and open standards, data on the web should be both human and machine readable. This core requirement is undermined by a much used, but nefarious practice of using hashes (or actually, the [number sign #](http://www.ascii.cl/htmlcodes.htm) in URIs. 

Although the sign is officially named 'number sign', people tend to associate it more with a 'hash', especially since the use of Twitter 'hash tags', which are prepended with, technically, a number sign. So for clarity: where I use 'hash sign' or simply 'hash' below, I'm referring to 'ASCII decimal 35', which equates to HTML number &#35. The 35th character in the [ASCII table](http://www.asciitable.com/). There are other words for the sign, but as URIs in Linked Data with ASCII decimal 35 in them are referred to as [hash URIs](https://www.w3.org/wiki/HashURI), I will use the term 'hash'.

# Two examples
Slash URIs should, in my strong opinion, always be preferred over hash URIs. The issue can be illustrated by using two of my favorite vocabularies: 

- The (for me) mother of all RDF metadata vocabularies: [Dublin Core](http://dublincore.org/), which uses slash URIs
- The (for me) mother of all geospatial vocabularies: [GeoSPARQL](http://www.opengeospatial.org/standards/geosparql), which uses hash URIs

## The slash URI
The Dublin Core vocabulary uses slash URIs for its RDF definitions, so the 'creator' definition is [http://purl.org/dc/terms/creator](http://purl.org/dc/terms/creator). However you request this URI (or 'dereference' as the Semantic Webbists like to call it), it will fetch you the contents of this 'creator' definition, and nothing else. Its behaviour is predictable and consistent.

## The hash URI
GeoSPARQL, on the other hand uses hash signs in its definitions. So: the definition URI for a geospatial feature is [http://www.opengis.net/ont/geosparql#Feature](http://www.opengis.net/ont/geosparql#Feature). Its behaviour is different from the one of the Dublin Core RDF vocabulary. When requested, the http address of the definition has a hash in it, and by unfortunate design choices, the part after the hash never reaches the server. It was intended, in the HTML specification, as the lookup mechanism of an anchor on a page. So a HTML page `http://mypage.com` with a tag `<a name="my_anchor">` has an anchor 'my_anchor'. This can be looked up by the browser automatically, in a way that visiting `http://mypage.com#my_anchor` will jump to the HTML page section with this aforementioned tag. This is all well for web pages, but what about URIs?

# Unreachable content
For http clients, such as web browsers, but also for [JavaScript AJAX functions](http://api.jquery.com/jquery.ajax/) and tools such as [cURL](https://curl.haxx.se/), the URI part after the hash sign, cannot possibly be retrieved directly. So, supposing you want to know the meaning of [http://www.opengis.net/ont/geosparql#Feature](http://www.opengis.net/ont/geosparql#Feature), this cannot be done automatically. Instead, what the server sends you, is [http://www.opengis.net/ont/geosparql](http://www.opengis.net/ont/geosparql), as the #Feature part of the URI will not be sent. 

# Server side
The upshot of this is that, some URIs cannot be served. An RDF store may contain the resource `http://www.opengis.net/ont/geosparql#Feature`, but it can never be served individually to a request. Instead, often the entire set of definitions, in this case the full GeoSPARQL vocabulary, will be sent by the server. Drama ensues.

- The canonical way of storing Linked Data on a server is through an RDF triple or quad store. If there is no resource `http://www.opengis.net/ont/geosparql`, then on request of this URI, the server has to be configured to serve all resources related to `http://www.opengis.net/ont/geosparql`. But it can never serve a specific resource within the vocabulary.
- Linked Data can be stored on the server simply as a file, for example in the case of the GeoSPARQL vocabulary as XML/RDF. This hampers interoperability through the fact that only one serialization of RDF is chosen. The GeoSPARQL vocabulary server supports no other serializations. There is no HTML representation of the vocabulary, so it isn't human readable, violating one of the basic precepts of the Semantic Web: content negotiation.

# Client side
Now imagine a web application that wants to know what this `http://www.opengis.net/ont/geosparql#Feature` means. What is its labelled value, its explanation, so to speak? It will have to fetch the entire vocabulary, in this case it is only served as XML. It will have to employ a library that loads the XML, parse the contents as RDF and fetch the specific `http://www.opengis.net/ont/geosparql#Feature` resource within it, that it wanted in the first place. This will create a lot of hassle for just one label and the complexity of the application is immediately increased considerably. This is not how the Semantic Web should work. Dereferencing a URI to get its label should be plain, simple, predictable and easy.

# So in a nutshell
Hash URIs hamper the server side in limiting how it can be served. Servers have to be configured to serve the resource before the hash sign, or simply dump the data as one serialization. Hash URIs hamper the client, in that they can never be requested directly and they wil immensely increase code complexity. If content is served at all, it is most probably in a content type that wasn't requested, as is the case with the GeoSPARQL vocabulary.
Now where is the interoperability in that?

# Conclusion
It is time to be done with hash URIs once and for all. Don't use them. Standards that recommend them, such as the [Dutch URI strategy](http://www.pilod.nl/wiki/Boek/URI-strategie), should be altered in favor of better interoperable slash URIs.
 
# For some light reading

- [https://www.w3.org/wiki/HashVsSlash](https://www.w3.org/wiki/HashVsSlash)
- [https://www.w3.org/wiki/HashURI](https://www.w3.org/wiki/HashURI)
- [http://www.pilod.nl/wiki/Boek/URI-strategie](http://www.pilod.nl/wiki/Boek/URI-strategie)
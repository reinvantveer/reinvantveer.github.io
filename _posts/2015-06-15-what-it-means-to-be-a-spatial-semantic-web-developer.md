---
title: What it means to be a Spatial Semantic Web developer
layout: default
---

# Spatial semantics
The field of spatial semantics is involved in combining the use cases for spatial processing and semantic web strategies. Simply put, it is about being able to answer complex questions about where, when and what something is and how it is related, spatially and semantically to other things. Thus, it is quite a fundamental field of study. The hard part is to harness the full power of both fields as they are immensely diverse.

## Spatial technology
Spatial technology is concerned with

* Storage, i.e. creating spatial indexes that make spatial data perform well when scaling up 
* Transformation, i.e. converting to and from different formats, but mainly concerned with different projections and coordinate systems
* Analysis, i.e. the analysis of proximity of features to one another, interpolation and so on
* Publication, i.e. services and API's to gain access to spatial data and 
* Visualization by means of creating maps from spatial data

of: 

1. vector data - data made up from (interconnected sets of) coordinates and properties, and
2. raster data - data made up from 'pixels' with a known location provided with one or more colors or spectrum bands. 

One can consider this as a matrix of mainly these two types of data, multiplied by the five 'operation types', into ten subfields of enormous complexity.

## Semantic technology
Semantic technology is mainly concerned with
* Storage of triples or nodes and edges, indexed for ease of lookup
* Transformation of data, converting from and to different formats but mainly concerned with mapping to different data structures
* Analysis, by means of 
** graph or network analysis, and
** inferencing, i.e. methods of logical deduction by applying reasoning rules such as ontological relations between classes
* Publication by ways of persistent web-accessible man and machine readable data services
* Visualization by means of graph or network visualization methods

# Where both worlds meet
Until recently, the developments in the spatial context were separated from those in the area of the semantic web. This is hardly surprising. The digital geospatial world had known a history that predates the serious developments by perhaps several decades. What both areas share, by now, is an active interest in open source development, which came a lot later for the geospatial than for the semantic community. By comparison, the first version of [PostGIS](http://postgis.net/docs/release_notes.html#idp46426832) was released in 2005, while [Jena](https://jena.apache.org/), or at least [Joseki](http://sourceforge.net/projects/joseki/files/Joseki-Archive/) was released in 2006. Both can be regarded as reference implementations for the open source main toolbox for their respective circles.

However, events have taken a rather twisty roads to meet. Both the spatial and the semantic have moved in closer to each other, not by cross-pollination, but simply by adopting strategies that allow them to be implemented easier. For instance: anyone can implement a crossover of spatial and semantic technology by using some of the most popular storage solutions available: [MongoDB](https://www.mongodb.org) for instance, and [ElasticSearch](https://www.elastic.co/products/elasticsearch). It is no coincidence that both are implementations of JSON-stores. Notably, it is the embrace of JSON serialization of RDF in JSON-LD that brings these worlds together.
 
 There is a catch. While the solutions mentioned above are probably the best performing ones in the crossover, they are by no means the most elaborate ones in both fields. They trade functionality for speed. For these stores, it is a lot harder to implement a spatial join than it is natively done in PostGIS, for example, as it is a lot harder to conduct OWL-reasoning than it would be in Jena. It wouldnt be impossible, but it is still a lot more feasible to use a combination of technologies that are specialised for the task.
 
Looking from the spatial standpoint, there has been no attempt at a crossover between semantic systems and spatial raster systems. At the moment, there is no simple way of using a georeferenced satellite image and have it published or analysed semantically. Frankly, I would be hard pressed to find a use case for it, since I have little experience with remote sensing and its uses.
 
 On the other hand, looking from it is hard to find an implementation that combines the graph properties of linked data and a spatial search, particularly one that scales and performs well. Probably it is in [Neo4j](http://neo4j.com) that one of the best reference implementations that can be found, but the research in the spatial semantic field is so sparse that there are hardly any figures on scalability and performance, let alone recent ones. 
 
 For what it's worth, it looks like the spatial semantic field, or Linked Geodata (LGD) still has a long way to come befor it is fully mature. There is hardly any semantic data storage type that can be coupled with GeoServer. There is hardly any spatial data storage that can be coupled with Jena or Sesame. These are a few basic steps to be taken for the two fields to really come together.
 
 # Edit, 2015-06-16
 It seems that OpenLink has improved many spatial functions in [Virtuoso version 7.2](http://virtuoso.openlinksw.com/dataspace/doc/dav/wiki/Main/VOSNews#2015-02-11 -- Virtuoso Open-Source Edition 7.2.0 Released), building towards a fuller geospatial semantic backend. I hope to be able to test it soon. 
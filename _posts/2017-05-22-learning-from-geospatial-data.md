---
layout: default
title: Deep learning on geospatial data
---

Full history [here](https://github.com/reinvantveer/reinvantveer.github.io/commits/master/_posts/2017-05-22-learning-from-geospatial-data.md)

# Deep learning on geospatial data
A big question I'm pondering over the last few weeks is how to apply machine learning strategies on geospatial data, specifically the kind known as geospatial 'vector' data, as opposed to 'raster' data. Usually, geospatial vector data is just data tables, including some kind of serialization of the geometry. There are many possible solutions for feeding GIS data to a neural net, including materializing the data as raster images, but the current direction my thinking is taking me is one involving a distance graph of neighbouring geospatial objects.

Many tasks I'm currently considering involve delving up contextual information from the physical surroundings. Say a lamp post is misplaced in a data set, having been placed in a body of water, or in the middle of the road or some similar situation. Rather than stating the propositional logic "A lamp post should not be in water or in the middle of the road", perhaps we can let a neural net figure out what's right and wrong from the available data of surrounding geospatial objects. There is a lot of it out there, say, [OpenStreetMap](https://www.openstreetmap.org) for example.

To this end, I started thinking about geospatial objects and their relations as a graph - a graph of distances and angles: polar coordinates. A graph containing all geospatial objects and their interrelated positionings could then be fed to a neural net and either be instructed to pick out the outliers or be trained to recognize the faulty stuff.

In learning from the 'spatial graph', there are several roads interesting to investigate. Today I look at the DNC (differentiable neural computer).

# The Differentiable Neural Computer
Following the publishing of the [Nature article](http://www.nature.com/nature/journal/v538/n7626/full/nature20101.html), we investigate the code behind it, found on the [dnc GitHub repo](https://github.com/deepmind/dnc). And use the information on [their blog](https://deepmind.com/blog/differentiable-neural-computers/).

# Questions:
- What is the significance of the 'train.py' output?

- The 'train' program uses 10 randomly generated sequences. How and where are these sequences injected in the code?

- How can we make the model ingest data other than the training example?

- How can we feed it an RDF graph?

# Discussion
I discussed these questions with a group of fellow researchers at the Vrije Universiteit and we concluded that the DNC model is probably not a good fit for training on large sets of geospatial graphs due to the limitations on available hardware resources. It would probably require a machine beyond the reach of my financial resources. That is why I will be looking into [rdf2vec](https://ub-madoc.bib.uni-mannheim.de/41307/1/Ristoski_RDF2Vec.pdf) instead for handling large graphs next.
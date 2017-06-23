---
layout: default
title: A task for Geospatial Machine Learning
---

This post was [edited](https://github.com/reinvantveer/reinvantveer.github.io/commits/master/_posts/2017-06-22-geospatial-ml-task.md)

# A task description for Geospatial Machine Learning

As I wrote earlier, I am investigating the possibilities for doing geospatial machine learning for the purpose of extending the geospatial analysis toolbox. As far as I can tell, no ML reasoning for geodata (including the use of topology) has been attempted on geospatial 'vector' data. By doing so, we could answer questions of a much fuzzier nature. 
* Is this a good place to start my business? 
* What is the likelihood of this parcel of land containing an archaeological site? 
* Is this road intersection a safe one? 

Instead of collecting all possible variables and creating a model over it, I'd like to explore the promise from machine learning, in having a neural net figuring out the parameters. So, we're coming to Big Questions using these techniques:
* What can we do to (this part of) our country to improve on it? 

# The task
In the Netherlands, we have a lot of base registries for land use. One of these is the [Base Registry for Topography](https://brt.basisregistraties.overheid.nl). We know this data set isn't exactly flawless. Some data is faulty, [such as the height class of some buildings](https://data.labs.pdok.nl/stories/brt-hoogteklasse/). Where a measured height is missing in the data, the height class is automatically (but often erroneously) marked as [low-rise](https://en.wikipedia.org/wiki/Low-rise). Also, there is a hiatus on the amount of mosques in the BRT. OpenStreetMap can tell me the correct type:

<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=6.198330223560334%2C52.14166168660521%2C6.200840771198274%2C52.14270036478947&amp;layer=mapnik" style="border: 1px solid black"></iframe>
<br/><small><a href="https://www.openstreetmap.org/#map=19/52.14218/6.19959">Grotere kaart bekijken</a></small>

But the BRT cannot:
<iframe width="700" height="350" frameborder="0" scrolling="auto" marginheight="0" marginwidth="0" src="https://brt.basisregistraties.overheid.nl/top10nl/doc/gebouw/117740482" style="border: 1px solid black"></iframe>
 
 Can we train a neural net to do suggestions on re-labeling some buildings?
 
 The task would then be described as follows: predict the type of the building from its (spatially) neighbouring objects. Given a training set of buildings with correct labels and additional data on [building types from OpenStreetMap](https://download.geofabrik.de/europe/netherlands.html), this would, theoretically, be possible.
 
I accept that, based on these building heights, a 'business logic' style GIS analysis could generate correct labels (in polynomial time), but that would amount to an analysis tailored to this case only. What if the geospatial neural net could generalize to detect most, if not all incorrect properties of geospatial objects, if a neural net compares it to other contextual information? 
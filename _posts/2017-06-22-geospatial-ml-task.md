---
layout: default
title: A task for Geospatial Machine Learning
---

# A task description for Geospatial Machine Learning

As I wrote earlier, I am investigating the possibilities for doing geospatial machine learning for the purpose of extending the geospatial analysis toolbox. As far as I can tell, no ML reasoning for geodata (including the use of topology) has been attempted on geospatial 'vector' data. By doing so, we could answer questions of a much fuzzier nature. 
* Is this a good place to start my business? 
* What is the likelihood of this parcel of land containing an archaeological site? 
* Is this road intersection a safe one? 
* What should we alter in this neighborhood to keep people from harassing each other? 

Instead of collecting all possible variables and creating a model over it, I'd like to explore the promise from machine learning, in having a neural net figuring out the parameters. So, we're coming to Big Questions using these techniques:
* What can we do to (this part of) our country to improve on it? 

# The task
In the Netherlands, we have a lot of base registries for land use. One of these is the [Base Registry for Topography](https://brt.basisregistraties.overheid.nl). We know this data set isn't exactly flawless. Some data is faulty, [such as the height class of some buildings](https://data.labs.pdok.nl/stories/brt-hoogteklasse/). Where a measured height is missing in the data, the height class is automatically (but often erroneously) marked as [low-rise](https://en.wikipedia.org/wiki/Low-rise). Can we train a neural net to do suggestions on re-labeling some buildings?
 
 The task would then be described as follows: predict the correctness of the building height class of a building from its (spatially) neighbouring objects. Given a training set of 3300 high-rise and 3300 low-rise buildings with correct labels and additional data on [Building Heights](https://www.pdok.nl/nl/producten/pdok-downloads/basisregistratie-topografie/3d-gebouwhoogte-nl), this would, theoretically, be possible.
 
I accept that, based on these building heights, a 'business logic' style GIS analysis could generate correct labels (in polynomial time), but that would amount to an analysis tailored to this case only. What if the geospatial neural net could generalize to detect most, if not all incorrect properties of geospatial objects, if a neural net compares it to other contextual information? 
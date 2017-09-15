---
layout: default
title: Semantics2017 talk
---

Yesterday I gave my second PhD talk. On the subject I have been working on for the past few months: trying to make a 'spatially aware' artificial neural net, that can reason over distances, intersections and other relevant properties of geospatial geometries. The slides to my talk are [here](https://docs.google.com/presentation/d/e/2PACX-1vSA72_f8Yc9mPFKMu8yGtGnIFvl6c29bpAtU5UvGzIM3b4Ya4qOPvUy8Qk8Oln8mrmuofJRgH-MrEgx/pub)

The general gist of my talk was as follows. Suppose you wish to build a linkset between two spatial data sets, matching geospatial objects from those two separate data sets. I intended to show that you can leave the determining of tresholds for distance or intersection for what is and what isn't a match to a neural net, rather than figure out those parameters yourself.

There was a good question coming from [Stephan Bartholmei](https://pro.europeana.eu/person/stephan-bartholmei), and I hope to capture the intent of his question correctly. If you have a (representative) training set of spatial objects from two datasets, you can automatically infer the spatial relationships from this set, right? Why use machine learning?

I don't think I understood the question well enough yesterday, and it is about the core of why machine learning can be helpful for the geospatial (vector) domain. Even if you have a large enough training set of correctly labeled matches and mismatches, you still might not capture the geospatial parameters of common properties like distance and intersection. Because then the question becomes: which properties are you going to add to your set of formal rules to build matches? Distance and intersection? Any others? All you can think of? 

Suppose there are two or three outliers in your training set that throw off the theoretically correct set of thresholds by a factor of three. A neural net is able to work with these outliers a lot more fluently than a set of formal rules inferred from the training set. The neural net is able to reason about the test set from a probabilistic point of view, rather than a system of hard edges.

<blockquote class="twitter-tweet" data-lang="nl"><p lang="en" dir="ltr">.<a href="https://twitter.com/reinvantveer">@reinvantveer</a> tells us about <a href="https://twitter.com/hashtag/geospatial?src=hash">#geospatial</a> <a href="https://twitter.com/hashtag/linkeddata?src=hash">#linkeddata</a> <a href="https://twitter.com/hashtag/dataquality?src=hash">#dataquality</a> assessment using <a href="https://twitter.com/hashtag/machinelearning?src=hash">#machinelearning</a> <a href="https://twitter.com/hashtag/ldq2017?src=hash">#ldq2017</a> <a href="https://twitter.com/hashtag/semanticsconf?src=hash">#semanticsconf</a> <a href="https://t.co/yZRhktKaRC">pic.twitter.com/yZRhktKaRC</a></p>&mdash; Amrapali Zaveri (@AmrapaliZ) <a href="https://twitter.com/AmrapaliZ/status/908298097880653824">14 september 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
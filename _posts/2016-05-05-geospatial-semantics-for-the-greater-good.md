---
title: Crowdsourcing geospatial government data 
layout: post
---

A big reason why many of us are so enthousiastic about geospatial technology, and some of us about semantic web technology, is its ability to help us with questions that are hard to work with, but highly pertinent to our well-being. I'm convinced that these technologies can and do play an important role and that they provide a clear perspective on working transparently with 'smart data'. Datasets of importance are those regarding air quality, registrations on land parcels, buildings and infrastructure - all registrations that are maintained by the government as open data. It is not hard to see that by combining some of these datasets - where is the quality of air relatively low, how many buildings are there and does it happen to coincide with lots of roads? - can mean a lot in improving the quality of our lives. But they do come at a cost: a huge cost of maintaining the quality and validity of the data. Here I want to propose a strategy that can both mitigate costs, and increase the involvement and use of these data sets with the general public.

# Smart data

There term 'Smart data' is, in my opinion, a misnomer. Data is only as smart as the technology it leverages to enable its smartness. This is for two reasons. 
1. If, and only if, expressed in a way that allows machines to reason about them, can data be used in a 'smart' way. This is where the geospatial and the semantic come into view: they allow resources to be compared to each other in terms of space their related meaning. 
2. The second observation that I think is necessary to be made is that, beyond human interest, there is no machine that can determine the smartness of data inferred. It might be able to analyze interconnectedness and some level of validity, but beyond that is unable to assess its value. Data is simply of no interest to machines so the amount of smartness can only expressed by humans evaluating the value.

The upshot of these observations is that, if you accept this, then you need both humans and machines to make anything from data. This is not as much a gratuitous remark as it may seem. Too often, data are simply made available through a download service without any means of human interaction. If there is interaction, through a web interface or even an API, it is most often just one way: it is read-only. Often, the metadata is so poor that half of the data is incomprehensible. That way, it is doubtful whether the second observation is given enough attention by the parties responsible for publishing data. 

# Value through interaction
Allowing people to contribute to an existing data set is often harder than just starting a new project and has its specific difficulties. Contributed data may not meet the required quality standards, the source data schema may not support the provenance data for tracking its origins or the volume of contributed data may not be large enough or too large to handle.

I will identify three levels in which the general public can post additions or corrections:

1. Perhaps the easiest way of interacting with data is simply through making simple observations about it. We enable to 'like' a post, or discuss it in a comments section. There is no re-ingestion flow of contributed data to the source. 
2. The second level is a big step. You set up or involve a separate platform to collect the contributed data. Often this is the kind of interaction commonly referred to as 'crowdsourcing'. [Zooniverse](https://www.zooniverse.org) is such a platform for science projects. and Google maps both allow people to make corrections to supposed faults or omissions, which are evaluated by administrators. These initiatives often have the added benefit of a large crowdsourcing community to make the contributions, but the re-ingestion of the contributed data can be difficult for the reasons of volume and provenance stated above.
3. The third level is one step further. The publisher of the data ensures that the publication medium supports contributions from the start. The data model is designed to allow for crowdsourcing, or it can be easily extended to allow for additions and corrections. This strategy has the added benefit of having a long term perspective, where projects on crowdsourcing platforms are mostly temporary, but it can be hard to assemble a following of enthousiasts. 

# Conclusion

It is no more than an assumption that, in order to maintain large authoritative datasets in a cost-effective manner, only the third level - that of integrating crowdsourcing in the publication medium - holds enough long-term benefits. Once in place, the scheme can run for years, but a difficulty is in gathering and fostering a sufficiently large crowd to make contributions to make a difference on scale. Perhaps this can be reached most effectively through gameification. A research programme should be set up to investigate how such 'on-site' community can be stimulated the best way, by collecting statistics on more or less controlled experiments.
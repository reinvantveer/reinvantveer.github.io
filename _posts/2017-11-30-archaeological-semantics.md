---
layout: post
title: Semantics for Archaeology
---

This is text that goes with a [presentation](https://docs.google.com/presentation/d/1Pd9ofGoAN7PYL9HXeEz3RFjCIqn0HSP32b3Vdd97dMc/edit?usp=sharing) given on 1-12-2017

## What are we looking for?
It sometimes seems like archaeology is just about the thrill of unearthing exciting stuff, but in the end we excavate for the purpose of learning something about culture and humanity. What was the line of habit and reasoning for people in the past and how does excavating sites help in this respect? One thing is evident though: to learn something about past societies we are not helped by a single site alone. We need to assemble as much data as we can, and compare it.

This brings us to the problem. It is often hard, or even impossible to compare data between sites. This means that our ability to infer information about the past is severely hampered. We have no choice but to look for ways to better organize knowledge that we distill from the data that we gather from our dig sites.

## Comparing across sites
In order to compare data across sites, we need to compare across data sets. Every dig site comprises one or more data sets on what was interpreted as meaningful phenomena, such as pits, postholes and other chrono-stratigraphical information; and the finds that we gather and analyse.  

Since each excavation builds its own data set, the diversity in data schemas from all assembled data sets is enormous. I calculated that there are about 13,000 information schemas from Dutch archaeology in the DANS data repository, just because every dig is a data set in itself. Comparing data across these data sets is troublesome, since each of them employ a slightly (at best) or highly (at worst) differing vocabulary to describe the data. Archaeology is a guaranteed data integration problem.

## Data standardization
If we want to be able to compare data sets from archaeology, we have no choice but to standardize some knowledge. I need to be specific about this, because there's more than one way to standardize. One way is to agree on a prescriptive, standardized information exchange model. I was involved in creating one, called SIKB0102. But eventually, I believe these initiatives must fail, because they are too inflexible. They do not allow rapid change and they normally accommodate very little variation in information. Often, there is a lot of information loss in expressing the source information into a target exchange model, because the exchange model is normative and therefore cannot do anything other than generalize. In the end, you have a standardized, but impoverished version of your source data.

Instead, I accept semantic standardization as a better alternative. It allows you to semantically derive concepts and vocabulary, rather than mapping directly to an exchange model. 

By deriving, you can link to a concept that is related, hopefully strongly, to the one you use. That's probably a good reason to call it Linked Data: expressing your data as facts that link to external, standardized sources to best express its meaning, while retaining the ability to express the peculiarities in your data as freely as you want.

## The semantics of archaeology
Unfortunately, at the moment there is no vocabulary as fine-grained that you can derive any concept you use for your data from a shared concept. There are several schemes in development, such as the archaeology extension of CIDOC, but the shared concepts from this initiative are very broad - they distinguish very high-level concepts, but you cannot use them to distinguish pottery types from one another.

For those purposes, the Dutch 'Rijksdienst voor het Cultureel Erfgoed' (State Service for Cultural Heritage) is developing a concept scheme that covers as much taxonomical ground as possible, in the all-important 'Erfgoedthesaurus' (Heritage Thesaurus). Of course this requires a huge effort, but in the end, if you carefully link your vocabulary to theirs, you will be able to as questions from this shared vocabulary across many, many data sets. The holy grail seems like it is in sight. Right?

We only need to repeat this monumentally complex process for every region and period covered by archaeology. Ouch.

## The shared effort
We're not quite there yet. Aside from the enormous effort it takes to create a shared archaeological concept scheme that covers (hypothetically speaking) 'everything', we need to cooperate in jointly: 
* gathering the knowledge that makes up this shared knowledge base;
* gathering the expertise to link data sets (semi-)automatically to this knowledge base;
* tweaking and tuning the shared knowledge base to reflect our state of knowledge on material expression of culture;
* create search infrastructure to query the data from the shared vocabulary, that permeates all data sets linked to the shared vocabulary.


Every single step necessary to reach this goal is doable, but only in cooperation. 

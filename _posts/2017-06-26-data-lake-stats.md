---
layout: default
title: Some data lake stats
---

# Some data lake stats
This friday, I did a clean re-run of the ingestion of my source data. It ran clean through:
```
Percent: [##########]     100.00% Done...
 - Processing file /data/EDNA-LD_EXT/easy_rest/downloads/33722/1801097_object.csv
 2017-06-24 02:35:01,799 - DEBUG - Schema dd8f1922010e2fe0c0266ba8e1864f2de86a9837 was previously processed
2017-06-24 02:35:01,800 - DEBUG - File /data/EDNA-LD_EXT/easy_rest/downloads/33722/1801097_object.csv was successfully ingested
2017-06-24 02:35:01,801 - INFO - Finished!
2017-06-24 02:35:01,801 - INFO - Successfully ingested 118816 files of 152848
```

The ingestion ran from 2017-06-23 15:42:58 to 2017-06-24 02:34:49, or almost 11 hours. This means my data lake is filled with fresh fish from my source data. Right now, I can query on any partial or exact key / value, provided I know what I want to query for. And I'm OK to wait for a long time for my answer: none of the data is indexed. I can only query fast on id's in the database, at least I assume MongoDB indexes those by default.

So, it doesn't look like much yet, but at least I have all my data in one place, where I can query it transparently. I don't have to worry about try/catching all my code, all this has been taken care of in the 'cleaning' phase of transferring the data from files to the MongoDB data lake.

As I explained [earlier](/2017/06/26/first-full-file-run.html), it's quite alright to have a score of 77,7% ingestion, as there is quite some redundancy in the files, and there is only 4% error margin attributable to mis-attributed file types (i.e. no tabular text files) and CSV serialisation errors (row length inconsistencies) which are nearly impossible to fix. So, as my previous post explains, this mark is excellent. The only remarkable about this number of 118816 is that it is 170 files short of the first successful run (118986). I can't really explain this discrepancy without a few hours of deep log digging, which I can skip for now. Instead, I'm going to focus on the 96% (see my [previous post](/2017/06/26/first-full-file-run.html)) of the ingestible files that *did* make it.

## Duplicate files
There's a lot more interesting stuff to know about these files. For instance, I made sure to de-duplicate the files themselves before ingestion, by comparing sha1 hashes of the file contents. It turns out that there is a huge duplication thing going on: (from the `mongo` client:)
```
> db.files.count()
118816
> db.sourcedata.count()
61815
```
This means that (118816 - 61815) / 118816 = 48,0% of the source files is an exact duplicate! I believe this large duplication percentage is the result of the number of controlled value lists, or reference value lists or whatever you want to call them. You are probably familiar with them: they're the lists that restrict the type of hours you write in your ERP software. Or something similar. They are instrumental in standardising the way we refer to things: with a common vocabulary we agree on naming things similarly so we can compare across time and space. 

As a lot of files sent to DANS are in database form, these databases commonly include those reference lists. And consequently, often all of the available reference lists get deposited, even though only a handful of codes are used. 

## Schemas
So, there are only 60815 unique source files in the bulk download. These are scattered over an impressive
```
> db.schemas.count()
13811
```
13,811 unique schemas! That's shocking! The recording of Dutch archaeology is so poorly standardised that no less than 13811 / 61815 ≈ 0.223 or one in rougly five unique files has a schema that was't used before. If you discount the duplication, the figures are slightly better: 13811 / 118816 ≈ 0.116 or roughly one in nine ingestible source files has a unique schema.

Hm.

In the face of overwhelming odds, I'm left with only one option. I'm going to have to [science the shit out of this](http://www.imdb.com/title/tt3659388/quotes?item=qt2575479).

---
layout: default
title: Ingesting!
---

# Ingesting!
I'm actually ingesting raw data into my database! I fixed some errors, mostly to do with type conversion (numpy data types to JSON), improved some error catching and logging, but the ingest is running. This is already a milestone. With this operation, more archaeological information is being gathered in the Netherlands in one database than probably has been done in the combined history of archaeological Dutch research.

I improved quite a bit on my code base. The inference on the encoding is done now on a maximum of 1 kilobyte of data, which improves the speed a lot.

There are new bugs to sort out, of course:
- For MongoDB, keys in JSON cannot contain dots ('.'), so they must be escaped on a re-run
- There are some errors reported by MongoDB on the size of large files. The source data is ingested as one huge document, but the limit is somewhere about 17 megabytes. There are too many files over that limit. I will have to devise some kind of strategy for this, splitting it.
- Some files have numbers as keys, or, to put it in CSV terms: some files have numbers as column names. This could mean two things: either there is no column header in the file or it should be mapped to a string.
- R_AWDS4B.csv due to 'charmap' codec can't decode byte 0x81
- One unit test creating a sha1 hash of a python dictionary is failing on Linux with weird changing results. Obviously something is getting encoded that shouldn't.


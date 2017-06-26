---
layout: default
title: Some data lake stats
published: false
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

As I explained [earlier](/2017/06/26/first-full-file-run.html), it's quite alright to have a score of 77,7% ingestion, as there is quite some redundancy in the files, and there is only 4% error margin attributable to mistyped file types (i.e. no tabular text files) and CSV serialisation errors (row length inconsistencies) which are nearly impossible to fix. So, as my previous post explains, this mark is excellent.


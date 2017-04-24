---
layout: default
title: Data loading tactics change
---

Full history for the article [here](https://github.com/reinvantveer/reinvantveer.github.io/commits/master/_posts/2017-04-24-data-loading-tactics-change.md).

# Data loading tactics

This week I changed tack for the ETL part of my data science project. The files I'm working with originate from many different organisations. Most of the data tables in CSV I'm concerned with  have been converted from database tables and spreadsheets by my data supplier DANS, but some of them probably originate from the creating organisations themselves. Since there's no guarantees on consistent CSV formatting, there's no telling what kind of delimiters and quote characters will be used. So, if I want to be able to read as much CSV files as I possibly like, I need a very forgiving CSV parser.

Also, I already found out that the most common csv reader packages for Javascript ([csv](https://npmjs.com/package/csv) and its d3 counterpart [d3-dsv](https://www.npmjs.com/package/d3-dsv)), although highly flexible in streaming, have no support for numerical parsing. I guess JavaScript isn't really cut out for this task, or not often used. This is a shame, since I expect either to lose a lot of information by ignoring the numerical character of my source data, or I will have to invest quite some time myself in writing the logic in JavaScript for properly parsing CSV files.

Python, of course, is much more popular as a language for doing data science, so I decided to do a re-write for my ETL staging from CSV to MongoDB. I switched to Python when I found out that the [pandas](http://pandas.pydata.org) toolkit has all the parsing goodness I need. In turn, it isn't very forthcoming in auto-detecting the delimiter and quote characters from a file. However, when combined with the standard library csv sniffer, I found a good combo in just a few lines:

```python
import pandas as pd
import csv
import json


class CSVparser:

    @staticmethod
    def to_json(filepath):
        with open(filepath) as file:
            try:
                dialect = csv.Sniffer().sniff(file.read(1024))
            except:
                raise ValueError(('Can\'t return JSON from empty or invalid csv file %s' % filepath))
            frame = pd.read_csv(filepath, quotechar=dialect.quotechar, delimiter=dialect.delimiter)
            jsondata = json.dumps(frame.to_dict(orient='record'), sort_keys=True)
            if jsondata == '[]':
                raise ValueError(('Can\'t return JSON from invalid csv file %s' % filepath))
            return jsondata
```

So now I'm able to have an intelligent CSV parser that really inspects the CSV files for its formatting dialect.

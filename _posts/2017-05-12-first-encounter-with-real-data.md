---
layout: default
title: Close encounters with real data
---

Full history for the article [here](https://github.com/reinvantveer/reinvantveer.github.io/commits/master/_posts/2017-05-12-first-encounter-with-real-data.md).

This week I had my first go at trying to load my research source table data into MongoDB in as raw a form as possible. The [Python MongoDB client](https://pypi.python.org/pypi/pymongo) seems sturdy enough to allow ingestion of Python dictionaries instead of having to serialize them as JSON documents, but already I'm getting into some trouble trying to generate JSON schema 'dictionaries' instead of native JSON schema. I'm employing the [GenSON](https://pypi.python.org/pypi/genson) library for the schema generation and it looks like some data from the [pandas](https://pypi.python.org/pypi/pandas)-generated dictionaries from the CSVs are having trouble being analyzed by GenSON. There's some error checking and refactoring to do here. 

But on the upside: I'm working with my research data now! It may break down pretty early, but at least the process is easily repeatable and the building time for the inventory of the file list from 3400 folders and 150.000 files is pretty alright using os.walk: it takes about twenty seconds or so. As soon as I start fixing some stuff, I expect the ingestion error percentage of the files to drop quickly. 

Another challenge is the correct installation of my dependencies. As I rely on [GDAL](http://www.gdal.org/) for the readout of [MapInfo Interchange Format](https://www.scribd.com/document/21064551/Appendix-J-MapInfo-Data-Interchange-Format) (more documentation [here](http://read.pudn.com/downloads138/sourcecode/others/592839/Mapinfo_Mif.pdf))files, installation of the correct version looks like a big thing. On my Windows work laptop, I install python GDAL through [OSGeo4W](https://trac.osgeo.org/osgeo4w/) which is a hugely convenient application to not only install GDAL, but other python dependencies such as pandas which is used for the CSV reading. 

Another thing about the MapInfo Interchange Format. It dates back to 1999 and at the time, it may have been one of very few text-formatted geospatial formats. Despite its human readability, it is an odd choice for my data supplier as it isn't really an open format. MapInfo and now Pitney Bowes have apparently never made much of a secret about the MapInfo Interchange Format, but still, it is a proprietary format. My advice to DANS would be, therefore, to switch to a really open GIS data format, such as the [GeoPackage](http://www.geopackage.org/). Which was of course unavailable at the time of establishment of the depot for Dutch archaeological digital data.

As soon as I make progress on the errors, I'll file a new report.
---
layout: default
title: Python and GDAL or PostGIS for data preprocessing?
---

# Geodata preprocessing with Python and GDAL or with PostGIS?
This week I'm digging into processing vector geodata with machine learning in mind. The choice is made to go with WKT representations of geometries, so the data needs to be pre-processed to serialize the geometries to WKT.

The data I'm going to use for experimentation is already quite big. It's just the buildings from two sheets from the TOP10NL Base Registry for Topography ([BRT](https://www.pdok.nl/nl/producten/pdok-downloads/basisregistratie-topografie/topnl/topnl-actueel/top10nl)) and the buildings set of the Dutch [OpenStreetMap data set](http://download.geofabrik.de/europe/netherlands.html) (Copyright OpenStreetMap contributors). Joined, they already make up about 800K intersecting geometries, combined from both data sets.

The point is that, with Python and GDAL, you can probably wait for several weeks for the script to finish. I thought of leaving my data prepping low in infrastructure, but in the end geometries are very processor-intensive and require indexing. I'm listing the python script below, for (also my own) reference:

```python
from osgeo import gdal, osr, ogr

# Enable GDAL/OGR exceptions
gdal.UseExceptions()

def gdal_error_handler(err_class, err_num, err_msg):
    errtype = {
            gdal.CE_None:'None',
            gdal.CE_Debug:'Debug',
            gdal.CE_Warning:'Warning',
            gdal.CE_Failure:'Failure',
            gdal.CE_Fatal:'Fatal'
    }
    err_msg = err_msg.replace('\n',' ')
    err_class = errtype.get(err_class, 'None')
    print 'Error Number: %s' % (err_num)
    print 'Error Type: %s' % (err_class)
    print 'Error Message: %s' % (err_msg)
    
# install error handler
gdal.PushErrorHandler(gdal_error_handler)
    
print('Loading data...')
amsterdam = gdal.ogr.Open('../files/TOP10NL_25W.gml', 0)
enschede = gdal.ogr.Open('../files/TOP10NL_34O.gml', 0)
osm_buildings = gdal.ogr.Open('../files/gis.osm_buildings_a_free_1.shp', 0)

source_layers = [amsterdam.GetLayer('Gebouw'), enschede.GetLayer('Gebouw')]
target_layers = [osm_buildings.GetLayer()]

print('Processing features...')
for source_layer in source_layers:
    # input SpatialReference
    in_spatial_ref = source_layer.GetSpatialRef()

    # output SpatialReference
    out_spatial_ref = osr.SpatialReference()
    out_spatial_ref.ImportFromEPSG(4326)

    # create the CoordinateTransformation
    coord_trans = osr.CoordinateTransformation(in_spatial_ref, out_spatial_ref)

    in_extent_list = list(source_layer.GetExtent())
    bottom_left = ogr.Geometry(ogr.wkbPoint)
    top_right = ogr.Geometry(ogr.wkbPoint)
    bottom_left.AddPoint_2D(in_extent_list[0], in_extent_list[2])
    top_right.AddPoint_2D(in_extent_list[1], in_extent_list[3])
    bottom_left.Transform(coord_trans)
    top_right.Transform(coord_trans)
    print(bottom_left, top_right)

    for target_layer in target_layers:
        print('Setting filter')
        target_layer.SetSpatialFilterRect(bottom_left.GetX(), bottom_left.GetY(), top_right.GetX(), top_right.GetY())
        print('Filter:', target_layer.GetSpatialFilter())

        print('Iterating over features')
        in_feature = source_layer.GetNextFeature()
        in_feature_counter = 0
        while in_feature:
            in_feature_counter += 1
            in_geom = in_feature.GetGeometryRef()
            in_geom.Transform(coord_trans)

            target_layer.ResetReading()
            out_feature = target_layer.GetNextFeature()
            out_feature_counter = 0
            while out_feature:
                out_feature_counter += 1
                out_geom = out_feature.GetGeometryRef()

                if in_geom.Intersects(out_geom):
                    intersection_wkt = in_geom.Intersection(out_geom).ExportToWkt()
                    print('IN', in_geom, 'OUT', out_geom, 'INTERSECTION', intersection_wkt)

                out_feature = target_layer.GetNextFeature()

            in_feature = source_layer.GetNextFeature()

        print('Processed %s in_features and %s out_features' % (in_feature_counter, out_feature_counter))

print('The data prepping operation completed successfully')

```

Another problem is that the Python implementation of GDAL is unbelievably verbose. Of course, it's just wrappers around C code, but you basically need to spell out everything. The GetNextFeature() and ResetReading() methods are silly, but the requirement to enable GDAL error logging **and** [register an error handler](https://pcjericks.github.io/py-gdalogr-cookbook/gdal_general.html#install-gdal-ogr-error-handler) is just not from this century. Also, it's dangerous to start chaining methods together, as the scope (or something) is easily lost between the passing of returned results between the methods.

# The power of PostGIS
So instead, I found out that roughly the same can be done in just a few minutes with a PostGIS database and a few lines of bash script, using ogr2ogr, part of gdal-bin. Using ogr2ogr also insures that automatically a GIST geo-index is built for the geometries:
```bash
# Load the database. Be sure to have the postgis container running
ogr2ogr -f "PostgreSQL" PG:"host=postgis port=5432 dbname=postgres user=postgres password=postgres" TOP10NL_25W.gml -overwrite -progress -t_srs "EPSG:4326" -oo GML_ATTRIBUTES_TO_OGR_FIELDS=YES
ogr2ogr -f "PostgreSQL" PG:"host=postgis port=5432 dbname=postgres user=postgres password=postgres" TOP10NL_34O.gml -append -progress -t_srs "EPSG:4326" -oo GML_ATTRIBUTES_TO_OGR_FIELDS=YES
# https://trac.osgeo.org/gdal/ticket/4939
# http://www.bostongis.com/PrinterFriendly.aspx?content_name=ogr_cheatsheet
ogr2ogr -f "PostgreSQL" PG:"host=postgis port=5432 dbname=postgres user=postgres password=postgres" gis.osm_buildings_a_free_1.shp -overwrite -progress -nln osm_buildings -nlt PROMOTE_TO_MULTI -lco EXTRACT_SCHEMA_FROM_LAYER_NAME=no

# extract the joined data
# https://gis.stackexchange.com/questions/185072/ogr2ogr-sql-query-from-text-file#185141
ogr2ogr -f CSV join.csv PG:"host=postgis port=5432 dbname=postgres user=postgres password=postgres" -overwrite -sql @spatial-join.sql

```

The spatial join sql file referenced at the end already does some buffering to include disjoint geometries:
```postgres-sql
SELECT st_astext(gebouw.wkb_geometry) AS source_wkt, st_astext(osm_buildings.wkb_geometry) AS target_wkt, st_astext(st_intersection(gebouw.wkb_geometry, osm_buildings.wkb_geometry)) AS intersection_wkt
FROM gebouw, osm_buildings
WHERE st_intersects(st_buffer(gebouw.wkb_geometry, 0.00005), osm_buildings.wkb_geometry)
LIMIT 100000

```

Now, I'm not a huge fan of bash scripting, it's not the pretties way to program, but this runs in just a few minutes. Reprojection of the BRT data can be done on the fly, where this is a complete mess in Python GDAL. You can't just reproject a layer like that.
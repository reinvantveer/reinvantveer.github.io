---
layout: post
title: Machine Learning polygon intersection surface areas
---

Trying to construct a 'spatially aware' AI not only teaches me to work with Keras, but also with Python itself. These few months saw my first real introduction to the language (before I had dabbled in some of it, but not much) and its use of list comprehensions and the pythonic way of doing things. I have also learned a lot about a few fundamental tools and frameworks that make things working with multi-dimensional data a lot more convenient and I'm very impressed with frameworks like Numpy and Matplotlib. 

Especially Matplotlib allows me to visualize some of the results I've gotten so far. They show to what extent my model architecture of an [LSTM wrapped with some Dense layers](https://github.com/reinvantveer/Topology-Learning/blob/master/model/intersection_surface.py) is able to cope with estimating surface areas for intersecting polygons. The task is to estimate the intersection surface area in square meter for two intersecting polygons. Some interesting facts:

### Intersection surface area mean: 
33.87 m2
### Intersecting error mean: 
9.06 m2

This means that on average, a surface estimation is still 27% off from the average intersection surface area. This is a huge error. But: it's also a percentage from a model that learned over just a couple of minutes. This isn't a very helpful statistic, as it says nothing about the distribution of error over the examples. But still.

On the bright side: from a training set of roughly 100k examples, I can now show plots of the training examples it is good at predicting, an which ones are hard. I do this by leveraging basic properties of Shapely geometries on pyplot operations:
```python
from matplotlib.collections import PatchCollection
from shapely import wkt
from matplotlib import pyplot as plt
from matplotlib.patches import Polygon

    
def wkt2pyplot(input_wkts, target_wkts=None, target_color='red'):
    """
    .... there's some more stuff in between, but for conciseness
    """
    # TODO: handle other types of geometries
    # TODO: handle holes in polygons (donuts)
    fig, ax = plt.subplots()

    if target_wkts:
        target_geoms = [wkt.loads(target_wkt) for target_wkt in target_wkts]
        for geom in target_geoms:
            if geom.type == 'Point':
                plt.plot(geom.coords.xy[0][0], geom.coords.xy[1][0],
                         marker='o', color=target_color, linewidth=0)
            elif geom.type == 'Polygon':
                collection = PatchCollection(
                    [Polygon(geom.boundary.coords)], 
                    alpha=0.4, linewidth=1)
                collection.set_color(target_color)
                ax.add_collection(collection)
``` 
The [full code is here](https://github.com/reinvantveer/Topology-Learning/blob/master/model/topoml_util/wkt2pyplot.py)

<!-- replace markdown-style images with html-type:
regex replace 
!\[(.+)\]\((.+)\) 
with 
<a href="$2"><img alt="$1" src="$2" style="width: 200px;" /></a>
-->

# Good results
<a href="/images/surface_area_plots/good_2017-09-29%2009.05.17.991071.png"><img alt="good 1" src="/images/surface_area_plots/good_2017-09-29%2009.05.17.991071.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.05.30.203583.png"><img alt="good 2" src="/images/surface_area_plots/good_2017-09-29%2009.05.30.203583.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.05.36.239093.png"><img alt="good 3" src="/images/surface_area_plots/good_2017-09-29%2009.05.36.239093.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.06.13.596117.png"><img alt="good 4" src="/images/surface_area_plots/good_2017-09-29%2009.06.13.596117.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.06.19.437970.png"><img alt="good 5" src="/images/surface_area_plots/good_2017-09-29%2009.06.19.437970.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.06.37.999153.png"><img alt="good 6" src="/images/surface_area_plots/good_2017-09-29%2009.06.37.999153.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.06.44.143116.png"><img alt="good 7" src="/images/surface_area_plots/good_2017-09-29%2009.06.44.143116.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.07.02.400332.png"><img alt="good 8" src="/images/surface_area_plots/good_2017-09-29%2009.07.02.400332.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.07.38.645206.png"><img alt="good 9" src="/images/surface_area_plots/good_2017-09-29%2009.07.38.645206.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.07.44.659456.png"><img alt="good 10" src="/images/surface_area_plots/good_2017-09-29%2009.07.44.659456.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.07.56.954976.png"><img alt="good 11" src="/images/surface_area_plots/good_2017-09-29%2009.07.56.954976.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/good_2017-09-29%2009.08.21.551646.png"><img alt="good 12" src="/images/surface_area_plots/good_2017-09-29%2009.08.21.551646.png" style="width: 200px;" /></a>

Very nice. Results with accuracies in centimeters, or decimeters at worst.

Now for the failure cases...

# Bad results: estimations too high
<a href="/images/surface_area_plots/bad_2017-09-29%2009.00.11.375641.png"><img alt="bad 1" src="/images/surface_area_plots/bad_2017-09-29%2009.00.11.375641.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/bad_2017-09-29%2009.00.18.987419.png"><img alt="bad 1" src="/images/surface_area_plots/bad_2017-09-29%2009.00.18.987419.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/bad_2017-09-29%2009.00.25.234754.png"><img alt="bad 1" src="/images/surface_area_plots/bad_2017-09-29%2009.00.25.234754.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/bad_2017-09-29%2009.00.31.350837.png"><img alt="bad 1" src="/images/surface_area_plots/bad_2017-09-29%2009.00.31.350837.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/bad_2017-09-29%2009.00.37.456713.png"><img alt="bad 1" src="/images/surface_area_plots/bad_2017-09-29%2009.00.37.456713.png" style="width: 200px;" /></a>
<a href="/images/surface_area_plots/bad_2017-09-29 09.00.43.407865.png"><img alt="bad 1" src="/images/surface_area_plots/bad_2017-09-29 09.00.43.407865.png" style="width: 200px;" /></a>

These are intersections where the estimator either (as I can only conjecture) expected one polygon to be entirely within the other. The estimations are all very close to the average intersection.

# Bad results: estimations too low
<a href="/images/surface_area_plots/bad_2017-09-29%2009.00.49.478006.png"><img alt="too low 1" src="/images/surface_area_plots/bad_2017-09-29%2009.00.49.478006.png" style="width: 200px;" /></a> 
<a href="/images/surface_area_plots/bad_2017-09-29%2009.01.01.433684.png"><img alt="too low 2" src="/images/surface_area_plots/bad_2017-09-29%2009.01.01.433684.png" style="width: 200px;" /></a> 
<a href="/images/surface_area_plots/bad_2017-09-29%2009.01.31.869136.png"><img alt="too low 3" src="/images/surface_area_plots/bad_2017-09-29%2009.01.31.869136.png" style="width: 200px;" /></a> 
<a href="/images/surface_area_plots/bad_2017-09-29%2009.01.37.864206.png"><img alt="too low 4" src="/images/surface_area_plots/bad_2017-09-29%2009.01.37.864206.png" style="width: 200px;" /></a> 
<a href="/images/surface_area_plots/bad_2017-09-29%2009.01.43.955994.png"><img alt="too low 5" src="/images/surface_area_plots/bad_2017-09-29%2009.01.43.955994.png" style="width: 200px;" /></a> 
<a href="/images/surface_area_plots/bad_2017-09-29%2009.02.20.793868.png"><img alt="too low 6" src="/images/surface_area_plots/bad_2017-09-29%2009.02.20.793868.png" style="width: 200px;" /></a> 

Very interesting: all cases drawn from the same polygon intersection with another, the second one entirely within the first. The target is way beyond the mean.

# Possible solution
I've been trying to get some gaussian mixture models parameter output working on this, but I'm still trying to get it stable and producing meaningful results (i.e. that don't settle on means and sigmas of 0). That's for another post.
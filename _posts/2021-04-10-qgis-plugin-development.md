---
title: QGIS plugin development
layout: post
---

QGIS, as a (the?) premier GIS client software - is one of my favorite open source projects. Not just because I'm a geospatial developer/researcher but also because it's both well-maintained and I have seen the fantastic development it has gone through over the previous years. It gained a ton of features and a lot more stability along the way. Not that there's no rough edges, but rough edges are in _any_ piece of software basically, it's why software (like art, a quote attributed to Da Vinci) is never truly finished (it just gets abandoned at some point).

I have been a long-term user of QGIS although I never acquainted myself with all the nooks and crannies of the package. However I recently followed an (internal) masterclass on using the fancy [Atlas](https://www.qgistutorials.com/en/docs/automating_map_creation.html) feature that lets you auto-generate templated fancy cartographic layouts of your data. Nowadays I'm more of a "what did I actually produce using this {script,query,export}?" user of QGIS, but I did extensive mapping and editing previously and I found it an extremely useful tool for the job. Particularly helpful for example is the [setting where new polygon parts overlapping with already present objects can be automatically clipped (see tutorial part 15-17)](https://www.qgistutorials.com/en/docs/3/digitizing_basics.html#procedure), then select "Avoid overlap on active layer":

![Avoid overlap on active layer digitizing settings](../images/qgis/qgis-avoid-overlap-on-active-layer.png)

For heavy digitigers, this option will save you hours of work and delivers clean maps with non-overlapping polygons.

But I digress.

## QGIS plugin development
My Python skills have come to fruition only relatively recently over the past couple of years, and pure out of curiosity I started doing some research on what the current state of Python plugin development for QGIS is at the moment. I started with a simple goal: just to learn some stuff about QGIS plugins in Python and have some fun along the way (mission: accomplished), but I also decided not to back down on the more complicated stuff. I created a plugin called [Namari](https://github.com/reinvantveer/namari) that allows you to do [anomaly detection](https://en.wikipedia.org/wiki/Anomaly_detection) on geospatial data.

So, I took to the [docs](https://docs.qgis.org/testing/en/docs/pyqgis_developer_cookbook/plugins/plugins.html#writing-a-plugin) which recommends using the [plugin builder](https://plugins.qgis.org/plugins/pluginbuilder3/) to get started. I must say that this plugin builder is phenomenal to get started with creating your own plugins. It bootstraps an absolute ton of resources for you, but perhaps a little on the heavy side - it's easy to get overwhelmed by the amount. I also created some [level of discussion on the current state of this plugin builder](https://github.com/qgis/QGIS-Enhancement-Proposals/issues/223).

Now, I've become something of a testing enthusiast over the years. I think it has to do a lot with both research reproducibility and product stability. Tests allow you to formally verify that something does what it is expected to do, which often makes me wonder why so little unit/integration testing is done in research.

It probably has a lot to do with the fact that writing good tests is very hard. I can tell, because I do a lot of it. But if it were _only_ hard, I wouldn't be doing it. Writing tests offers me a level of satisfaction that I cannot reach from writing working software alone. Testing doesn't offer _every_ guarantee: your software is stable only to the level of tests can verify and then it still doesn't protect from misuse. But even more than some level of proven correctness, I truly believe testing can be fun, because of the main goals I set for myself: just to learn stuff.

And boy does testing stuff get you to learn stuff. I'd almost say that writing tests is maybe the single most effective way of learning about library APIs and the inner workings of your own code doodles. None more so than for writing integration tests for QGIS plugins. So here we go.

## QGIS plugin integration testing
Doing unit testing on parts of the plugin is all fine and dandy, but I wanted to do a little bit more than just that. After all, a QGIS plugin often has some kind of interaction with the graphical user interface of QGIS. So, how do we test this interaction?

The answer is through integration testing with a working QGIS instance. Now this is where things get quite complex. QGIS offers a `qgis` python package installed in the site-packages of the Python version used by QGIS. But importing this in a stand-alone Python script doesn't get you a fully working QGIS instance, it's just a reference to a module that's intended to run as an _embedded Python process_. So, this process needs to be tied to a running QGIS instance if you want to make use of its full range of capabilities.

Central in the understanding of the connection between the Python `qgis` namespace and the QGIS app is the notion of the `iface`. This `iface` object can be accessed from a running QGIS Python console (just press Ctrl-Alt-P to start one):

![The `iface` object in a running QGIS Python console](../images/qgis-python-console-iface-object.png)

Tis `iface` object gives you an instance of a `qgis.gui.QgisInterface`, which kind of is the bridge between a plugin and events in QGIS. This is why practically all QGIS Python plugins are instantiated by passing (or you could say dependency-injecting) this `iface` object into the plugin constructor.

But you're getting none of this `iface` goodness just by unit testing. Nuh-uh. The plugin builder side-steps this problem by offering a [stubbed QGIS interface object](https://github.com/g-sherman/Qgis-Plugin-Builder/blob/master/plugin_templates/shared/test/qgis_interface.py#L37), but of course this doesn't do much unless you re-create a lot of the functionality here yourself. But that is both tedious and unhelpful: we want to validate the workings of our plugin in a _real_ QGIS environment, not in a stub. How are we going to check whether it will work in the wild otherwise?

The hunt for this elusive `iface` object is documented on several places: [here]()

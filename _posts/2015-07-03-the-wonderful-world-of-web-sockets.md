---
title: The Wonderful World of Web Sockets
layout: default
---

# Collaborative mapping
For a few years now, I had been thinking about how cool it would be to work together on a map, editing, adding features and descriptions, but being able to see what your friends/colleagues were doing. As soon as someone had drawn something on a map, or changed a property, it would be altered in everyone's view.

The benefits would be tremendous. You could have your office on standby to give directions on what to do next, offer a project leader a full live view on what is happening, and have team members coordinate their efforts. Throw in a chat function and get rid of the constant phoning!

From an [SDI](https://en.wikipedia.org/wiki/Spatial_data_infrastructure)'s and robust spatial storage solutions standpoint, this would pose a considerable load, having possibly dozens of clients polling the infrastructure and straining the resources.

# Enter Socket.IO
I thought it would be quite hard to get something like that up and running. To think out the communications system, messaging protocol etcetera. But it turns out that has already been done. It turned out that within a day, I was able to get a lightweight experimental map editing system up and running. The basis is the most symplistic proof of concept that can be thought of: have a mapping application in a browser send and receive point markers placed by any client connected to this same mapping app.
 
![Multimaps screenshot](/images/multimaps.png)

*Live, real-time multi-user map editing in two different browsers - Chrome and Chromium*

The source code was committed to Github on [https://github.com/reinvantveer/multimaps](https://github.com/reinvantveer/multimaps).

This was all made possible by the marvellous [Socket.IO](http://socket.io) API. In just a few lines of code, a two-way communications system between server and client(s) is in place. Messages transmitted from one client can be sent to any other, or all other connected clients. There are limits to the length and complexity of the message, however. When trying to transmit a complete [Leaflet ILayer](http://leafletjs.com/reference.html#ilayer) from a client, it was rejected client-side as having "too much recursion". Looks like chunks of data have to be transmitted if your message is complicated, but when is this actually the case? Better to transmit small changes made by human agents and reduce the risk of data loss due to a faulty connection, power loss, accidental page refreshing or some other reason.

# Robustness
From a data integrity standpoint, the proof of concept is still very fragile. A sudden loss of internet connection, power or a simple page refresh would result in immediate loss data. However, there are lots of solutions to counter these scenarios. For instance: the Socket.IO message system could be easily expanded with a message queue in Redis, for example. Not only would a message be queued client-side, transmitted by a client and received, but it would be queued, persisted in a spatially enabled storage solution (PostGIS, ElasticSearch, you name it), and the result of a succesful transaction would then be transmitted back to the client and broadcasted to the other clients. For edits, one should have a locking system with socket messages in place, so as to prevent several clients editing the same data. So there is some slightly harder data synchronization to consider, but this would be quite feasible.

Such a system would greatly benefit multi-user map editing: it would lessen the strain on resource-hungry middleware systems with WFS capabilities such as [Geoserver](http://www.geoserver.org), and have an easy, high-performance load-balanced messaging system with Socket.IO to augment it with real-time, live mapping capabilities.
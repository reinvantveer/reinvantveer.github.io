---
title: running node.js on a Raspberry Pi
layout: default
---

# Creating a button/sensor app for the Pi v1 B

Recently, I found good reason to start tinkering with my beloved Raspberry Pi again. It's of course very silly and far more time-consuming than is needed for what really needs to be done, but I do it for the fun. After seeing some of [Matthias Petter Johansson's work on YouTube](https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q) I watched his work on the particle.io button app. There are three: [part 1](https://www.youtube.com/watch?v=NRrgtUJnkIo), [part 2](https://www.youtube.com/watch?v=Gh8u7qXZr_8), and [part 3](https://www.youtube.com/watch?v=HptbRSdv6kg). Now I did think that the three episodes combined a huge amount of work to get something internet-of-thingsy going, especially when compared with something like the Raspberry Pi.

I have one of the old versions, the version 1 model B with 512 Mb of RAM and a single core so slow you would hardly think it's even there. This poses even more of a challenge when embarking on a mini-project as I am to describe here, because the dependency installs are monumentally time consuming. Still I think it's worth it. Because I do think that Node.js is one of the best strategies to set up IoT stuff. Why? I'll tell ya.

# Why, for heaven's sake, Node.js on a Pi?

I know, Python is the preferred language for the Pi and I do like Python a lot. Thing is that I've been doing a lot with Node.js lately, fell completely in love and thought it a fine experiment to get things up and running on my good old Pi. I mean, how hard could it be?

# Well, how hard was it?

I must admit I spent more time on setting up an environment than on making the app itself. Installing Node.js itself was pretty easy. Actually it was easier than most (older) guides say. The [adafruit installation instructions](https://learn.adafruit.com/node-embedded-development/installing-node-dot-js) may look tempting and the guide and info is very well written, but unfortunately it's outdated. Nodejs.org now publishes pre-compiled versions that run on the Pi by default. I have an older Pi, so I needed a version compatible with the ARMv6 architecture. It can be found [here](https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-armv6l.tar.xz): this is the current long-term support edition. I unzipped it and copied the contents to /user/local/ but this is a bad idea as well: you should use the package manager:
```sh
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```
(As a matter of fact I didn't try this, but it should work)

Thing is that people often tell you to run scripts, being it Python or JavaScript/Node.js, as root. It's hardly a production environment, but you shouldn't run any scripted language as root, period. Read why [here](http://syskall.com/dont-run-node-dot-js-as-root/) but the general idea is, that when you expose some kind of user interaction with a Node.js script - a search box, an API with some parameter or something - you'd definitely not want your user to be able to affect the whole system if there were a possibility of SQL injection, or bash injection or whatever. If your app would have a vulnerability, restricting the executed script to some default user would surely limit the possible damage. 

So, I wanted to run the script as a normal user. And access the GPIO or [General Purpose Input/Output](https://www.raspberrypi.org/documentation/usage/gpio/) pins. That's where the real fun in the Pi lies and where it is so handy as an IoT device. But silly enough, you need to have root permissions by default to access them. So many programs and scripts accessing the GPIO tell you to run their stuff as root, which is a bad idea.

Some considerable time I invested in setting up the script that didn't require superuser permissions to run it, while still being able to read and set the GPIO pins. I succeeded by using the [wiringpi](https://npmjs.org/package/wiringpi), combined with the gpio program. The gpio package is installed as follows:
```sh
sudo apt-get install python-dev python-rpi.gpio
```

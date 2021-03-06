---
title: Internet-of-Thingsify your Raspberry Pi with JavaScript!
layout: default
---

Full history for the article [here](https://github.com/reinvantveer/reinvantveer.github.io/commits/master/_posts/2016-07-28-running-nodejs-on-a-pi.md).
# Creating a button/sensor app for the Pi v1 B

Recently, I found good reason to start tinkering with my beloved Raspberry Pi again. It's of course very silly and far more time-consuming than is needed for what really needs to be done, but I do it for the fun. After seeing some of [Matthias Petter Johansson's work on YouTube](https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q) I watched his work on the particle.io button app. There are three: [part 1](https://www.youtube.com/watch?v=NRrgtUJnkIo), [part 2](https://www.youtube.com/watch?v=Gh8u7qXZr_8), and [part 3](https://www.youtube.com/watch?v=HptbRSdv6kg). Now I did think that the three episodes combined a huge amount of work to get something internet-of-thingsy going, especially when compared with something like the Raspberry Pi. So I thought: it would be a nice project for my holiday to install a plant watering system with a low water level sensor, alerting the neighbours when the reservoir needed to be refilled!

I have one of the old versions, the version 1 model B with 512 Mb of RAM and a single core so slow you would hardly think it's even there. This poses even more of a challenge when embarking on a mini-project as I am to describe here, because the dependency installs are monumentally time consuming. Installation of the [ESlint](https://npmjs.com/package/eslint) code quality package and the related [eslint-config-airbnb](https://npmjs.com/package/eslint-config-airbnb) took a whopping 47 minutes, just to do a local `eslint --init`. Still I think it's worth it. Because I do think that Node.js is one of the best strategies to set up IoT stuff. Why? I'll tell ya.

# TL;DR
It works, even on an old Pi running Wheezy. Install the gpio package using 
```sh
sudo apt-get install python-dev python-rpi.gpio
```
Install Node.js if you're still operating a v1 Pi with Debian Wheezy through
```sh
cd
wget https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-armv6l.tar.gz
cd /usr/local
sudo tar xzvf ~/node-v4.4.7-linux-armv6l.tar.gz
rm ~/node-v4.4.7-linux-armv6l.tar.gz
```
Clone the repo, install and run:
```
git clone https://github.com/reinvantveer/rpi-button-app
cd rpi-button-app
npm install
npm run
```

# Why, for heaven's sake, Node.js on a Pi?

I know, Python is the preferred language for the Pi and I do like Python a lot. Thing is that I've been doing a lot with Node.js lately, fell completely in love. I think the non-blocking, asynchronous nature of the engines executing server-side JavaScript is very efficient, it allows for nice coding, especially with the improvements ES6/ES2015 brought. Setting up and maintaining API's for IoT purposes is a breeze with Node.js, so much that I would consider using the Node.js [Express package](https://npmjs.com/package/express) the first candidate for getting started quickly. So I thought it a fine experiment to get things up and running on my good old Pi using back end JavaScript. I mean, how hard could it be?

# Well, how hard was it?

I must admit I spent more time on setting up an environment than on making the app itself. Installing Node.js itself was pretty easy. Actually it was easier than most (older) guides say. The [adafruit installation instructions](https://learn.adafruit.com/node-embedded-development/installing-node-dot-js) may look tempting and the guide and info is very well written, but unfortunately it's outdated. Also trying to `apt-get install` the package is of little use: it tried to install node version 0.6 which is ancient. Fortunately, Nodejs.org now publishes pre-compiled versions that run on the Pi by default. I have an older Pi, so I needed a version compatible with the ARMv6 architecture. It can be found [here](https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-armv6l.tar.gz): this is the current long-term support edition Argon. I unzipped it and copied the contents to /user/local/ as follows:
```sh
cd
wget https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-armv6l.tar.gz
cd /usr/local
sudo tar xzvf ~/node-v4.4.7-linux-armv6l.tar.gz
rm ~/node-v4.4.7-linux-armv6l.tar.gz
```

# And then?

Thing is that people often tell you to run scripts on the Pi, being it Python or JavaScript/Node.js, as root. This is because you need to have root permissions by default to access the [General Purpose Input/Output](https://www.raspberrypi.org/documentation/usage/gpio/) pins. That's where the real fun in the Pi lies and where it is so handy as an IoT device. So many programs and scripts accessing the GPIO tell you to run their stuff as root, which is a bad idea. 

It's hardly a production environment, but you shouldn't run any scripted language as root, period. Read some stuff on why [here](http://syskall.com/dont-run-node-dot-js-as-root/) but the general idea is, that when you expose some kind of user interaction with a Node.js script - a search box, an API with some parameter or something - you'd definitely not want your user to be able to affect the whole system if there were a possibility of SQL injection, or bash injection or whatever. If your app would have a vulnerability, restricting the executed script to some default user would surely limit the possible damage. Besides, there's lots of novice users of Pi's who will start believing that, if you just simply run anything as root, you won't run into permission errors. So to be clear: permission errors are there for a good reason, they are there to prevent you from blowing up your system. Don't run stuff as root, unless you actually have to. So, all Raspberry Pi users out there: set up the GPIO so that you can access it over a default user account.

So, I wanted to run the script as a normal user. And access the GPIO. So I did a semi-elaborate package comparison and found a very agreeable solution. Some considerable time I invested in setting up the script that didn't require superuser permissions to run it, while still being able to read and set the GPIO pins. There's a myriad of packages that tell you to run as root.

The [pi-gpio package](https://www.npmjs.com/package/pi-gpio) at least gets it right to warn [not to use the GPIO as root](https://github.com/rakeshpai/pi-gpio/blame/master/README.md#L329) but uses an unmaintained package [quick2wire-gpio-admin](https://github.com/quick2wire/quick2wire-gpio-admin) which didn't work enough for me to use. So skip this one and go for:

# The holy grail of sane use of GPIO and Node.js on the Raspberry Pi

I succeeded by using the [wiringpi](https://npmjs.org/package/wiringpi), combined with the gpio program. The gpio package is installed as follows:
```sh
sudo apt-get install python-dev python-rpi.gpio
```

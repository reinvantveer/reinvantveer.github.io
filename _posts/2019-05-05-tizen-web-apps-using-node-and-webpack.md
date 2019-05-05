# Tizen web app development using node.js, NPM and WebPack
A lot of people at my work are showing up with smartwatches. I don't expect the smartwatch having such an impact on daily life as the smartphone did for mobile phones, it has much more the feel of a gadget. To fidget with. 

However, I took the step of buying one myself as well. I didn't want to invest a lot, so I purchased a 'second chance' model (basically a returned item) under € 200, just to see what all the fuss is about. Are my colleagues just being silly, showing off oversized, clunky watches, or is there actually something useful to the smartwatch? I decided to find out for myself.

One feature I definitely required, is that the software platform on the device must be hackable. Preferably in an open source-y kind of manner. This ruled out any stuff from any manufacturer with an ecosystem that is too self-oriented or closed. This got rid of quite a few products. I mostly compared Android and Tizen platform stuff, since these appeared to gravitate to the more open ecosystem side. I read up on some 'versus' posts and reviews such as [this one](https://www.wareable.com/smartwatches/tizen-os-vs-android-wear) and settled for a Samsung Wear S3 Frontier, also because it was very affordable. 

## However
To get the development environment set up and getting a first application to run, is quite, quite the hassle. Prepare for a few days to get everything up and running:

## Connecting the watch
The S3 Frontier doesn't have WiFi, so you connect it to Tizen Studio through a truly convoluted way: through your phone. The [Samsung Wear app on Android](https://play.google.com/store/apps/details?id=com.samsung.android.app.watchmanager) is allowed to connect over bluetooth to the watch, and the btconnect sub-app somehow tunnels the watch to the pc, but only if you have developer mode enabled on your phone. Really? Really. However, in trying to connect, I did not have any success. The watch wouldn't show up. Until I read this pivotal piece of information: [have you tried turning it off and on again?](https://developer.samsung.com/forum/thread/unable-connect-using-sdboverbt/201/350583#post4). That seemed to do the trick. Unless you lose the connection, and then you need to restart your watch again. 

Also, I found that connecting the watch through [Galaxy Watch Designer](https://developer.samsung.com/galaxy-watch/design/watch-designer/) was the most stable way. You click the 'Run on device' button on the top right (also reached through shortcut F9) which allows you to scan for the S3 Frontier, which will take some more patience. All in all, it's a pretty meagre development experience, but it works. That's just getting it connected, though. You'll have to persevere some more.

To be continued...
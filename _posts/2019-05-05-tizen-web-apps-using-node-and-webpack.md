# Tizen web app development using node.js, NPM and WebPack
A lot of people at my work are showing up with smartwatches. I don't expect the smartwatch having such an impact on daily life as the smartphone did for mobile phones, it has much more the feel of a gadget. To fidget with. 

However, I took the step of buying one myself as well. I didn't want to invest a lot, so I purchased a 'second chance' model (basically a returned item) under € 200, just to see what all the fuss is about. Are my colleagues just being silly, showing off oversized, clunky watches, or is there actually something useful to the smartwatch? I decided to find out for myself.

One feature I definitely required, is that the software platform on the device must be hackable. Preferably in an open source-y kind of manner. This ruled out any stuff from any manufacturer with an ecosystem that is too self-oriented or closed. This got rid of quite a few products. I mostly compared Android and Tizen platform stuff, since these appeared to gravitate to the more open ecosystem side. I read up on some 'versus' posts and reviews such as [this one](https://www.wareable.com/smartwatches/tizen-os-vs-android-wear) and settled for a Samsung Wear S3 Frontier, also because it was very affordable. 

## However
To get the development environment set up and getting a first application to run, is quite, quite the hassle. Beware, for example, that Tizen Studio (the version I'm running: v3.2) does not run with the latest version of Java, which is v.11 at the moment. You need Java 8. I'm not going to run through all the motions for getting Java 8 installed and available to your system at this point, but I will suffice to say that the %JAVA_HOME% environment variable needs to be set and that the %JAVA_HOME%/bin directory of your Java install needs to be in your path. Same probably goes for Linux environments: you will need a fully-set up Java installation, which on Linux is perhaps a little easier. Trick is that when you have different Java versions installed, you can use [`update-alternatives`](https://stackoverflow.com/questions/12787757/how-to-use-the-command-update-alternatives-config-java) to select Java 8 on Linux. Prepare for a few days to get everything up and running.

## Connecting the watch
The S3 Frontier doesn't have WiFi, so you connect it to Tizen Studio through a truly convoluted way: through your phone. The [Samsung Wear app on Android](https://play.google.com/store/apps/details?id=com.samsung.android.app.watchmanager) is allowed to connect over bluetooth to the watch, and the btconnect sub-app somehow tunnels the watch to the pc, but only if you have developer mode enabled on your phone. Really? Really. However, in trying to connect, I did not have any success. The watch wouldn't show up. Until I read this pivotal piece of information: [have you tried turning it off and on again?](https://developer.samsung.com/forum/thread/unable-connect-using-sdboverbt/201/350583#post4). That seemed to do the trick. Unless you lose the connection, and then you need to restart your watch again. 

Also, I found that connecting the watch through [Galaxy Watch Designer](https://developer.samsung.com/galaxy-watch/design/watch-designer/) was the most stable way. You click the 'Run on device' button on the top right (also reached through shortcut F9) which allows you to scan for the S3 Frontier, which will take some more patience. All in all, it's a pretty meagre development experience, but it works. That's just getting it connected, though. You'll have to persevere some more, if you have a non-WiFi watch. The workflow that seems to work in a repeatable fashion is like:

1. Connect the Android phone to your dev laptop. Make sure the watch is paired with the phone in use and that the phone is in developer mode.
1. Have the Samsung Wear app running on your phone
1. Reset the watch by powering down and up again
1. Open the Galaxy Watch Designer application on the dev laptop. Hit F9, which will open up a menu box.
1. Select the Android phone listed there by clicking on it.
1. This will open up the `sdboverbt` app on your phone. Connect the watch over bluetooth by hitting the 'SELECT DEVICE FOR DEBUGGING' button and selecting the watch item in the list.
1. The Galaxy Watch Designer application will appear to do nothing. Click the phone item in the Run on Device menu again. Click on "Scan devices".
1. Develop a vague sense of "this isn't working" and select the phone item again. Click "Scan devices again".
1. The Galaxy Watch Designer application seems to get stuck for a split second, then shows a popup informing you that having the watch connected over bluetooth over a prolonged period can drain the battery on the watch.
1. If the above steps fail to produce a working connection, reiterate from 1.  

- You're in!


You can now add the watch device in Tizen Studio using the 'Remote devices' in the Device manager (Alt-Shift-V). It should be easy to find now. The cool thing is that you can 

## Permission hurdles: certificates, features and priviledges
The second hurdle to overcome is that you need special Samsung-issued certificates to install your home-made apps on a Samsung watch. This step is a little less fickle than getting your watch connected through a phone, but it does require a few steps. The easiest method is probably through Tizen Studio. You need to install the Samsung certificate plugin through the package manager (Alt-Shift-P). Under "Extension IDE", find the Samsung Wearable and Samsung Certificate plugins and install these. Then, follow the instructions to install the certificates. If you don't, you will get a security error on trying to deploy your pretty app to your watch.

Once you have the certificates installed, you need to declare the features and privileges your app needs. For example, if your app needs to access stuff from around the web (and who doesn't?), you need to edit the config.xml file of your project in Tizen Studio. Add the `http://tizen.org/feature/network.internet` feature and the `http://tizen.org/privilege/internet` privilege. 

Setting these features and privileges isn't enough by itself, though. The user needs to grant permissions to these privileges. Fortunately, the application itself can ask the user for these privileges itself, allowing the user to opt in for a default setting/'remember this choice' that prevents the application to ask permission every time the application starts. However, the watch will ask permission each time you re-deploy a newer version of your app, though.

In order to ask the user for the required privileges, you need some code. Since we are making a Tizen web app, this is done in JavaScript. The Tizen web apps a fairly recent JavaScript engine available. The command `navigator.userAgent` gives the following useful information:
`"Mozilla/5.0 (Linux; Tizen 4.0; SAMSUNG SM-R760) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.0 Mobile Safari/537.36"`
So although it isn't exactly the most recent version (I have Chrome v.74 running at the moment, [56 was issued January 2017](https://developers.google.com/web/updates/2017/01/nic56) so over 2 years ago), it has support for ES6 language features, including [`class`es](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`Symbol`s](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) and [fat arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). In a nutshell: every language feature that makes JavaScript into a great modern-age functional programming language. 

Not so pretty is the fact that Tizen Studio has not yet figured out the existence of ES6. It still assumes ES5 syntax. I would recommend, therefore, that at this point, we drop Tizen Studio as a development tool, and to use it just as a build tool. Instead, we are building our app in [Visual Studio Code](). 

To be continued...
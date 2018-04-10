---
layout: post
title: Repeated deep learning training for spread
comments: true
---

A few months ago, I wrote about the benefits of using a [build server to schedule deep learning training jobs](/2017/10/25/queue-ml-builds.html). The use of a build server greatly reduces the planning strain on doing multiple hyperparameter sweeps or neural net configurations over an extended time (say, the weekend). By fully automating the jobs in a build queue, any set of changes to a script, even the same script in different versions, can be executed and tested for performance without the versions getting in each other's way.

Previous week, I added an extra level to this. So this blog could be considered part 2 in a series on executing model training sessions as automated builds.

## Rationale
Neural nets have the unfortunate property of being inexact. Not only in the right predictions, but also in the variance in accuracy over each training session. Depending on which data is fed to them and the randomized initialisation state of the net, accuracy performance varies between training sessions. Especially if there is not a lot of data to train on, these differences can be considerable. My neighborhoods task (predicting the number inhabitants based on the geometry) has an accuracy standard deviation of about sigma=0.015 on a mean of mu=0.66, which means that (assuming the distribution is normal) 95% of the session performance is between mu +/- 2 * sigma = [0.63, 0.69] which is a sizeable interval.

There is a very important consequence that follows from this spread. It means that if I train a new model with different settings - say I tweak the learning rate a little - a single training session will tell me nothing about whether my new configuration performs better or worse, not if I do not know the performance spread of my model. Say the accuracy score of my new model configuration is 0.68 instead of 0.66. There's a good chance that it is within two standard deviations from the mean, which is as much to say that it could be just an outlier, a fluke. How do we know? By repeating our experiments.

So, it is important to get an indication for the spread of the accuracy results. For this, we need to sample from the distribution. I'm going for 10 samples, more would be better but more samples means more compute time. Go wild on this if you need to be more certain, often I would be more comfortable knowing the spread of my results with twenty repeats instead of ten, but ten at least gives an indication of the spread and whether the adjustments we are making to our model actually contribute to a better model. 

Yes, repeat, ten times. Since I'm testing LSTM architectures, the compute time for these can be very high. Throw in a bi-directional layer here, a time-distributed dense layer there, tweak the LSTM hidden size a little and you're looking at hours of training for a decent 200-epoch training session. Repeat ten times sequentially on a single machine and you're looking at days for testing a single set of hyperparameters. Combine this with the time to process the results and it's going to be a very long season. Time to parallelize!

## Horizontal parallelization
If we can parallelize, things can be sped up. However, it is difficult to parallelize the training on the same machine. This has to do with memory management. The machine learning framework will try to fit as much data of the batch it is training on in (GPU if you have it) memory as it can. If, by the 8th parallel running training session the memory is full, the 9th session will throw an out of memory error. For a single session on one machine, however, the memory is managed more easily, so it's more manageable to parallelize horizontally (i.e. more machines) than vertically (a bigger machine with more resources). 

If we run our ten experiments on ten machines, we can run overnight some pretty heavy models. But, to keep costs under control, I want a fully automated pipeline. I don't want to spend my weekend (or night) looking overe my shoulder constantly to see if the model training has ended and my costly machine can be shut down to save costs. So, I have the following requirements:

- The machines should only be fired up on a commit to my repository
- The machines should automatically pick up the changes and execute the changed scripts only. [I already implemented this](/2017/10/25/queue-ml-builds.html).
- The machines should shut down automatically, but only if the execution queue is empty. This prevents collisions between successful training sessions and commits that have been done in between. It doesn't matter if multiple in-between start-up triggers will occur in the meantime, the server doesn't double-boot or something.

In the [next part](), we're going to create the listening script that fires up the machines.
---
layout: post
title: A Generative Life Drawing Model
published: true
---

## On how AI can be of use to artists

The word "model" has to be one of the most overloaded terms in the history of human language. An abstraction or 
physical thing, tangible or ephemeral, something that stands for something else but can be something of itself at the 
same time. In this article I will combine "models" of both kinds, from the artistic domain and the "artificial 
intelligence" domain, although I try to shy away from this presumptious term, I'd rather opt for "machine learning" in
most cases.

<div style="display: table">
    <figure style="width: 40%; float: left">
      <img src="/images/models/model-g2f005866f_1920.jpg" alt="An artist's 'model'? Or the real thing?"/>
      <figcaption>An artist's "model"? Or the real thing? Source: 
        <a href="https://pixabay.com/photos/model-redhead-education-5953621/">Pixabay, by Victory Borodinova</a>
      </figcaption>
    </figure>
    
    <figure style="width: 40%; float: right">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/1925_Ford_Model_T_at_Hatfield_Heath_Festival_2017_-_01.jpg/450px-1925_Ford_Model_T_at_Hatfield_Heath_Festival_2017_-_01.jpg?20170710083231" alt="The Ford 'model' T"/>
      <figcaption>The Ford "model" T. Yep, a model too. Source: 
        <a href="https://commons.wikimedia.org/wiki/File:1925_Ford_Model_T_at_Hatfield_Heath_Festival_2017_-_01.jpg">CC-BY-SA 4 WikiMedia Commons, by Acabashi</a>
      </figcaption>
    </figure>
</div>

### Art models

The artistic context: a model (in the stricter sense) is usually a person. Someone offering to pose for artists such a
sculptors or painters. The model acts as a reference for the artist to draw or sculpt a work of art. There is, of
course, something weird about this. The "model" in this case, the actual thing. The artwork could be more aptly
described as a model for the real thing, rather than the other way round!

### Machine learning models

Machine learning models usually _are_ proxies for a real (or an imagined) world domain. "Classic" domain examples, in as
far as anything in a field so young can be called as such, are models for
the ["MNIST" handwritten digit recognition](http://yann.lecun.com/exdb/mnist/) or
the ["ILSVRC" image recognition challenge](https://www.image-net.org/challenges/LSVRC/). These datasets have played a
significant role in shaping machine learning history. The "models" in the machine learning case, are pieces of software
that are able to perform some task or other: recognizing digits, or classifying images.

## Models generating models

Machine learning and art share a great deal of shared interest. There are numerous examples of cases where machine 
learning has been used to generate or emulate art, often with great success.

In my [previous post](/2022/01/29/easier-operator.html) I used a generative model to generate images from text to
include in my article. This was more something of a gimmick, to spice up the article a bit and to play around. But it
sparked my interest again in using generative models for artistic purposes. Especially since I started sharing an 
atelier with seven other art painters.

## FAFA-VAE

### Troubleshooting

The first iteration of my model created logs like this:
```
 1/16 [>.............................] - ETA: 51s - loss: 283867.6875 - reconstruction_loss: 283867.4375 - kl_loss: 0.2540
 2/16 [==>...........................] - ETA: 22s - loss: inf - reconstruction_loss: 70986436616009023488.0000 - kl_loss: inf
 3/16 [====>.........................] - ETA: 20s - loss: nan - reconstruction_loss: nan - kl_loss: nan
 4/16 [======>.......................] - ETA: 22s - loss: nan - reconstruction_loss: nan - kl_loss: nan
 5/16 [========>.....................] - ETA: 19s - loss: nan - reconstruction_loss: nan - kl_loss: nan
 6/16 [==========>...................] - ETA: 16s - loss: nan - reconstruction_loss: nan - kl_loss: nan
 7/16 [============>.................] - ETA: 14s - loss: nan - reconstruction_loss: nan - kl_loss: nan
 ... (etc)
```
When this happens, you know there is something seriously wrong with the training. It could happen randomly, but in my
case, it was consistent. Deep learning is a much more a matter of "negotiation" with a model, data and a loss function
than "normal" programming is. At times it really feels like you have to "coach" your model into training properly.

So what do these `nan`s mean? `nan` is, of course "not a number", which happens whenever your model tries to:
- divide by zero
- tries to compute log(0)
- tries to take the root of a negative number
- all the things they taught you that you shouldn't do with numbers

When we look closely, we see that the model doesn't start out with `nan` loss. It actually computes something sensible,
but right after epoch 1, it spirals out of control. The reconstruction loss explodes and the `kl_loss`, which is the 
[Kullback-Leibler divergence](https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence) loss, is so large that
it overflows the max value and becomes `inf`. This is generally caused by a phenomenon known 
as ["exploding gradients"](https://machinelearningmastery.com/exploding-gradients-in-neural-networks/). The trouble is
that there are many known causes, but fortunately also many known fixes for it. It is also an inescapable part of
machine learning model development.

Things that may help:
- Normalizing/whitening of your input data. Deep neural nets generally need data with mean 0 and unit variance. In my 
  case, I already used either feature-wise normalization or sample-wise normalisation, but no whitening.
- Lowering the learning rate. In my case, this helped to debug things. At the very least it allows you to see how the
  model losses develop.
- Fix your loss function. Maybe there's a mathematical error or a bug in there somewhere. Look closely.

In my case, I switched from a binary cross-entropy to a mean squared error to calculate the image reconstruction loss.
Why this helps in the first place is still beyond me. The reasons to choose either one of these loss functions is quite
complex.

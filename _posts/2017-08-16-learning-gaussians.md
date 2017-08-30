---
layout: default
title: Learning on geospatial gaussians
---

# Gaussian distribution wrangling in Keras loss functions
For my machine learning task, I'm having my neural net trying to predict the intersection between two geometries. Having this is an important step towards building neural net heuristics on relevance: geometries with a large overlap are probably more relevant to each other in a geospatial processing task involving analysis of data quality or some other goal.

After dissecting the geometries to rough points and some one-hot encoded features, I took to building my first 'hand-made' neural net. This is by far the most complicated programming task I have undertaken so far. Although [Keras](https://keras.io) is instrumental in deposing a lot of the complexity, it is very hard getting to know the API and its back end and getting some feeling for the intricacies and black art of neural net tuning. I did a lot of debugging and tried to do some unit testing, but the latter is especially hard since a lot of the code is handled in a mostly black box back end with deferred execution. It took two full weeks of hacking and testing to get some feel for what this system is all about. 

One core thing my net is supposed to predict, is the position of x, y pairs of coordinates in longitude and latitude. The trouble is that the LSTM cell has trouble giving proper weights and biases in direct estimations of these pairs, comparing validation results with predicted results. The coordinates go up from (0, 0) to about (3, 20) with some parameter tweaking, but then the learning curve diminishes and converges to estimations half way across the globe, rendering its application completely useless. Moreover, the net invariably experiences 'mode collapse' ([see also](http://aiden.nibali.org/blog/2017-01-18-mode-collapse-gans/)) where it just settles for a single sequence of points to represent the intersection, where this single sequence has an error of just about the same for every input. 

However, good results have been gained with geometries, although in a different format than geospatial, through [sketch-rnn](https://magenta.tensorflow.org/assets/sketch_rnn_demo/index.html). They tackle the training problem by estimating gaussian distributions of the target geometries, rather than direct sampling of the coordinate error. Somehow (I don't understand why) this works a lot better. I hope that, in some far or near future, a network cell architecture will be devised that addresses this issue.

# Attempts to calculate gaussian loss
Where you can simply calculate the loss for coordinates using mean squared error (mse), measuring the loss for gaussian parameters is harder. First, I needed to insert three extra positions in my vector for the bivariate gaussian parameters: a sigma for the axis, a sigma for the y axis and a rho for the correlation between the two gaussian distributions. The question is: how to minimize the cartesian distance between the validation coordinates and the predicted gaussians?

I've come up with a simple loss function that's pretty robust, also for higher and lower range numbers:
```python
from keras import backend as K
from keras.backend import epsilon
import numpy as np

def gaussian_1d_loss(target, prediction):
    x = target[:, 0:1]  # Assuming your distance and target sigma are here
    mu = prediction[:, 0:1]  # Assuming your distance and target sigma are here
    norm = K.log(1 + K.abs(x - mu))  # needs log of norm to counter large mu diffs
    variance = K.softplus(K.square(prediction[:, 1:2]))  # Softplus: prevent NaN on 0 sigma and converge to 0

    z = K.exp(-K.square(K.abs(norm)) / (2 * variance) + epsilon())

    # pdf -> 0 if sigma is very large or z -> 0; NaN if variance -> 0
    pdf = z / K.sqrt((2 * np.pi * variance) + epsilon())
    return -K.log(pdf + epsilon())  # inf if pdf -> 0
```

# Succes!
After a lot of experimentation and a little help from my supervisor I finally figured out what was going wrong. A lot depends on the rough equivalence of the scales of your input data and target data. To be precise: I have two buildings sitting next to each other, and I want to have the distance between them as precise as possible. The problem is that the coordinate system of longitude and latitude describe the location of the buildings on a world scale, where the distance is in mere meters. The significant digits the network needs to look at, are so far hidden behind the decimal dot that it doesn't converge to anything remotely useful. It will project its estimations on a world scale, since the input data is expressed on a world scale. As soon as I shift my reference point to a local scale by subtracting a base offset (basically the lon and lat of the first point) from all points, the network is able to infer meaningful and correct answers.

If you have things in lon/lat degrees of shape (batch, 2, 2):
```python
import numpy as np

# Bring coordinates and distance in roughly the same scale
base_precision = 1e6
base = np.floor(base_precision * training_vectors[:, 0:1, :])
base = np.repeat(base, 2, axis=1)
training_vectors = (base_precision * training_vectors) - base
```

The full working example is at: https://github.com/reinvantveer/Topology-Learning/blob/master/model/centroid_distance.py

This isn't exactly doing anything useful yet, but it is a step in the right direction.
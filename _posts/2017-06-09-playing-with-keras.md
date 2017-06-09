---
layout: default
title: Playing with Keras
---

This week, I'm playing around a bit with Keras, specifically [this tutorial](http://machinelearningmastery.com/sequence-classification-lstm-recurrent-neural-networks-python-keras/). I have two goals: try to learn a bit more about LSTMs, and see GPU accelerated computing in action.
 
# Keras
As I understand it, [Keras](https://keras.io/) is a high-level abstraction library for machine learning, or a "high-level neural networks API" as they call it. Coming from a geospatial background, it is not unlike libraries like [GDAL](http://www.gdal.org/) that abstract away the complexity of geospatial processing, but keep the configurability for the desired results. Of course, in their functioning they are nothing alike, but I imagine the early days of geospatial processing to be somewhat similar to the current days of machine learning. In the eighties, I would figure you would need quite a bit of knowledge of matrix transformation to reproject geometries, which is nowadays completely abstracted away.

Keras is a blessing, because for ML noobs like me, you can do quite complex stuff with a minimum of code. 

# The code

The code I used to run the test was based on the [tutorial](http://machinelearningmastery.com/sequence-classification-lstm-recurrent-neural-networks-python-keras/) mentioned above.

```python
# LSTM and CNN for sequence classification in the IMDB dataset
import time
start_time = time.time()

import numpy
from keras.datasets import imdb
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers.convolutional import Conv1D
from keras.layers.convolutional import MaxPooling1D
from keras.layers.embeddings import Embedding
from keras.preprocessing import sequence

# fix random seed for reproducibility
numpy.random.seed(7)

# load the dataset but only keep the top n words, zero the rest
top_words = 5000
(X_train, y_train), (X_test, y_test) = imdb.load_data(num_words=top_words)

# truncate and pad input sequences
max_review_length = 500
X_train = sequence.pad_sequences(X_train, maxlen=max_review_length)
X_test = sequence.pad_sequences(X_test, maxlen=max_review_length)

# create the model
embedding_vector_length = 32
model = Sequential()
model.add(Embedding(top_words, embedding_vector_length, input_length=max_review_length))
model.add(Conv1D(filters=32, kernel_size=3, padding='same', activation='relu'))
model.add(MaxPooling1D(pool_size=2))
model.add(LSTM(100))
model.add(Dense(1, activation='sigmoid'))
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
print(model.summary())
model.fit(X_train, y_train, epochs=3, batch_size=64)

# Final evaluation of the model
scores = model.evaluate(X_test, y_test, verbose=0)
print("Accuracy: %.2f%%" % (scores[1]*100))
print("--- %s seconds ---" % (time.time() - start_time))

```

# CPU versus GPU

The second element I am evaluating today, is the processing performance of my beefy laptop versus an Amazon G2 instance. 

On both machines, the same software versions were used:
- Keras 2.0.4
- Tensorflow 1.1.0
My laptop runs Windows 10, The Amazon instance uses an [Ubuntu Deep Learning Image](https://aws.amazon.com/marketplace/pp/B06VSPXKDX?qid=1495723743439&sr=0-4&ref_=srh_res_product_title)

To be specific, I use a:
- [Dell Latitude E5570](http://www.dell.com/en-us/work/shop/productdetails/latitude-e5570-laptop)
- 500 Gb rotating disk
- Quad core i7-6820HQ @ 2.71 Mhz
- 16 Gb of mem

The Amazon instance:
- [GPU instance g2.2xlarge (the information on this page may change)](https://aws.amazon.com/ec2/instance-types/)
- 8 cores of Intel Xeon E5-2670 (which is nearly irrelevant for our case)
- 1 NVIDIA [Kepler GK104](http://international.download.nvidia.com/pdf/kepler/NVIDIA-Kepler-GK110-GK210-Architecture-Whitepaper.pdf) GPU, with 1,536 CUDA cores and 4GB of video memory (review [here](http://www.tomshardware.com/reviews/geforce-gtx-680-review-benchmark,3161-2.html))
- 15 Gb ram
- 50 Gb SSD

## Result times
For my laptop:
```
Epoch 1/3
25000/25000 [==============================] - 153s - loss: 0.4313 - acc: 0.7853   
Epoch 2/3
25000/25000 [==============================] - 151s - loss: 0.2504 - acc: 0.9016   
Epoch 3/3
25000/25000 [==============================] - 150s - loss: 0.2082 - acc: 0.9209
Accuracy: 86.28%
--- 521.9615740776062 seconds ---
```
Which we will round to 522 seconds or 8 minutes and 42 seconds. Since there is a level of randomness involved here (the numpy random seeding is set at the top of the code - this should give a hint), this result of 522 seconds varies a few seconds from run to run. The author of the tutorial doesn't say on what kind of hardware he ran his code, but it is a lot slower than the time under three minutes reported, even though his sample was smaller.

For the Amazon G2.2xlarge instance:
```
Epoch 1/3
25000/25000 [==============================] - 277s - loss: 0.5203 - acc: 0.7264
Epoch 2/3
25000/25000 [==============================] - 212s - loss: 0.2689 - acc: 0.8942
Epoch 3/3
25000/25000 [==============================] - 210s - loss: 0.2217 - acc: 0.9136
Accuracy: 87.80%
--- 843.460572719574 seconds ---
```
This we will round to 843 seconds or 14 minutes and 3 seconds. That means that the GPU instance was 1.6 times slower (!) than the CPU laptop. This is quite surprising to me. I had expected the GPU to be an order of magnitude faster, as is [promised often](https://blogs.nvidia.com/blog/2014/03/25/machine-learning/). It turns out it rather depends on your hardware. Am I using the wrong Amazon instance?

Let's pick a heavier Amazon instance: the G2.8xlarge with four times the GPU as the .2xlarge:
```
25000/25000 [==============================] - 214s - loss: 0.4898 - acc: 0.7464     nsatisfied allocation rate=0
Epoch 2/3
25000/25000 [==============================] - 205s - loss: 0.2660 - acc: 0.8942
Epoch 3/3
25000/25000 [==============================] - 202s - loss: 0.2182 - acc: 0.9149
Accuracy: 87.76%
--- 714.0878260135651 seconds ---
```

What?! The number of GPUs hardly seems to have any effect! It looks like the code doesn't take advantage of everything the machine has to offer. The price of a G2.8xlarge is understandably [four times](https://aws.amazon.com/ec2/pricing/on-demand/) that of a .2xlarge, but blindly throwing more resources at it doesn't help in this case. So, probably you can stack a far larger neural net into a G2 instance, but the example evidently isn't put together this way. I won't go further into that now. For now, it has been a very informative friday. The lesson seems to be: use a larger instance only if you can test whether the vertical scalability can be exploited by the code...

# P2
Actually, the instance type that is listed as purposed for machine learning is the P2 type. It has varying degrees of beefiness, but as last test, I'm going to run the code on a P2:

- 4 Intel Xeon E5-2686v4 (Broadwell) Processor cores
- [NVIDIA K80 GPU](http://www.nvidia.com/object/tesla-k80.html), with 2,496 cores and 12GB of memory

The P2 instances go to ridiculous size, with 16 GPUs, 732 Gb mem and 64 CPU cores for the P2.16xlarge. But for a better comparison, I'm going for the smallest p2.xlarge, which is (only) 27% costlier per hour than the g2.2xlarge.

```
25000/25000 [==============================] - 144s - loss: 0.4413 - acc: 0.7836     9] Raising pool_size_limit_ from 7764 to 8540
Epoch 2/3
25000/25000 [==============================] - 139s - loss: 0.2566 - acc: 0.8991
Epoch 3/3
25000/25000 [==============================] - 137s - loss: 0.2117 - acc: 0.9181
Accuracy: 87.62%
--- 486.45984292030334 seconds ---
```

Aah, finally an Amazon instance that beats my laptop! It isn't by much (93% of my laptop baseline), but it's slightly faster. I think the improvement benefits from the better NVIDIA K80 GPU and, seen from the G2 experiments, I don't think it's going to matter much whether I'm going to run this particular piece of code on a bigger P2. 

# Conclusion
It isn't easy to beat the power of a relatively recent i7 when it comes to machine learning processing power. You need a recent Nvidia GPU and code that allows you to make use of vastly parallellized GPU cores to make a real dent in what the i7 has to offer in compute power. The upside is that Amazon images are really easy to come by, and that they are available in a matter of minutes (for new machines), if not seconds (to spin up a stopped instance).
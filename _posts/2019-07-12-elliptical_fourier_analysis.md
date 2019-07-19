---
title: Elliptical Fourier analysis
layout: post
---

Recently, I've become quite interested in Fourier series for the purposes of geospatial shape analysis. In particular, I've spent quite some time getting to grips with an elliptical variant of the well-known Fourier transform family, a variant based on calculating the coefficients of ellipses. Using a predefined number of ellipses, any closed contour can be described using the parameters of these ellipses. Once created, the parameters can be used to reconstruct an approximation of the original shape.

I created a web demo to demonstrate its workings. The demo is primarily based on [leaflet](https://leafletjs.com/) for the geospatial part, and [tensorflow.js](https://www.tensorflow.org/js) for the coefficient operations. That these libraries exist in free, open source form is truly marvellous. The demo is best viewed on a desktop environment.

<iframe src="https://spinlab.github.io/neighborhoods-autoencoder/js/dist/index.html" style="height: 700px; width: 100%"></iframe>

# How did we get here?
Fourier transformation is the deconstruction of a signal into its main constituent frequencies. Or in other words: mapping from (often) a time or space domain to a frequency domain, as in the following animation:

<a title="Lucas V. Barbosa [Public domain], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Fourier_transform_time_and_frequency_domains.gif"><img width="512" alt="Fourier transform time and frequency domains" src="https://upload.wikimedia.org/wikipedia/commons/5/50/Fourier_transform_time_and_frequency_domains.gif"></a>

*Animation of signal decomposition into main frequencies*

Let's start in the early 19th century, with [Jean-Baptiste Joseph Fourier](https://en.wikipedia.org/wiki/Joseph_Fourier) (1768-1830), the man who gave his name to the Fourier transform. Fourier contributed in his 1820's work [*Théorie analytique de la chaleur*](https://books.google.nl/books?id=TDQJAAAAIAAJ&dq=Th%C3%A9orie%20analytique%20de%20la%20chaleur&hl=nl&pg=PR3#v=onepage&q=Th%C3%A9orie%20analytique%20de%20la%20chaleur&f=false) the notion that any mapping function of a variable could be expressed as a [**Fourier series**](https://en.wikipedia.org/wiki/Fourier_series) (this might be an infinite ): a series of waves of multiples ([harmonics](https://en.wikipedia.org/wiki/Harmonic)) of the variable itself. 

<a title="Moodswingerscale.jpg: Y Landman
derivative work: W axell [Public domain], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Moodswingerscale.svg"><img width="512" alt="Moodswingerscale" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Moodswingerscale.svg/512px-Moodswingerscale.svg.png"></a>

*Seven harmonics of a signal*

## Fourier series definition
This series was defined as *N* pairs of coefficients (*a* and *b*) for each 'harmonic order' *n*, using the trigonomical formulation:

$$
\begin{aligned} a_{n} &=\frac{2}{P} \int_{P} f(x) \cdot \cos \left(2 \pi x \frac{n}{P}\right) d x \\ b_{n} &=\frac{2}{P} \int_{P} s(x) \cdot \sin \left(2 \pi x \frac{n}{P}\right) d x \end{aligned} \tag{1}
$$

Where:
 - the harmonic order *n* is the number of sine/cosine pair integrals to fit to the signal; 
 - $$f(x)$$ is some known function producing the signal, mapped to the y-axis. In practice we map this to the y-axis. 
 - The variable *P* represents the interval (or *P* for period) of the signal - the length of the signal we have sampled. 
 
 There are a few other interesting things here to note:
 1. Each harmonic order *n* adds one more level of detail to the analysis.
 2. Each harmonic order *n* represents *n* passes over the period *P*
 3. The Fourier series decomposition isn't simply looking for all the frequencies in the signal: in practice it's looking for frequencies that fit a combination of multiples of period *P*. That means that, for some signals, you have to fit a very large number of harmonics to the signal to get good signal characteristics.
 
### Complex-valued formula
There is another, more common method for expressing the Fourier transform, using complex number notation. According to the definition from [Wolfram Alpha](https://www.wolframalpha.com/input/?i=Fourier+transform&assumption=%7B%22F%22,+%22FourierTransformCalculator%22,+%22transformfunction%22%7D+-%3E%22e%5E(-t%5E2)+sin(t)%22&assumption=%7B%22F%22,+%22FourierTransformCalculator%22,+%22variable1%22%7D+-%3E%22t%22&assumption=%7B%22F%22,+%22FourierTransformCalculator%22,+%22variable2%22%7D+-%3E%22w%22&assumption=%7B%22C%22,+%22Fourier+transform%22%7D+-%3E+%7B%22MathWorld%22%7D), the Fourier transform is a generalized form of *complex* Fourier series. Euler's formula states that:

$$
e^{i x}=\cos x+i \sin x, \tag{2}
$$

expressing the relationship between trigonometry and complex numbers. Thus, the sum of sine and cosine values can be expressed as a complex number with real part $$x$$ and an imaginary part $$i$$. Note the similarity of the cosine and sine parts of the formula with Fourier's trigonometrical approach. This means that the Fourier transform for **frequency** $$k$$ can be expressed in the parts of a complex number:

$$
F(k)=\int_{-\infty}^{\infty} f(x) e^{-2 \pi i k x} d x \tag{3}
$$

[source: Wolfram Alpha](https://www.wolframalpha.com/input/?i=Fourier+transform&assumption=%7B%22F%22,+%22FourierTransformCalculator%22,+%22transformfunction%22%7D+-%3E%22e%5E(-t%5E2)+sin(t)%22&assumption=%7B%22F%22,+%22FourierTransformCalculator%22,+%22variable1%22%7D+-%3E%22t%22&assumption=%7B%22F%22,+%22FourierTransformCalculator%22,+%22variable2%22%7D+-%3E%22w%22&assumption=%7B%22C%22,+%22Fourier+transform%22%7D+-%3E+%7B%22MathWorld%22%7D)

which is also commonly written as 

$$
\mathcal{F}(\omega)=\frac{1}{\sqrt{2 \pi}} \int_{-\infty}^{\infty} f(t) e^{-i \omega t} \mathrm{d} t \tag{4}
$$

which is substituting x-axis value $$x$$ with time variable $$t$$, substituting  and factoring out the $$\frac{1}{\sqrt{2 \pi}}$$. Also, whe have the angular frequency $$\omega$$ as [$$\omega=\frac{2 \pi}{T}=2 \pi f$$](https://en.wikipedia.org/wiki/Angular_frequency).

## Reconstruction from coefficients
The brilliant thing is that this decomposed signal allows inverse transormation as well, to a reconstruction of the signal itself:

$$
s_{N}(x)=\frac{a_{0}}{2}+\sum_{n=1}^{N}\left(a_{n} \cos \left(\frac{2 \pi n x}{P}\right)+b_{n} \sin \left(\frac{2 \pi n x}{P}\right)\right), \tag{5}
$$

using the trigonometrical notation. Which boils down to that the reconstruction is the sum of all the harmonic orders reprojected from circular parameters back into cartesian space.

# Discrete Time Fourier Transforms
Fitting Fourier series to perfect mathematical functions is all fine, but in practice we need to fit this series to data that is sampled from an unknown signal function. Remember, from the previous section, that for the standard Fourier series computation, we need access to the full continuous signal mapping function $$f(x)$$. However, in many practical cases, we do not have access to the original function - it is usually a sampled signal produced in nature or through some unknown mechanism that we happen to sample. 

This is where the [Discrete Time Fourier transform](https://en.wikipedia.org/wiki/Discrete-time_Fourier_transform) comes in:

$$
X_{2 \pi}(\omega)=\sum_{n=-\infty}^{\infty} x[n] e^{-i \omega n} \tag{6}
$$

for frequency variable $$\omega$$ as the radians per sample, for each integer *n*. The advantage here is that we do not need a full integrand of the mapping function *f* and the other terms, but we can sum over the individual values of *x* over *n* harmonics. 

### Discrete Fourier Transform 
The Discrete Time Fourier Transform is similar the Discrete Fourier Transform (DFT). The DFT "converts a finite sequence of equally-spaced samples of a function into a same-length sequence of equally-spaced samples of the discrete-time Fourier transform" ([wikipedia](https://en.wikipedia.org/wiki/Discrete_Fourier_transform)):

$$
\begin{aligned} X_{k} &=\sum_{n=0}^{N-1} x_{n} \cdot e^{-\frac{i 2 \pi}{N} k n} \\ &=\sum_{n=0}^{N-1} x_{n} \cdot[\cos (2 \pi k n / N)-i \cdot \sin (2 \pi k n / N)] \end{aligned} \tag{7}
$$

This produces the  *k*-th pair for *N* complex numbers, the values *n* are sampled at equal intervals. Here, we show both the complex-valued form (top) and trigonomical form (bottom) from [wikipedia: Discrete Fourier Transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform) for clarity. So, the Discrete Time Fourier Transform is equal to the Discrete Fourier transform only if our samples are equally spaced.

# Fast Fourier Transform
There was however one problem with the standard Fourier transform method: it was computationally rather expensive. It scaled quadratically with the number of harmonics. So, we jump forward in time, to the point where extensive machine computation of Fourier series was becoming quite desirable. So suppose you would want to monitor some nation's nuclear detonation experiments using sensors outside of their geographical domain, you would have to deal with signals that are probably rife with background noise. There would be a lot of data, and in the 1960's computer hardware and computation was expensive. Ideally, you would like on-site, real-time processing and possibly other compound words that require dashes.

So, in 1965 just after the cold-war pinnacle [cuban missile crisis](https://en.wikipedia.org/wiki/Cuban_Missile_Crisis), [James Cooley](https://en.wikipedia.org/wiki/James_Cooley) and [John Tukey](https://en.wikipedia.org/wiki/John_Tukey) together published their [groundbreaking and much-improved variant on Fourier transformation](https://www.ams.org/journals/mcom/1965-19-090/S0025-5718-1965-0178586-1/S0025-5718-1965-0178586-1.pdf). They came up with a computationally more efficient means to arrive at the same coefficients as the standard Fourier transform: 

<div>
    <div style="float: left; width: 30%; height:">
        <a href="https://www.pinterest.com/pin/356347389250590948/">
            <img height="167px" src="https://i.pinimg.com/474x/8f/a7/67/8fa767578f1259018ad1351858299044--math-james-darcy.jpg">
        </a>
    </div>
    <div style="float: right; width: 70%; height: 167px">
        $$
        X_{k}=\sum_{n=0}^{N-1} x_{n} e^{-i 2 \pi k n / N} \tag{8}
        $$
    </div>
</div>

for which they only needed four and a half pages of perfectly legible article to explain their innovation. Their work was so profound that it has been called (one of ) the most important numerical formula(s) ([see top of wikipedia page](https://en.wikipedia.org/wiki/Fast_Fourier_transform)).

# From Fast to Elliptic
From Cooley and Tukey's work sprung a great many variants of Fourier decomposition algorithms. One of them, the [Discrete Cosine Transformation]() was used in the MP3, JPEG and MPEG standards, being used by millions upon millions of users. A big difference with the standard Fourier series analysis is that it uses only the cosine term ($$b_n$$) as seen in [eq. 1](#MathJax-Element-1-Frame).

From variants came other variants, amongst which the elliptical variant. The [Elliptic Fourier series](https://doi.org/10.1016/0146-664X(82)90034-X) was published in 1982 by Frank Kuhl and Charles Giardina. They extended the principle of time domain to a point series domain in two-dimensional space. So, rather than having N samples in time, you have a sequence of N points of a polygon in two spatial directions. The advantage here is that these N points are guaranteed to form a continuous, stable signal since together these points form a "closed contour", as Kuhl and Giardina put it. Now, things get a little complicated. The algorithms uses four coefficients, which makes sense because we have a signal in two dimensions, so there will be two coefficients for each of the two dimensions. So for the x-coordinates we have: 

$$
a_{n}=\frac{T}{2 n^{2} \pi^{2}} \sum_{\rho=1}^{K} \frac{\Delta x_{p}}{\Delta t_{p}}\left[\cos \frac{2 n \pi t_{p}}{T}-\cos \frac{2 n \pi t_{p-1}}{T}\right]
$$

$$
b_{n}=\frac{T}{2 n^{2} \pi^{2}} \sum_{p=1}^{K} \frac{\Delta x_{p}}{\Delta t_{\rho}}\left[\sin \frac{2 n \pi t_{p}}{T}-\sin \frac{2 n \pi t_{p-1}}{T}\right]

\tag{9}
$$

and for the y-axis we have

$$
c_{n}=\frac{T}{2 n^{2} \pi^{2}} \sum_{p=1}^{K} \frac{\Delta y_{p}}{\Delta t_{\rho}}\left[\cos \frac{2 n \pi t_{p}}{T}-\cos \frac{2 n \pi t_{p-1}}{T}\right]
$$

$$
d_{n}=\frac{T}{2 n^{2} \pi^{2}} \sum_{p=1}^{K} \frac{\Delta y_{p}}{\Delta t_{p}}\left[\sin \frac{2 n \pi t_{p}}{T}-\sin \frac{2 n \pi t_{p-1}}{T}\right]

\tag{10}
$$

This extracts the set of $${a, b, c, d}$$ coefficients ([Kuhl & Giardina 1982, 239-240](http://www.sci.utah.edu/~gerig/CS7960-S2010/handouts/Kuhl-Giardina-CGIP1982.pdf)) for a series of N ellipses from the x- and y-deltas ($$\Delta x_{p}$$ and $$\Delta y_{p}$$) between each consecutive point p in the K points in the polygon.

Then, we also need the center-point ([Kuhl & Giardina 1982, 240](http://www.sci.utah.edu/~gerig/CS7960-S2010/handouts/Kuhl-Giardina-CGIP1982.pdf)) for the main ellipse as $$A_0$$ and $$C_0$$:

$$
\begin{array}{l}{A_{0}=\frac{1}{T} \sum_{p=1}^{K} \frac{\Delta x_{p}}{2 \Delta t_{p}}\left(t_{p}^{2}-t_{p-1}^{2}\right)+\xi_{p}\left(t_{p}-t_{p-1}\right)} \\ {C_{0}=\frac{1}{T} \sum_{p=1}^{K} \frac{\Delta y_{p}}{2 \Delta t_{p}}\left(t_{p}^{2}-t_{p-1}^{2}\right)+\delta_{p}\left(t_{p}-t_{p-1}\right)}\end{array}

\tag{11}

$$

where

$$
\begin{array}{l}{\xi_{p}=\sum_{j=1}^{p-1} \Delta x_{j}-\frac{\Delta x_{p}}{\Delta t_{p}} \sum_{j=1}^{p-1} \Delta t_{j}} \\ {\delta_{p}=\sum_{j=1}^{p-1} \Delta y_{j}-\frac{\Delta y_{p}}{\Delta t_{p}} \sum_{j=1}^{p-1} \Delta t_{j}}\end{array}

\tag{12}

$$

and $$ \xi_{1}=\delta_{1}=0 $$

Like other Fourier series transforms, the method is invertible to create a reconstruction from the coefficients, as is shown in the demo at the top of the page.

The algorithm was implemented in Matlab at least as early as 1996 by [Trier, Jain and Taxt](https://doi.org/10.1016/0031-3203(95)00118-2), again in [2006](https://nl.mathworks.com/matlabcentral/fileexchange/12746-elliptical-fourier-shape-descriptors) and again in [2016](https://nl.mathworks.com/matlabcentral/fileexchange/32800-elliptic-fourier-for-shape-analysis) before it came to [Python](https://github.com/hbldh/pyefd) in 2016 as well. From there, it was re-implemented in [Wolfram](https://github.com/alihashmiii/Elliptical-Fourier-Descriptors) and I re-implemented it in [Python using the Pytorch framework](https://github.com/SPINLab/neighborhoods-autoencoder/blob/master/model/pytorch_efd.py), and in [Javascript using Tensorflow.js](https://github.com/SPINLab/neighborhoods-autoencoder/blob/master/js/src/efdCoefficients.js) in 2019. But I find it unlikely that there was no imlementation in either Fortran or C in the fourteen years between 1982 and 1996; it simply hasn't persisted on the web (yet).
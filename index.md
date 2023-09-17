---
layout: default
---

<img src="./images/IMG_0150_25_pct.JPG" height="200px"/>

## Rein van 't Veer, geospatial data scientist cloud engineer person
Geospatial data scientist, specialised in geodata/cloud engineering, Kubernetes or otherwise, geospatial machine 
learning, and Python and Rust application development. Self-employed/freelancer at 
[https://antfield.nl](Antfield Creations) in the Netherlands.

Making software is much more a creative process and rarely a straightforward translation of logic into machine-readable
format. This is why I'm not so concerned with developments in AI (yet) as a replacement of human developers. The
machines fortunately do not tell you (yet) in which direction to point your company or what to communicate with
stakeholders. It can _assist_, but cannot replace human motivation, which is fueled by emotion. This is the one thing
that the rise of the machines lack.

## Expertise

- Python developer 7yr+,
    - [Pypi.org published](https://pypi.org/project/deep-geometry), Geo and Machine Learning, read on https://arxiv.org/abs/1806.03857
    - QGIS plugin and test engineer: see [my blog](https://reinvantveer.github.io/2021/04/10/qgis-plugin-development.html)
- Open source geo engineer 15jr+
- Kubernetes cloud engineer, with 3 production cluster deployments (and many, many more development clusters),
  experience in bare metal, and hosted: Google Kubernetes, Amazon Kubernetes, Digital Ocean Kubernetes
- Kubernetes Argo workflow engineer 2jr+, with contributions to the [Argo Helm](https://github.com/argoproj/argo-helm) project
- "Test advocate" 6jr+
- Rust developer 3jr+, with contributions to
    - retro-embedded Rust voor de [Rust Sega Megadrive](https://github.com/ricky26/rust-mega-drive)
    - [Rust Kubernetes Operator prototype](https://github.com/Pscheidl/rust-kubernetes-operator-example/pull/6)

## Preferences
- Open source where possible
- Dedicated to knowledge transfer: I got here thanks to the help of others!
- Remote or hybride, freelance projects

## Projects
### "Side project": tutorial Kubernetes Operators with Argo ecosysteem
_28-2-2022_

Actually just out of curiosity, but also out of great interest for [Argo](https://argoproj.io) I looked into how you
_without the Operator SDK_ could still fill in
a [Kubernetes Operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) pattern with minimal effort.
Kubernetes Operators are generally extensions of the base Kubernetes API, but they can also go to standard resources
listen. The bottom line is that with [Argo Events](https://argoproj.github.io/argo-events/)
and [Argo Workflows](https://argoproj.github.io/argo-workflows/) can build a complete operator, which has the following
advantages:

* Simple functionality does not require a custom Docker image, which reduces maintenance burden
* The operator can be implemented in this way with a handful of Kubernetes manifests
* The workings of the operator are much more transparent because they are available for inspection in the Argo user
  interface, rather than in some logging dump.

[Read the full tutorial here](https://reinvantveer.github.io/2022/01/29/easier-operator.html)

### Posts

<ul class="post-list">
{% for post in site.posts %}
  <li>
    <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
    <h3>
      <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    </h3>
  </li>
{% endfor %}
</ul>

<p class="rss-subscribe">subscribe <a href="{{ "/feed.xml" | prepend: site.baseurl }}">via RSS</a></p>

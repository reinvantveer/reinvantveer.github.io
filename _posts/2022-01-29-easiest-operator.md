---
layout: post
title: The easiest road to operator development
published: false
---
<figure>
  <img src="/images/generated-k8s-operator-using-argo-events.png" alt="Kubernetes Operator using Argo Events. An AI impression."/>
  <figcaption>"Kubernetes Operator using Argo Events". An AI impression. Source: 
    <a href="https://vision-explorer.allenai.org/text_to_image_generation">Allen Institute for AI Computer Vision Explorer</a>
  </figcaption>
</figure>

## Kubernetes Operators

In the past few weeks or so, I followed up on an idea I had that had been lingering in my mind for a while. Something
that showed particular promise, but I hadn't found the time to dig into. I have been developing operators for a few
months and had the distinct feeling that things could be improved significantly. But more on that later, first we look
into operators for a short
moment. [Kubernetes Operators](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) are central to doing
anything in Kubernetes. Operators are controllers that make sure that a particular kind of Kubernetes "thing", be it an
application or something else, is the way that you intended it to be. In kubernetes speak: operators are responsible for
reconciliation of the state of a particular resource type. 

## Why Operators exist

<figure>
  <img src="/images/generated-extending-k8s-api.jpg">
  <figcaption>"Extending the Kubernetes API", an AI-generated impression. Source:
    <a href="https://vision-explorer.allenai.org/text_to_image_generation">DeepAI.org Text To Image API</a>
  </figcaption>
</figure>

In practice it means that an operator is responsible for the life cycle of a resource type of your own design. For
example a particular database type, say [PostgreSQL](https://www.postgresql.org/), or something completely different. Of
course there is are perfectly
fine [operators available for PostgreSQL](https://operatorhub.io/operator/postgres-operator), so you don't need to
design your own. The reason this operator exists, is because deploying a production-grade PostgreSQL database _cluster_
including a backup strategy is far from trivial. Operators like these help you set up complex infrastructure, taking
some of the cognitive load off your plate. There are operators that deploy applications, manage storage, or even
interface with something outside the Kubernetes cluster. Operators and controllers are vital in Kubernetes because 
_any resource_ in the Kubernetes cluster is reconciled using a controller.

Two articles of vital importance if you really want to sink your teeth in:
 - The ["Operator pattern" article](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
 - The ["CNCF Operator White Paper"](https://github.com/cncf/tag-app-delivery/blob/main/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md).
   CNCF stands for the ["Cloud Native Computing Foundation"](https://www.cncf.io/) and is the main organisation backing the design and development of Kubernetes.

Important to know is that:

- Operators listen to your self-designed "custom resource definitions", instances of which
  are ["custom resources"](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/), so
  you can extend the Kubernetes API itself.
- Operators act on create, update and delete events, so they are responsible for the entire life cycle of the resources
  they create from your custom resource.
- Operators should not do any heavy lifting, as they are expected to easily and stably scale. If any resource-heavy work
  is involved, this is to be left to other resource definitions, such as Jobs.
- Operators should be highly available: they're not supposed to drop the ball and should reliably catch each and every
  event that they should act on.

## Your own operator

So, why would you want to develop your own operator? Well, let's imagine that your organisation offers a particular
product, let's say some kind of communications service. Once your organisation chooses to use Kubernetes to deploy this
application, you can define your own resource type that describes the deployment of this application. You can define
security parameters, the way it is exposed to the outside world, the data storage it uses to persist information, the
amount of resources like memory and CPU it is allowed to take up, etcetera. 

<figure>
  <img src="/images/generated-curly-braces-all-over-the-place.png"/>
  <figcaption>"Curly braces all over the place". An AI-generated impression. Source:
    <a href="https://vision-explorer.allenai.org/text_to_image_generation">DeepAI.org Text To Image API</a>
  </figcaption>
</figure>

If your application is relatively simple, you may use [Helm](https://helm.sh/) so you don't need a custom resource to
describe your application to Kubernetes resources. If you can, you probably should. But if your self-defined application
definition requires more complicated logic, Helm is not such a good idea. Trying to put lots of "business logic" inside
Helm templates results in very hard to maintain Helm charts with curly braces all over the place. - Helm is without a
doubt a very useful tool and it will stay being a very useful tool even when you decide to write your own operator: you
can use Helm to deploy the operator! We'll see this in a moment.

## Operator development and operator frameworks

The framework we used was the exact opposite of _everything_ you would want from an operator framework. The framework
was complex, clunky, buggy, the framework enormous, the operator images we made were huge, the operator itself slow and
heavy on resources, and hard to maintain. Which framework we used doesn't matter here, this is not a framework bashing
post. All I will say is that _all_ of the options listed under the operator frameworks to use for operator development
are more complex than the one I'm about to show you. Furthermore, all of them suffer from visibility problems that we'll
discuss in some detail below. So, let's get to it!

## Argo Events as an operator framework

For about a year now, I had been using Argo Workflows to much satisfaction. We used it to ingest data from external and
internal sources, mostly targeting PostGIS databases to pipe the data to. It has been working very nicely, and we
created an operator and accompanying "custom resource definition" that allowed us to describe a dataset ingestion
operation, which worked very well for us.

Then, we started looking into Argo Events. It's a great system for letting other infrastructure components know that
some state changes occured, such as completing the ingestion of a data set. Argo Events has a fantastic set of events
that it can listen to, and if that isn't enough you can even define your own. Argo Events splits event handling into
consituent parts:

- an EventBus, which will keep event messages until handled,
- an EventSource, which will put a message on an event bus for a particular state change,
- a Sensor, which will listen on the event bus for particular messages and translate these into actions

This system alone is a very nice "multi-producer/multi-consumer" kind of message bus that you may compare with products
like RabbitMQ (with which I had favourable experience) and Kafka (with which I have no experience). The big difference
is that Argo Events is, like all Argo ecosystem products, tightly integrated with Kubernetes. This means that it is much
more "cloud native".

One thing that struck me is that EventSources can put a message on the bus on the appearance, change or disapperance
of _any_ resource kind in the cluster. Sounds familiar? It's exactly the same role as the main responsibility of
Operators: to listen to particular custom resources and act on them. So, what if you could use Argo Events to define
your Operator, using just that or maybe a few scripts to handle the "business logic" part of the custom resource
handling?

It took me a little while to work this out - like any framework on Kubernetes or even Kubernetes itself, it has its own
learning curve. But once I saw on how to combine Argo Events and Argo Workflows, it started to dawn on me: this is
better than _any_ current special-purpose operator framework and at the same time, it is useful for _a lot more_ as
well!


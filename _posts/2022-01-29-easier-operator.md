---
layout: post
title: The easier way to K8s Operator development using Argo Events
published: true
---
## On why you don't need special operator SDKs to develop K8s Operators

<figure>
  <img src="/images/generated-k8s-operator-using-argo-events.png" alt="Kubernetes Operator using Argo Events. An AI impression."/>
  <figcaption>"Kubernetes Operator using Argo Events". An AI impression. Source: 
    <a href="https://vision-explorer.allenai.org/text_to_image_generation">Allen Institute for AI Computer Vision Explorer</a>
  </figcaption>
</figure>

## Intro: Kubernetes Operators

In the past few weeks or so, I followed up on an idea I had that had been lingering in my mind for a while. Something
that showed particular promise, but I hadn't found the time to dig into, until now. I had been involved
in [Kubernetes Operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) development for a few months
and had the distinct feeling that things could be improved significantly. But before we go into detail, let's look at
operators for a moment. [Kubernetes Operators](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) are
central to doing anything in Kubernetes. Operators are controllers that make sure that a
particular [kinds of Kubernetes "things"](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/), 
be it an application or something else, end up the way that you specified it to be. In kubernetes speak: operators
are responsible for reconciliation of the desired state with the actual state for a particular 
[custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) type that 
extend the Kubenetes API. Kubernetes comes with its own controllers
for [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), 
[Ingresses](https://kubernetes.io/docs/concepts/services-networking/ingress/), 
[Pods](https://kubernetes.io/docs/concepts/workloads/pods/) and what have you - these you don't need to build
yourself. But once you want to extend the Kubernetes system with your own types, you get to Operators.

## Why Operators exist

<figure>
  <img src="/images/generated-extending-k8s-api.jpg" alt="Extending the Kubernetes API, an AI-generated impression">
  <figcaption>"Extending the Kubernetes API", an AI-generated impression. Source:
    <a href="https://vision-explorer.allenai.org/text_to_image_generation">DeepAI.org Text To Image API</a>
  </figcaption>
</figure>

In practice it means that an operator is responsible for the life cycle of a resource type of your own design. For
example a particular database type, say [PostgreSQL](https://www.postgresql.org/), or something else entirely. Of
course there already are perfectly
fine [operators available for PostgreSQL](https://operatorhub.io/operator/postgres-operator), so you don't need to
design your own. The reason this operator exists, is because deploying a production-grade PostgreSQL database _cluster_
including a backup strategy, is far from trivial. Operators like these help you declare the layout and settings of your
PostgreSQL cluster, set up complex infrastructure, taking most cognitive load off your plate. There are operators that
deploy applications, manage storage, or even interface with something outside the Kubernetes cluster.

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

So, why would you want to develop your own operator? Well, maybe your organisation offers a particular
product, let's say some kind of communications service. Once your organisation chooses to use Kubernetes to deploy this
application, you can define your own resource type that describes the deployment of this application. You can define
security parameters, the way it is exposed to the outside world, the data storage it uses to persist information, the
amount of resources like memory and CPU it is allowed to take up, etcetera. 

<figure>
  <img src="/images/generated-curly-braces-all-over-the-place.png" alt="Curly braces all over the place. An AI-generated impression."/>
  <figcaption>"Curly braces all over the place". An AI-generated impression. Source:
    <a href="https://vision-explorer.allenai.org/text_to_image_generation">DeepAI.org Text To Image API</a>
  </figcaption>
</figure>

If your application is relatively simple, you may use [Helm](https://helm.sh/) so you don't need a custom resource to
describe your application to Kubernetes resources. If you can, you probably should. But if your self-defined application
definition requires more complicated logic, Helm is not such a good idea. Trying to put lots of "business logic" inside
Helm templates results in very hard to maintain Helm charts with curly braces all over the place. Helm is without a
doubt a very useful tool, and it will stay being a very useful tool even when you decide to write your own operator: you
can use Helm to deploy the operator! We won't go into Helm in this tutorial, there are plenty of those around. Instead,
we're going to take a look at when you want to implement your own operator.

## Operator development and operator frameworks

The current state of operator development is complex to say the least. The framework we used was the exact opposite of 
_everything_ you would want from an operator framework. The framework was complex, clunky, buggy, enormous,
the operator images we made were huge, the operator itself slow and heavy on resources, and hard to maintain. Which
framework we used doesn't matter here, this is not a framework bashing post. All I will say is that _all_ of the options
listed under the operator frameworks to use for operator development are more complex than the one I'm about to show
you. Furthermore, all of them suffer from visibility problems that we'll discuss in some detail below. So, let's get to
it!

## Argo Events as an operator framework

For about a year now, I had been using [Argo Workflows](https://argoproj.github.io/argo-workflows/) to much
satisfaction. We used it to ingest data from external and internal sources, mostly targeting PostGIS databases to pipe
the data to. It has been working very nicely, and we created an operator and accompanying "custom resource definition"
that allowed us to describe a dataset ingestion operation, which worked very well for us.

Then, we started looking into [Argo Events](https://argoproj.github.io/argo-events/). It's a great system for letting
other infrastructure components know that some state changes occurred, such as completing the ingestion of a data set.
Argo Events has a fantastic set of sources that it can listen to, and if that isn't enough you can even define your own.
Argo Events splits event handling into nicely and cleanly separated parts with each its own responsibilities:

- an [EventBus](https://argoproj.github.io/argo-events/concepts/eventbus/), which will keep event messages until
  handled,
- an [EventSource](https://argoproj.github.io/argo-events/concepts/event_source/), which will put a message on an event
  bus for a particular state change,
- a [Sensor](https://argoproj.github.io/argo-events/concepts/sensor/), which will listen on the event bus for particular
  messages and translate these into actions

This system alone is a very nice message bus that you may compare with (but is quite distinct from) products
like [RabbitMQ](https://www.rabbitmq.com/) (with which I had favourable experience)
and [Kafka](https://kafka.apache.org/) (with which I have no experience). The big difference is that Argo Events is,
like all Argo ecosystem products, built to work with Kubernetes. This means that it is probably more "cloud native" than
other event handling systems.

One thing that struck me is that EventSources can put a message on the bus on the creation, change or deletion
of _any_ resource kind in the cluster. Sounds familiar? It's exactly the same role as the main responsibility of
Operators: to listen to particular custom resources and act on them. So, what if you could use Argo Events to define
your Operator, using just that or maybe a few scripts to handle the "business logic" part of the custom resource
handling?

It took me a little while to work this out - like any framework on Kubernetes or even Kubernetes itself, it has its own
learning curve. But once I saw on how to combine Argo Events and Argo Workflows, it started to dawn on me: this is
better than _any_ current special-purpose operator framework and at the same time, it is useful for _a lot more_ as
well!

## Let's dig in

So to see this experiment in action, we are going
to [replicate a tutorial from the Operator SDK](https://sdk.operatorframework.io/docs/building-operators/ansible/tutorial/)
and create an operator that handles [Memcached](https://www.memcached.org/) deployments. Since I have not used Memcached
for anything myself, I can offer little information on its purpose other than that you can use it to take load of your
web services by caching http requests, for example. The idea is that, if your http gateway has handled a particular http
request, Memcached can keep a copy of the response and serve it much faster because the web service or database the
response originated from does not have to go through the operation of assembling the response. This does leave you with
the classic hard question on when to invalidate the cache - one of the
purportedly ["two hard things in Computer Science"](https://www.martinfowler.com/bliki/TwoHardThings.html).

### 1. Install Argo Events

The simple solution:
follow [these steps](https://argoproj.github.io/argo-events/installation/#cluster-wide-installation). To keep things
very simple, we'll go with the cluster-wide installation for now. 

### 2. Install Argo Workflows, mainly for Argo Server

Follow [these steps](https://argoproj.github.io/argo-workflows/quick-start/). Why do we
need [Argo Workflows](https://argoproj.github.io/argo-workflows/)? Well, technically we don't but you really, really do
want this extraordinarily fine piece of software. Think of Workflows as much, much better versions
of [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/). 

The most important part here is that the installation comes
with [Argo Server](https://argoproj.github.io/argo-workflows/argo-server/), the UI that allows you to inspect both
EventSources, Sensors and, if you generate them from the Sensor triggers, Workflows. Personally, I'd skip the step to
install the `argo` command line tool, I found it to be of little use.

### 3. Install the Memcached custom resource definition

This is not intended to be a full Operator tutorial, so I'll try to keep things as simple as possible. 

```yaml
{% include memcached/crd.yaml %}
```

You can simply install this with 

```shell
kubectl apply -f https://raw.githubusercontent.com/reinvantveer/reinvantveer.github.io/master/_includes/memcached/crd.yaml
```

### 4. Create the service account and access rights
By default, the Kubernetes API doesn't allow access to our newly devised custom resource. By basically anything - we
need to tell the Kubernetes API that it's OK, provided a special service account is used to access it. Like the custom 
resource definition, this is basic Operator engineering 101. This will be our `memcached-sa` service account, that comes
with the associated rights:

{% include memcached/rbac.yaml %}

Install with:
```shell
kubectl apply -n argo-events -f https://raw.githubusercontent.com/reinvantveer/reinvantveer.github.io/master/_includes/memcached/rbac.yaml
```

### 4. Install the EventSource

The `EventSource` specifies what to listen to - in this case our custom "Memcached" resources. We specify that we listen
to all life cycle events. In event-speak, these are `ADD`, `UPDATE` and `DELETE`.

```yaml
{% include memcached/event-source.yaml %}
```

You can install this with 

```shell
kubectl apply -f https://raw.githubusercontent.com/reinvantveer/reinvantveer.github.io/master/_includes/memcached/event-source.yaml
```

### 5. Install the Sensor

The sensor specifies what to do with the event messages generated by our `EventSource`. In our case, we offload the work
to an Argo `Workflow` that calls a WorkflowTemplate (see below) with a few parameters from the event message:

```yaml
{% include memcached/sensor.yaml %}
```

You can install this with

```shell
kubectl apply -n argo-events -f https://raw.githubusercontent.com/reinvantveer/reinvantveer.github.io/master/_includes/memcached/sensor.yaml
```

### 6. Install the workflow template to deploy Memcached resources

Finally, we're deploying the Argo `WorkflowTemplate` that takes care of the deployment for us - the "heavy lifting" that
the Sensor delegated to the Workflow:

```yaml
{% include memcached/workflow-template.yaml %}
```

Install with

```shell
kubectl apply -n argo-events -f https://raw.githubusercontent.com/reinvantveer/reinvantveer.github.io/master/_includes/memcached/workflow-template.yaml
```

Voilà, the workflow template is present in the Argo UI:

![Memcached deployment workflow template in Argo UI](/images/workflow-template-in-argo-ui.png)

### 6. Let's go!

Now we can deploy our Memcached instance:

```yaml
{% include memcached/memcached.yaml %}
```

Or

```shell
kubectl apply -n argo-events -f https://raw.githubusercontent.com/reinvantveer/reinvantveer.github.io/master/_includes/memcached/memcached.yaml
```

And the workflow completes, deploying our application:

![Workflow deploying Memcached instance](/images/completed-memcached-deployment-workflow.png)

How can we tell it's running?

![Memcached running](/images/running-deployment-viewed-with-lens.png)

And we can watch as our operator cleans it up again:

```shell
kubectl delete -n argo-events -f https://raw.githubusercontent.com/reinvantveer/reinvantveer.github.io/master/_includes/memcached/memcached.yaml
```

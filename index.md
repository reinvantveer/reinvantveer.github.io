---
layout: default
---

<div class="home">
    <br/>
    <p><img src="./images/IMG_0150_25_pct.JPG" height="200px"/></p>
    <h2>Rein van 't Veer, geospatial data scientist and semantic web developer</h2>
    <p>Researcher , specialised in (linked) geo data engineering, and application development. Working for Geodan in the Netherlands, seconded to the National Cadastre and researcher at VU Amsterdam.</p>
    

  <h1 class="page-heading">Posts</h1>

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

</div>

---
layout: default
---

<div class="home">
    <h1>Rein van 't Veer</h1>
    <p><img src="./IMG_0150_25_pct.JPG" height="200px"/></p>
    <h2>Geospatial and semantic web engineer</h2>
    <p>Specialised in application and data development, mainly in the heritage sector. He is working both freelance and employed directly, mainly by heritage institutions or organisations directly or indirectly related to them.</p>
    

  <h1 class="page-heading">Posts</h1>

  <ul class="post-list">
    {% for post in site.posts %}
      <li>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>

        <h2>
          <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
        </h2>
      </li>
    {% endfor %}
  </ul>

  <p class="rss-subscribe">subscribe <a href="{{ "/feed.xml" | prepend: site.baseurl }}">via RSS</a></p>

</div>
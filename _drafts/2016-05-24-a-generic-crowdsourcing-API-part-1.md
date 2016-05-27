History of the document can be inspected [here](https://github.com/reinvantveer/reinvantveer.github.io/commits/master/_posts/2016-05-24-a-generic-crowdsourcing-API-part-1.md)

In crowdsourcing, provenance is everything. For new data to reliably flow back into the canonical source, we need to its origin, when, where and what was added, removed or replaced. Achieving this with an ordinary database can prove to be quite a hassle. You can consider the following database table:

| ID | name | occupation |
| --- | --- | --- |
| 1 | Joe | Beer brewer |
| 2 | Jenny | Distiller |

Each table row contains represents a single person. We can't simply duplicate the row to both reflect the changes in the data set and keep the original data:

| ID | name | occupation |
| --- | --- | --- |
| 1 | Joe | Beer brewer |
| 2 | Jenny | Distiller |
| 2 | Jenny | Tobacco planter |

This should trigger a violation a primary key constraint (the database wouldn't do proper data management if it wouldn't). We can't bump the ID to 3, because there will be two Jennies who are actually one person. 

There can be many intermediary stages to the strategy I'm about to propose, but for convenience, I'm going to skip them. Instead, I'm going to demonstrate a generic strategy that will allow retaining full history and provenance. We'll start by making an JSON object of the data:
 
 ```json
[
    { 
        "ID": 1,
        "name": "Joe",
        "occupation": "Beer brewer"
    },
    {
        "ID": 2,
        "name": "Jenny",
        "occupation": "Distiller"
    }
]
```

We'll consider this a collection of two documents, each one directly translated from the table. Now I'll show why document stores are gaining so much popularity over traditional database tables: they allow expanding the document to nested information that is not impossible, but very impractical to implement in tables.

Because, we can simply duplicate data in a nested key:

```json 
{
    "ID": 2,
    "name": "Jenny",
    "occupation": "Tobacco planter",
    "oldVersion": {
        "ID": 2,
        "name": "Jenny",
        "occupation": "Distiller"
    }
}
```

Or, we can keep the data of the original document and store the difference:
```json 
{
    "ID": 2,
    "name": "Jenny",
    "occupation": "Distiller",
    "changes": {
        "occupation": "Tobacco planter"
    }
}
```

So, by expanding the document with nested 'changes', we can record its history. But how can we differentiate between the document and its changes? What if the original document already has a 'changes' key? This is where linked data comes in. Linked data can make explicit what was implicit, by using web-dereferenceable, unique identifiers from established vocabularies. How we are to use this, is the subject for [part 2](http://reinvantveer.github.io/2016/05/27/a-generic-crowdsourcing-API-part-2)

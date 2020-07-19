---
title: SQL as programming language? Better not.
layout: post
---

# SQL as application programming language? Better not.

The past few months I have been given the opportunity to work with a prototype built in and around PostGreSQL. In this post, I intend to share some of the experiences with application programming in SQL and the accompanying procedural languages for use inside a database (such as pl/pgsql). In short: don't use SQL for application logic. 

## TL;DR:
It's perfectly fine to prototype your application in any kind of programming language, including SQL. SQL has some extremely concise expressivity that can make a data transformation pipeline very compact. However, be wise and 
* Provide every bit of information on **why** each SQL statement or clause is doing what it's doing
* **Drop the prototype as soon as you start thinking about going to production**. It will not be worth the effort to put a prototype into production. Don't ever be tempted into thinking it will perform, be stable or even work in the first place: it is unlikely to work out in your (financial) benefit.
* Use a **generic programming language**, such as Python, Java, JavaScript, C#, for your application logic and **don't** stick any of it in SQL. Use any programming language that lets you: 

    * Write code in a concise and *readable* way. Long SQL queries tend to become utterly incomprehensible for anyone except the writer of the code. 
    * Most importantly of all: testing. Testing application logic in SQL is hard and expensive because it **has no built-in testing framework**. Use a generic programming language instead for any application logic you need. 
    * proper dependency/package management to specify what your application logic needs to work in production.

## A very short introduction into the purpose of SQL
SQL is a language for interacting with a database. It is a set-based language that operates primarily on table-level. In this sense, the set that a SQL query operates on, is an entire set of records in one or more tables over which the SQL 'loops' automatically. Especially in querying different data tables, SQL is very good at integrating, filtering and summarizing data. It is then also very good at writing the results of this operation back into a new table. This is often referred to as an ETL process: an Extract (load data from tables), Transform (filter the data, summarize), and Load (write results into a new table). 

The database here acts as a strategy for "persistence": a way to store data that is not lost when a machine restarts. It is a popular method, because the way a database organizes lots of data is much more performant than the default persistence method, namely a file system. A file system generally is a tree-like system of folders that contain either subfolders and/or file. You may have a "Documents" folder, containing "Projects". This "Projects" folder may have a "Git" folder, to designate project documents that are tracked in a version control system called Git. This "Git" folder then may then contain the subfolder "web_app_for_incredible_solutions" or some other project, etcetera. The file system therefore often expresses a tree of "things" that go from generic to specific, but this tends to gets swamped if you have a lot of fine-grained data. 

Databases have a lot fewer levels than paths in your filesystem do. There is (such as for PostGreSQL databases) the Database level, the Schema level and then there are Tables which have Rows and Columns. This is the order of significance: you have a database for your department, with perhaps a schema for each customer (or you may have a database for each customer) or perhaps for each application or for a particular data set. Each schema will probably contain tables. Often, you name the table after a plural of the thing type it contains. A record in a Table often represents a real-world or imagined "thing": an invoice, a car, a car brand, a building, a customer, etcetera. Each field will express some kind of property or attribute of the object in the record. These are the basis building blocks of a database.

This is why simple SQL queries often make a lot of sense. `SELECT customer_name FROM customers;` will evidently get you all names of your customers from a set containing all customers for a given schema (the name of which is not included here). The SQL statement ends with a semicolon to designate the end of the SELECT statement.

## Where the trouble starts
There's trouble with SQL on many fronts that hamper production application development.

### Readability
This simplicity of `SELECT {attribute} FROM {thing_type};` has earned SQL its reputation as an easy to read language. This is more than just a nice idea. Programming is primarily of use as a method for communication: from humans to other humans, that is. It gets read by programmers after you write it, so people after you need to know what and why your program does what it does. This is no different for SQL.  

However, the readability of SQL quickly evaporates when the SQL query gets longer and more syntax is used. There is very little readable left in queries that 
* Use complicated and multiple join types such as [`FULL OUTER JOIN`](https://www.postgresqltutorial.com/postgresql-full-outer-join/), or [`CROSS JOIN`](https://www.postgresqltutorial.com/postgresql-cross-join/). Even after reading the tutorials, I don't know whether a `FULL JOIN` will return something different than a `FULL OUTER JOIN`. If it's optional and if it does return the same result set, then why is it even there? If the `CROSS JOIN` doesn't do anything than just the cartesian product of tables, then why does it exist? What exactly is "crossy" about a cross join?
* Mimic control flow, such as [`COALESCE`](https://www.postgresqltutorial.com/postgresql-coalesce/). To "coalesce" means to merge or grow into one another. But that is not what this function does: it takes the first non-null value from a list of values passed to the function. What is wrong about having called this function just `FIRST_NON_NULL()`?
* Use many, many nested functions. This is often the case, since you can't assign to an intermediate or temporary variable. You can use `WITH` clauses to work around this, but this will generally reward the reader with an endless stream of WITH blocks that only vaguely resemble a procedural flow.

Instead, use a programming language to write out the application logic in an easy to understand way. I find Python to be ideal for this purpose. Yes, it's possible to make an unreadable mess in any programming language, but Python enables you to write readable code unlike any other programming language does. It doesn't `COALESCE` or `CROSS JOIN` and so shouldn't you. Write readable code and douse with plenty of comments **why** you do it that particular way. Don't us endless nesting of functions that SQL pushes you towards, but break up meaningful pieces of procedural code into functions and execute them one after another. Use classes if they improve the readability of your code: SQL can't.

So, the supposed readability benefit for SQL is mostly voided once you get to more advanced SQL queries. It is a language with a lot of syntax, just as most other programming languages. Readability automatically brings us to perhaps the most difficult part of programming in general: complexity and testing.

### Complexity and testing
Once SQL queries start to get longer, an uncanny feeling starts to creep up on me. Why is there so much code needed to get some stuff from the database? Is the structure of the database that complex?

Often, however, I see that the SQL code is not only fetching things from the backend or writing data to it. Often, it applies some kind of transformation. It performs part of the application logic that the client code is supposed to do. I hear my colleagues explain: "It's much easier this way." 

Often, it's easier for the one writing the query because he/she designed it. There was no complicated testing procedure involved. There is a simple reason for this: SQL does not have a testing framework.

Let me be clear on this.

_SQL does not have a testing framework_

Now, let me explain why this is such a shocking statement to make. It means that SQL has no way of checking the outcome of a SQL statement in a basic validation strategy that comes with every single self-respecting programming language around. Even [COBOL has a unit testing framework](https://github.com/neopragma/cobol-unit-test), for crying out loud. What makes SQL script writers think they don't need it?

One of the most fundamental properties that separate production code from hacking, is tests. Without a testing framework, SQL encourages hacking around, rather than writing tested production code. Putting SQL application code into production without tests is simply nuts.

Imagine telling Java, or C#, or Python developers that all the testing frameworks they were used to working with, were removed and that they were no longer allowed to write tests in their beloved and preferred method. Imagine telling them that they would have to resort to _a different language_ to express their tests in. That they would have to build their application logic, and then inject the functions into that testing language to see whether or not it produced the right outcome. Really.

But this is the reality for SQL. It's not SQL in itself, of course, it shares this unfortunate trait with some other languages: there's
* bash ([Bourne again shell](https://en.wikipedia.org/wiki/Bash_(Unix_shell))) scripting: a [language without a testing framework](https://stackoverflow.com/questions/1339416/unit-testing-bash-scripts). 
* regex ([regular expression](https://en.wikipedia.org/wiki/Regular_expression)) doesn't come with a unit testing framework. This sounds quite obvious, but it also explains why I start frowning in the presence of any regular expression containing more than four characters. Much more than that, and they're only readable for those who wrote them. Also: if you use them, they need to be tested in any language other than regex that _does_ have a testing framework.

From the comments in the links it's clear that it's not impossible to test bash scripts, regular expressions and SQL. The point is, that considering that these languages do not have testing possibilities makes it much more likely that they don't. There may be testing frameworks for bash, but the chance that you will come across anyone ever having used the proposed frameworks is extremely unlikely. The same goes for SQL. How many people have you met that employ a testing framework for SQL scripts?

Instead, for SQL, bash and strictly speaking regex, you need something called "integration tests" to validate their correct workings. Regex is often built into the programming language used for testing, so you'll find few regular expressions 'out in the wild' without some kind of programming language to use them. But for bash and SQL, this is different. You need an external dependency to test them. This makes them integration tests: the tests need to integrate separate components or applications into a requirements or behavior test. For bash this isn't much of a dependency: you need a Linux system. For SQL, you need an entire database, running. Probably on a different machine than the one you're running your tests on. It's a systems integration test!

It gets worse for SQL. Many SQL scripts are _stateful_, containing action queries that alter the state of the database, and often requiring schemas and tables to pull data from. This makes these queries expensive to test: not only do you need to test to validate the requirements of the output, you also have to insert test data as well. Since the actions in the SQL script affect the state of the database, you need some kind of test database. If you don't have any such thing, it is improbable that you're going to test your queries. Once you're done testing, you need to remove the test assets from the test database as well to restore it back to a clean state. This means you're going to have to write functions to inject and restore database state, that you will probably have to test. Still feeling the desire to test queries, are you?
 
In short: test your queries in a test database. Testing `SELECT * FROM customers;` is hardly necessary. This is no longer the case once you start moving application logic inside of your queries, because now you *will* have to write tests for them. Make sure you do. Saying "last month my query was fine," is useless because last month doesn't matter if your application crashes now. Having test means making sure that under any circumstance and at any time, you are able to validate the correct workings of your code. Doing some manual testing now and again and calling "But it worked on my machine!" is a recipe for disaster. Therefore: put as little application or 'business' logic in your queries as possible, because testing for meeting all the requirements is costly for SQL. Instead, write you application logic in a proper programming language: it's much easier and therefore cheaper to write unit tests for 'generic' programming languages.   

### Dependency management
Every self-respecting programming language nowadays has a dependency management system. JavaScript has NPM, Java has Maven, C# has NuGet, and Python has Pipenv. No programming language is complete without some kind of package management system. **SQL has none**. You cannot express in a suite of SQL scripts, a SQL project if you like, what dependencies it should or shouldn't require. That means that the code is possibly going to break in unknown places  once (and at some time you will) upgrade your database.

The more usage of database extensions and procedural logic there is in your SQL, the higher the chance that your SQL will break. There are at least 3 current versions of PostGIS, the geospatial extension for PostGIS, with one major version difference, from major version 2 to 3. Multiply this by about 4 major PostGreSQL database versions and you have a combination of backend components for which your query may or may not work. There is a special [legacy FAQ](https://postgis.net/docs/manual-3.0/PostGIS_FAQ.html#legacy_faq) for the trouble that upgrading from major version 1 to 2 gave. There are many dependency pitfalls in PostGIS - consider the [SFCGAL functions](https://postgis.net/docs/manual-3.0/reference.html#reference_sfcgal) that require CGAL to be present at build-time. That means that if you upgrade your database but forget to install CGAL, part of your code is going to break.

Dependency management is of course a problem in any system, but the point is that programming languages tend to work with them very diligently. All major programming languages have options to specify what packages you want, versus the (sub)packages versions that your application *requires* to work. This requirement is often captured in a "lockfile" of some kind. For Python with Pipenv, this is `Pipfile.lock`. For JavaScript and NPM, this is `package-lock.json`. For Ruby and Gem, it's `Gemfile.lock`. For C# and NuGet, it's `project.lock.json`. The list goes on, but it's clear that the pseudo-programming languages such as SQL, bash and regex don't have these. They don't have package managers at all, and you can argue that bash and regex don't need them. This is clearly not the case for database extensions, so you're on your own, especially when using database extensions.

The upshot of this is that you have no guarantees on whether code in SQL will keep working in production if you start upgrading databases or other database dependencies such as PostGreSQL extensions. Again, if you simply `SELECT * FROM customers` this is highly unlikely to pose a problem. But the more business and application logic you put into your SQL, and the more extensions you use, the greater the risk is going to be. In a worst-case scenario, you won't be able to upgrade your database until you've rewritten every application you have in production.

Having said this, I have yet to encounter a SQL script that states in which version of what database with which extensions enabled it is supposed to work. Please move your application logic to a generic programming language ASAP.

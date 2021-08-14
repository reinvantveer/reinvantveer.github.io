---
title: A Quality Definition of Done for Python projects
layout: post
---

## Setting an internal standard for code quality for your Python software

I love Python because it's concise, readable and its speed is sufficient for most of the work I do. What I particularly
like about the language is the fact that it really encourages collaboration between team members. In Python, it's just a
little harder to make a mess of things than in some other programming languages. However, this does not come without 
issues.

This article is about how to manage code quality around team-maintainable Python software projects. It's based on quite
a bit of hard-won personal experience. My recommendations certainly are not meant as a pedantic dictate. However, I
intend to clear up any questions on why each recommendation for a quality DoD is of particular value.

### Development and Definitions of Done: why code quality matters
It's not uncommon for teams to have an unclear picture of what constitutes the definition of done for doing work, maybe
even more so for Python projects. Often team members are just starting out and quite possibly are even new to Python 
itself. Also, more often than not, Product Owners or other team leads often fail to see the importance of code quality
when they realize that more time is required on a product that already "just works". If the customer is satisfied, why
do anything anymore?

### Does this sound like a familiar scenario already? 
Many code repositories start to rot when they are hard to maintain. This isn't difficult to see: someone wrote
a bunch of Python code, but no-one really grasps what has been written and why. Often a complex intertwining of Python, 
SQL, some RegEx sprinkled on top, maybe some JavaScript, Bash or R thrown in, and suddenly:
- The "someone" who wrote all the code moves along to another position in the company, or leaves for another.
- The product that once "just worked" suddenly "just doesn't" after a few months and nobody seems to know how to fix it.

So what just happened? Probably the team didn't set a clear definition of done for this project to be maintained _by a
team_. This team-maintainability is a big thing. Only if the team understands the code base, then the code base can be
maintained by it. This sounds gratuitous, but often shared knowledge is really hard for teams to maintain. Probably
someone ("the SQL guy") got type-cast into a role that nobody really understood. Probably the team ran out of time at
some point at which the code wasn't reviewed. 

This is why having a solid agreement within the team of what constitutes good quality code is important. Even if human
or financial resources are constrained at some point, at least team members can agree on that _at some other point_ in
time, this technical debt has to be fixed.

So what follows here is what I consider a good set of quality standards to agree upon, and why they matter.

## A set of DoD quality standards

### Document your project and agree on what it means to document
This may be harder than it sounds, but you need to document your code in order for future maintainers of your code. This
isn't hard to grasp or accept for anyone I met in IT. I recently found out that there's some best practices for this,
but you probably need to write _different kinds_ of documentation. Write inline comments and docstrings. Document
[how your documentation is organized](https://www.youtube.com/watch?v=bQSR1UpUdFQ), write tutorials and topic guides. If
your project is itself a library, then compile reference guides from your docstrings using
[Sphinx](https://www.sphinx-doc.org/en/master/), and write how-to guides. Agree with your teammates on what should and
what shouldn't be included in the documentation, agree on some kind of documentation template that will make things
easier for everyone.

### Review each other's code in a source code management system

There really is no way around this one. If you want your team members to be in on what you write and why, have your code
reviewed by someone. Probably by someone with less experience. Why? Make sure they understand what you wrote and why,
even if it means admitting for that person that they don't understand everything and that that is quite OK. Share your
knowledge and allow others to grow. If you are uncertain on reviewing some issues, just ask another team member to pitch
in. It almost goes without saying that you should use some kind of source control management system
like Git, Fossil or perhaps even Mercurial in order to keep track of changes but there is generally no disagreement on
this. Almost everyone uses Git.

### Write automated tests for your code

If you write code for your team, help them out maintaining your code by writing tests. Tests are there to make sure that
the product meets the requirements. There's a pretty big chance that the _only_ place where the formal requirements for
your product are documented, is in your tests! Writing tests means that, once the code needs to be changed, these
requirements are still met. Have the requirements changed? Change the tests! There's simply no good excuse not to write
tests and I'm pretty sure I've heard all of them:

- "There's not enough time", which is probably favourite. Is there time a couple of months down the road to spend days
  on figuring out what the code does and why? Is there time a couple of years down the road to have to re-write 
  everything because the requirements are unknown? If there is no time to write tests, don't do the project.
- "We don't write tests here". You should have these people read the 
  [horrifying case of the THERAC-25](https://en.wikipedia.org/wiki/Therac-25) and ask them again if they still think it
  unnecessary to write tests. Writing tests is an _ethical obligation_ for software developers. It's simply 
  irresponsible not to do so.
- "I don't know how to write tests". Yes, this is a tricky one. Writing tests can be difficult, in fact often it's more
  difficult than writing the production code itself. Fortunately, there's plenty of useful resources out there, just 
  [do a web search](https://duckduckgo.com/?q=writing+tests+in+python) for them. If you need advice: I'd start with 
  [pytest](https://pytest.org/), it's probably the most sensible framework to use these days. But most importantly:
  collaborate with teammates on learning to write good tests. Practice, and you'll get better in it.

### Use a style checker

Style checkers can catch an incredibly large set of "code smells" or just stuff you forgot to put right. Unused imports,
unused variables, unreachable code, indentation errors, you name it. All these things can confuse your fellow team
members considerably ("why is this here???"), reduce the cognitive load and probably make your code run smoother as
well. Often, there's little time involved in type-checking your code. If you need advice: use
[flake8](https://flake8.pycqa.org/en/latest/) with this configuration in your `setup.cfg` (adapted from 
[here](https://flake8.pycqa.org/en/latest/user/configuration.html)):
```ini
[flake8]
# The .git folder only holds version control information
# Cached directories only hold compiled Python files that can't be checked
# Build and dist directories contain derived artifacts
exclude = .git, __pycache__, build, dist
max-complexity = 10
# Use modern IDE line length settings as default. We're not in teletype-age anymore
max-line-length = 121

```

### Type-check your Python code
In case you're not familiar with type hints in Python: start [here](https://realpython.com/lessons/type-hinting/). 
Dynamic typing is a big source of both runtime failures and confusion in Python code. Use
[mypy](https://mypy.readthedocs.io) or another type checker to make sure that you got your types right. Writing typed
python helps for no less than three quality aspects:

1. To make sure that you pass the right arguments to functions, and handle its return types appropriately
1. It clarifies to your teammates what a function or method expects. Is `users` a list? A dictionary? An object? Specify
   the type of it!
1. It will probably allow your code to run faster in the not-too-distant future. If the compiler has knowledge of what
   type your variable is, it can optimize for it.
   
Use mypy and add to your `setup.cfg`:
```ini
[mypy]
# Don't allow the `Any` type
disallow_any_expr = True
# Skip checking site packages for typing
no_site_packages = True
# Require type hints on all functions and methods
disallow_untyped_defs = True
```

### Use a dependency manager for your installed libraries

`Pip` as a package installer has worked great for a while, but there are a few ingredients missing in pip as a package
manager that allows you to create _reproducible builds_. For example: the default way of specifying which packages your
project requires used to be in a `requirements.txt` file. However, there were a few shortcomings in this strategy. It
was kinda hard to specify separate sources for your libraries (say, pypi.org or your private company-hosted python
libraries), you had to keep track of what you installed along the way, and splitting dev-dependencies such as type and
style checkers from production dependencies was a bit of a hassle. And then, you had to manage your virtual
environments. Nowadays, [pipenv](https://pipenv.pypa.io/en/latest/) can take care of all this stuff for you. I'd
recommend pipenv for this, but you could also go for [poetry](https://python-poetry.org/).

### Run your tests and checks in a continuous integration environment
When you have all the above parts in place, use some kind of continuous integration tool in order to make sure that all
is OK once you check your code into a repository. If you don't have anything in place, start with GitHub Workflows, it's
fantastic!

The advantages of having CI are many, but regarding team collaboration: it's the transparency that it offers. Your code
may run or check out on _your_ machine, but it may not on your teammate's. A "neutral ground" of CI allows you to view
the result your tests and checks on a clean working environment. If it exits in error, you have a hyperlink to point at
and ask your colleague if they can help resolving the issue. If your teammate is having trouble getting his checks to
pass but the CI pipeline doesn't, maybe it's time to clean some stuff out on their end. In the end, it should be your CI
pipeline that should give the final formal check on whether a revision of the product can get the go-ahead.  

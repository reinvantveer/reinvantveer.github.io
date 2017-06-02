---
layout: default
title: Stable hashes
---

# Stable python dictionary hashes

Things are progressing well on the research data loading task. I solved a number of issues pertaining to encoding problems (please do not ever use CSV as an archiving format). One thing in particular I solved was related to creating sha1 hashes of python dictionaries with python 3.5. It seems python creates unstable hashes from dictionaries, a problem that only seems to occur on Linux environments. I noticed this when I ran my unit test suite (that I develop on Windows) on my Linux research environment and the unit tests started to break irregularly.
 
 It turns out that, while the dictionary construction appears to be fed to the hash library in a fixed order on Windows, whereas on Linux this happens more or less at random on Linux. 
 
 The solution is dumping an ordered JSON document of the dictionary:
 ```python
 import hashlib
 import json
 d = hashlib.sha1(json.dumps(data, sort_keys=True).encode())
```

This produces stable sha1 hashes.

## See also
https://stackoverflow.com/questions/5884066/hashing-a-dictionary#5884123


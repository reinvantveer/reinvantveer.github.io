---
layout: default
title: Unicode, dammit!
---
Full history for the article [here](https://github.com/reinvantveer/reinvantveer.github.io/commits/master/_posts/2017-05-19-unicode-dammit.md).

# Unicode, dammit!

This week I (hopefully) finished the CSV parsing submodule. I had a lot of trouble correctly parsing the encoding (it's CSV after all, here be dragons) and had to combine some tricks, almost equal to sniffing out the delimiter and quote characters using a combination of the standard csv library and the pandas read_csv method.

I hope this will save someone some trouble one day. The problem is in the language of our country: Dutch, being in the Netherlands. We occasionally use accents and other frivolities in our language. The accents are mostly from French-derived words, but there's quit some words in Dutch that carry a [diaeresis](https://en.wikipedia.org/wiki/Diaeresis_%28diacritic%29). For example: the Dutch word 'ruïne' (for the English noun 'ruin') needs a diacritic to separate the 'u' from the 'i'. As in English, these two letters are pronounced as two sounds to create two syllables, or rather three in Dutch as it is followed by another 'e':
- English: 'ru-in'
- Dutch: 'ru-ï-ne'

The Dutch need the diacritic to prevent the 'u' and 'i' melting together into a single sound. The Dutch 'ui' (onion) is pronounced very similar to the Scottish pronunciation of 'ou'. Try it. Not too loudly.

There's a lot of 'ë's as well. Unfortunately, the Python [chardet](https://pypi.python.org/pypi/chardet) package sniffs text files with 'ë's out as [iso-8859-9: latin5 or 'Turkish'](https://docs.python.org/3/library/codecs.html#standard-encodings). There may be 'ë's in Turkish, but it's not the only language out there. 

So, to fix:
```python
import chardet
from bs4 import UnicodeDammit

with open(file_path, 'rb') as detect_file_encoding:
    detection = chardet.detect(detect_file_encoding.read())
print('Chardet:', detection)

if detection['encoding'] == 'ascii':
    with open(file_path, encoding='ascii') as file:
        data = file.read()
elif detection['encoding'] == 'ISO-8859-9':
    # Some files with "ë" in them are parsed erroneously as iso-8859-9 or latin-5 or Turkish
    with open(file_path, encoding='utf-8') as file:
        data = file.read()
else:
    try:
        with open(file_path, encoding=detection['encoding']) as non_unicode_file:
            data = non_unicode_file.read()
    except Exception as e:
        raise ValueError('Can\'t return dictionary from empty or invalid csv file %s due to %s' % (file_path, e))

if not data:
    raise ValueError('Can\'t return dictionary from empty or invalid csv file %s' % file_path)

dammit = UnicodeDammit(data)

```

The last statement uses a module from BeautifulSoup with the gorgeous name 'UnicodeDammit' to do the end parsing of the data in case some other encoding weirdness ensues. Can't test for everything, I'm going to put it to the test soon...
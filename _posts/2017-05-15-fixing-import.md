---
layout: default
title: Bugfixes
---

# Starting import fixes

I'm reaching an important stage today: bugfixing the importer. I'm hopefully doin two today. I'm having trouble fixing a pandas pd.read_csv error:
```
'utf-8' codec can't decode byte 0xeb in position 13: invalid continuation byte
```

This is confirmed by the last remark on http://stackoverflow.com/questions/5552555/unicodedecodeerror-invalid-continuation-byte

Turns out if I read the data as UTF-8, it throws the error on the invalid continuation byte, but it reads my from my test file the character 'ë' correctly, but it fails to read some file or other from my source data. When I change the pandas readout to:
```python
frame = pd.read_csv(
    filepath,
    quotechar=dialect.quotechar,
    delimiter=dialect.delimiter,
    encoding='latin_1',
    # Or: encoding='cp1252'
    parse_dates=True,
)
```

It will no longer fail, but it will mangle the character 'ë' to '\u00c3\u00ab' in the dictionary. I guess wrong input is better than no input, but it is a bit of a letdown...

# Numpy.float64
Then there's an interesting other case. I'll have to look into that another time.
```
Percent: [----------] 0.10073457747077716% 2017-05-12 17:16:50,252 - ERROR - Can't return dictionary from empty or invalid csv file /data/EDNA-LD_EXT/easy_rest/downloads/28396/3413458_4130248_REF_AWVS.csv
Percent: [----------] 0.1013886981037043% Traceback (most recent call last):
  File "main.py", line 137, in <module>
    run(file_path)
  File "main.py", line 99, in run
    schema_data = SchemaGenerator.generate_schema(data)
  File "/home/rein/Documents/git/edna-ld/etl/lib/SchemaGenerator.py", line 9, in generate_schema
    schema.add_object(data)
  File "/usr/local/lib/python3.4/dist-packages/genson/generator.py", line 93, in add_object
    self._generate_array(obj)
  File "/usr/local/lib/python3.4/dist-packages/genson/generator.py", line 241, in _generate_array
    self._add_items(array, 'add_object')
  File "/usr/local/lib/python3.4/dist-packages/genson/generator.py", line 210, in _add_items
    self._add_items_merge(items, func)
  File "/usr/local/lib/python3.4/dist-packages/genson/generator.py", line 220, in _add_items_merge
    method(item)
  File "/usr/local/lib/python3.4/dist-packages/genson/generator.py", line 91, in add_object
    self._generate_object(obj)
  File "/usr/local/lib/python3.4/dist-packages/genson/generator.py", line 237, in _generate_object
    self._add_properties(obj, 'add_object')
  File "/usr/local/lib/python3.4/dist-packages/genson/generator.py", line 204, in _add_properties
    getattr(self._properties[prop], func)(val)
  File "/usr/local/lib/python3.4/dist-packages/genson/generator.py", line 95, in add_object
    self._generate_basic(obj)
  File "/usr/local/lib/python3.4/dist-packages/genson/generator.py", line 244, in _generate_basic
    val_type = JS_TYPES[type(val)]
KeyError: <class 'numpy.float64'>
```

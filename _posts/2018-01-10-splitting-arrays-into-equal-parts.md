# Splitting Python arrays into equal parts
Yesterday I worked on prepping my buildings dataset. It was a bit of a hassle to find out how to concatenate several nested arrays coming from different csv files, and then split them into a 1:10 train/test data set split, and then split the training files into numpy zip archives that can be committed to the repository. GitHub has a limit of 50 Mb of data, for which I propose a devious but simple method below.

But: I found a very elegant (if I may say so myself) solution. The train/test split is done by just slicing off the test fraction from the total distribution, but the remaining training file splitting is done differently. It takes strided slices from the non-test bulk, offset by cycling over the range of the number of files:
```python
# Create nicely even-sized chunks
import numpy as np

for offset in range(NUMBER_OF_FILES):
    stride = NUMBER_OF_FILES  # just an alias
    part_geoms = training_data['geoms'][offset::stride]
    part_fourier_descriptors = training_data['fourier_descriptors'][offset::stride]
    part_building_type = training_data['building_type'][offset::stride]
    
    np.savez_compressed(
        TRAIN_DATA_FILE + str(offset),
        geoms=part_geoms,
        fourier_descriptors=part_fourier_descriptors,
        building_type=part_building_type,
    )
```
This works because of the very nice python [extended slice syntax](https://docs.python.org/3/whatsnew/2.3.html#extended-slices), allowing `start:end:step` for which the even-sized array splitting is a nice use case. By using the range of the number of files as offset in a cycle, the script walks through the combined arrays, picking every n-th element. It not only splits the files, it also creates nice evenly-sized chunks! Also, it works with very few lines of code and includes all members of the source array.

To load and re-combine the data again in your training script, do:
```python
import os
import numpy as np

train_fourier_descriptors = np.array([])
train_building_type = np.array([])

training_files = []
for file in os.listdir(DATA_FOLDER):  # some data folder
    if file.startswith(FILENAME_PREFIX) and file.endswith('.npz'): # some kind of name prefix
        training_files.append(file)


for index, file in enumerate(training_files):  # load and concatenate the training files
    train_loaded = np.load(DATA_FOLDER + file)

    if index == 0:
        train_fourier_descriptors = train_loaded['fourier_descriptors']
        train_building_type = train_loaded['building_type']
    else:
        train_fourier_descriptors = \
            np.append(train_fourier_descriptors, train_loaded['fourier_descriptors'], axis=0)
        train_building_type = \
            np.append(train_building_type, train_loaded['building_type'], axis=0)

```

There may be a more elegant way of appending with numpy to an empty array, but I don't have any suggestions other that the branching method above. If you do, please comment below and show everyone how it's done!
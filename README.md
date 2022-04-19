# dyikwong.github.io

# Organizations

The organizations map takes .CSV data and uses that to create a map of stations throughout time. 

## Reading in the Data

Reading in the data follows this list of steps:
1. Using `XMLHttpRequest`s in the `init()` function, parse the list of contents of the Data folder from the GitHub repository and find the names of the files containing data.
2. Push all file names into an array for later use.
3. Sort all file names alphabetically, ignoring capital letters to ensure that the names are in the correct order.
4. Once all have been sorted, call the `readData()` function.
5. Iterate through the list of files and use `XMLHttpRequests` to retrieve their contents. 
6. Using the `responseText`, call the `csvToArray()` function to parse the data, separating the color of the markers from the actual data, and store all information into an array for that singular file.

### csvToArray()

This function first takes and stores the color of the markers, as listed at the beginning of the file. The `symbol_color` header and the color are then both removed from the text. An object is then created using each of the data headers, and the information is stored accordingly. If there is an entry in the data that contains commas, that entry should have quotation marks around it to distinguish it from the other comma-separated data. The function finds the quotation marks and reads in the information from the beginning of the quotation if this is the case. All newline and carriage return characters are skipped. A new object is created for each row and stored in an array. The color listed at the top of the file is a parameter of each station. 

## Displaying the Data - readData()
Iterating through the stations for a singular file, track the filename and color of that file. 

#### Dates
The dates of each station are stored separately:
1. `full_begin` and `full_end` directly reflect the dates given in the .CSV file, used in the popup information. However, in order to prevent there from being errors with the timeline because of incorrectly formatted dates, if the date is not formatted correctly, the actual date used in the timeline differs from the one in the popup.
2. `begin` and `end` are the dates used in the timeline itself. 

If the dates are not formatted such that the first character is not a `1` or a `2` to indicate the year being in 1000s or 2000s, then the date is set to unknown.

If the length of the date is equal to 4 characters, then the year was given in the data. In order for the timeline to work, these dates are given `01-01` to indicate the beginning of the year, as the specific month and day are unknown. 

If the length of the date is greater than 4 characters but less than 8, it is likely that the year and either the month or date were given. The first 4 characters (the year) are taken and `01-01` is added to it.

If the length of the date is equal to 8, then that must mean that the date is in `YYYYMMDD`, so dashes are added between the year, month, and date for the timeline to use.

### Creating hrefs
All url extensions are created from the filenames, with everything being put into lowercase, extra characters removed, and dashes to replace spaces.

The `Single Stations` file is a special case, wherein each station in that file is under the `Stations` page of the website and has its own page. Thus, the url is a combination of `../stations/` and the data from the summary column of the station.

For organizations, the name of the page is a combination of `../organizations/` and the name of the file. The `createURL()` function takes the name of the file, replaces spaces with `-` and removes extra characters, like `_` and `,`. The letters are also all converted to lowercase.

### geoJSON feature
For each station, a new feature is created with the data from the file. The type of geometry of the feature is a point with the latlon from the data. The `border` property is set to 0 if either the beginning or end of the station is unknown. Then, if there is no latlon, it is not added to the map.

Each station is added to an array, and once each station in that file has been read in, that array is added to another array to create a 2D array.

Once the last station of the last file has been read in, the `generateMap()` function is called.

### Unknown Dates
The unknown dates are set to the min and max of the dates. Thus, comparing the dates for the beginning and ending of the stations, the minimum (oldest) and maximum (newest) dates can be found.


## Creating the map - generateMap()
The map starting point is created and the different layers are added to the map. 

For each point, `getInterval()` is used to get the interval for each point and use that in the timeline. If the date is unknown, it is replaced with either the minimum or maximum date. This function is used when iterating through all points.

The `timelineSliderControl` formats the dates on the timeline as `YYYY-MM-DD`. 

A `FeatureCollection` is created for each list of features, and a `Layer Group` is created for each file. The `points` object contains the type and individual array. The `all` array contains the collection of `point` objects.

Iterating through each file's list of points, a timeline is created using the `getInterval`. The `pointToLayer` function takes the individual station, creates a point using `beautify marker` options according to the border and colors of that station.

If the begin or end date is unknown, it is replaced with a `?`.

If the data column is not empty, that data is added to the popup.

The singular timeline created from a single file is added to the layer group and timeline once all stations have been read in.

Layer control is added for the `base_maps` which currently contain the `streetmap`, `stamenterrain`, and `stamenwatercolor`. 

When layer groups are being added to the map and `overlay_maps` for the layercontrol, `"Single Stations"` are skipped so that the layer is disabled upon loading.

### Legend
The Legend on the map itself is created using the predetermined colors for Global, Country-wide, Regional, and Single Station scopes and added as a `div` to the HTML with id `legend`.

A separate legend is created underneath the map. The columns are divided into 3. The `firstCols` represents the number of files (aka entries) for the first column of the legend. 

For bigger numbers of files, the first and second columns will have the same number of entries in both columns, while the number in the third column changes.

## Error handling
There is a try-catch statement in the `readData()` function. If there is an error in the file, an error is logged in the console with the path and file name, and the file is skipped before any stations are read in.

Stations without a latlon are skipped, as there is no place for them to go on the map.


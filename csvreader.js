function csvToArray(str, delimiter = ",") {

    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    var color = "";
    const nameColor = str.split('\n')[0];
    str = str.substring(str.indexOf('\n')+1);
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    if (headers[headers.length-1] == "url\r") {
        headers[headers.length-1] = "url";
    }
    
    color = nameColor.split('#')[1];
    fileName = nameColor.split('#')[0];
    var stationName = "";

    for (i = 0; i < fileName.length-1; i++) {
        if (fileName[i] != "\"")
            stationName += (fileName[i]);
    }

    console.log(stationName);
    if (stationName[stationName.length-1] == ",") {
        stationName = stationName.slice(0, -1)
    }

    console.log(stationName);
    for (i = 0; i < stationName.length; i++) {
        if (stationName[i] == "_" || stationName[i] == "-") 
            stationName[i] = " ";
    }
    console.log(stationName);

    var hex = "#" + color;

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    var arr = [];
    var components = "";
    var longer = false;
    var header_index = 0;
    var station = {};
    for (i = 0; i < rows.length; i++) {
        for (j = 0; j < rows[i].length; j++) {
            if (longer == true && rows[i][j] == "\"") {
                station[headers[header_index]] = components;
                header_index++;
                longer = false;
                components = "";
                j++;
            }
            else if (longer == false && rows[i][j] == "\"") {
                components += rows[i][j+1];
                longer = true;
                j++;
            } else if (longer == true && rows[i][j] == ",") {
                components += rows[i][j];
            } else if (longer == false && rows[i][j] == ",") {
                station[headers[header_index]] = components;
                header_index++;
                components = "";
            } else {
                components += rows[i][j];
            }
        }
        station[headers[header_index]] = components;
        station["filename"] = stationName;
        station["color"] = hex;
        arr[i] = station;
        components = "";
        station = {};
        header_index = 0;
    }
    // return the array
    return arr;
  }
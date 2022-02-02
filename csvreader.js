function csvToArray(str, delimiter = ",") {

    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    if (headers[headers.length-1] == "url\r") {
        headers[headers.length-1] = "url";
    }

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
        arr[i] = station;
        components = "";
        station = {};
        header_index = 0;
    }
    // return the array
    return arr;
  }
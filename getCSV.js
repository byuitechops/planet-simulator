/*jslint plusplus: true, browser: true, devel: true */
/*global $, d3*/

window.getCSV = (function () {
    "use strict";

    function getFileNameFromURL() {
        //This assumes that there will only be one parameter and it doesn't matter what it is
        var fileName = window.location.search
            .substr(1)
            .split("=")[1];
        return fileName;
    }

    function ajaxFile(fileName, ajaxCallback) {
        var extension = ".csv";

        if (fileName.length < 4 || fileName.substr(fileName.length - extension.length) !== extension) {
            fileName += extension;
        }

        $.ajax('./csvs/' + fileName, {
            dataType: 'text',
            success: function (fileText) {
                ajaxCallback(null, fileText);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var errorText = "Ajax Error " + textStatus + ':' + errorThrown;
                ajaxCallback(errorText, null);
            }

        });
    }

    function parseNewCSV(rawCSV) {

        function camelCase(string) {
            return string.toLowerCase().replace(/ \w/g, function (x) {
                return x.slice(-1).toUpperCase();
            }).replace(/ |s$/g, "");
        }

        function toNum(stringIn) {
            var tempNum = parseInt(stringIn, 10);
            if (isNaN(tempNum)) {
                return 0;
            }
            return tempNum;
        }

        var transcribed = [];

        var data = d3.csvParse(rawCSV, function (d) {
            var row = {};
            for (var col in d) {
                row[camelCase(col)] = d[col];
            }
            return row;
        });
        // for some reason they didn't already do this
        data.columns = data.columns.map(camelCase);

        // Our main loop
        data.forEach(function (row, index) {

            // assuming that the time secions start with a number
            var section = row.rowHeading.match(/^\d|initial/);
            var currentSection = transcribed.length - 1;

            // for the 'forcer'
            if (index === 0) {
                row.underwaterVolcano = row.volcano;
                transcribed.push(row);
                return;
            }

            // setup the skeleton if this is a new section
            if (section) {
                var timeZone = data.columns.reduce(function (timeZone, column, i) {
                    if (column === "other") {
                        return timeZone;
                    }

                    if (i === 0) {
                        timeZone[column] = section.input;
                    } else {
                        timeZone[column] = {
                            value: +row[column] || 0,
                            timing: 0,
                            text: ""
                        };
                    }
                    return timeZone;
                }, {});

                // underwaterVolcano is special because it needs to copy volcano
                timeZone.underwaterVolcano = timeZone.volcano;
                transcribed.push(timeZone);
            } else {
                //for the 'timing' and 'text' rows
                for (var element in row) {
                    var valOut = row[element];

                    if (element !== "rowHeading" && element !== "other") {
                        //timing has to be a number
                        if (row.rowHeading === "timing") {
                            valOut = toNum(row[element]);
                        }
                        transcribed[currentSection][element][row.rowHeading] = valOut;
                    }
                }
            }

        });

        return transcribed;
    }

    return function (callBack) {
        var fileName;

        fileName = getFileNameFromURL();

        if (!fileName) {
            callBack("No filename in URL.", null);
            return;
        }

        ajaxFile(fileName, function (error, fileText) {
            var fileDataRaw;

            if (error) {
                callBack(error, null);
                return;
            }

            fileDataRaw = parseNewCSV(fileText);

            callBack(null, fileDataRaw);
        });

    };
}());

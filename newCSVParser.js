function parseNewCSV(rawCSV) {

    function camelCase(string) {
        return string.toLowerCase().replace(/ \w/g, function (x) {
            return x.slice(-1).toUpperCase();
        }).replace(/ /g, "");
    }

    var timeFlag = false;
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
    data.forEach(function (row) {

        // assuming that the time secions start with a number
        var section = row.rowHeading.match(/^\d/);
        var currentSection = transcribed.length - 1;

        // setup the skeleton if this is a new section
        if (section) {
            timeFlag = true;
            var timeZone = data.columns.reduce(function (timeZone, column, i) {
                if (!i) {
                    timeZone[column] = section.input;
                } else {
                    timeZone[column] = { value: +row[column] || 0, timing: 0, text: "" };
                }
                return timeZone;
            }, {});

            // underwaterVolcano is special because it needs to copy volcano
            timeZone.underwaterVolcano = timeZone.volcano;
            transcribed.push(timeZone);
        }

        // for the 'timing' and 'text' rows
        if (timeFlag && !section) {
            for (var element in row) {
                if (element != "rowHeading") {
                    transcribed[currentSection][element][row.rowHeading] = row[element];
                }
            }
        }

        // for the 'forcer' and 'initial' rows
        if (!timeFlag) {
            row.underwaterVolcano = row.volcano;
            transcribed.push(row);
        }
    });

    return transcribed;
}

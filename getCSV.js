/*jslint plusplus: true, browser: true, devel: true */
/*global $, d3*/

var getCSV = (function () {
    "use strict";

    function getFileNameFromURL() {
        //This assumes that there will only be one parameter and it doesn't matter what it is
        var fileName = window.location.search
            .substr(1)
            .split("=")[1];
        return fileName;
    }

    function ajaxFile(fileName, ajaxCallback) {
        $.ajax(fileName + ".csv", {
            dataType: 'text',
            success: function (fileText) {
                ajaxCallback(null, fileText);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxCallback("Ajax Error", textStatus, ':', errorThrown, null);
                //console.log("Ajax Error", textStatus, ':', errorThrown);
            }

        });
    }

    return function (callBack) {
        var fileName;

        fileName = getFileNameFromURL();
        if (!fileName) {
            console.log("No filename in URL.");
            return;
        }
        ajaxFile(fileName, function (error, fileText) {
            if (error) {
                callBack(error, null);
                return;
            }

            var fileData = d3.csvParse(fileText, function (d) {
                return {
                    forcer: d.forcer,
                    time: d.time,
                    carbonateRock: parseInt(d.buriedCRelease, 10),
                    sediment: parseInt(d.cBurial, 10),
                    co2Meter: parseInt(d.co2, 10),
                    seaSnow: parseInt(d.co3Desposition, 10),
                    iceCaps: parseInt(d.ice, 10),
                    igWeathering: parseInt(d.igWeathering, 10),
                    lightRays: parseInt(d.insolation, 10),
                    mountains: parseInt(d.mountain, 10),
                    floods: parseInt(d.sea, 10),
                    tempMeter: parseInt(d.temperature, 10),
                    volcanoes: parseInt(d.volcano, 10),
                    underwaterVolcanoes: parseInt(d.volcano, 10)
                };
            });

            callBack(null, fileData);
        });

    };
}());

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

        function zeroOrNum(textIn) {
            var num = parseInt(textIn, 10);
            return isNaN(num) ? 0 : num;
        }

        fileName = getFileNameFromURL();

        if (!fileName) {
            console.log("No filename in URL.");
            return;
        }

        ajaxFile(fileName, function (error, fileText) {
            var fileDataRaw;

            if (error) {
                callBack(error, null);
                return;
            }

            fileDataRaw = d3.csvParse(fileText, function (d) {
                return {
                    rowHeading: d["Row Heading"],
                    other: d.Other,
                    sediment: zeroOrNum(d.Sediment),
                    co2Meter: zeroOrNum(d.CO2),
                    iceCaps: zeroOrNum(d.Ice),
                    lightRays: zeroOrNum(d.Insolation),
                    mountains: zeroOrNum(d.Mountains),
                    floods: zeroOrNum(d.Sea),
                    tempMeter: zeroOrNum(d.Temperature),
                    volcanoes: zeroOrNum(d.Volcano),
                    underwaterVolcanoes: zeroOrNum(d.Volcano),
                    seaSnow: zeroOrNum(d["CO3 Desposition"]),
                    weatheringRelease: zeroOrNum(d["Weathering C Release"]),
                    weatheringBurial: zeroOrNum(d["Weathering C Burial"])
                };
            });

            callBack(null, fileDataRaw);
        });

    };
}());

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

    return function (parsingFunc, callBack) {
        var fileName;

        function zeroOrNum(textIn) {
            var num = parseInt(textIn, 10);
            return isNaN(num) ? 0 : num;
        }

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

            fileDataRaw = d3.csvParse(fileText, parsingFunc);

            callBack(null, fileDataRaw);
        });

    };
}());

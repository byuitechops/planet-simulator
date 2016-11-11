/*jslint plusplus: true, browser: true, devel: true */
/*global boxen, animations, checkAnimationStatus*/
function getStopperPercent(el) {
    "use strict";
    var percent;
    percent = el.getAttributeNS(null, 'offset');
    percent = parseFloat(percent.slice(0, percent.indexOf('%')));
    return Math.round(percent * 1000) / 1000;
}

function percentToPixels(percent, size) {
    "use strict";
    return (percent / 100) * size;
}

function pixelsToPercent(pixels, size) {
    "use strict";
    return (pixels / size) * 100;
}

function resetSpotlightPosition() {
    "use strict";
    var spotlight = document.getElementById("spotter"),
        light_radius = document.getElementById("light_beamz"),
        stoppers = light_radius.getElementsByTagName("stop");
    spotlight.setAttributeNS(null, "cx", 865);
    spotlight.setAttributeNS(null, "cy", 469);
    stoppers[0].setAttributeNS(null, "offset", 22 + "%");
    stoppers[1].setAttributeNS(null, "offset", 25 + "%");
}

function moveToStart() {
    "use strict";
    var box = boxen[animations[0]],
        xOffset = (box.name === "sediment") ? -10 : 0,
        yOffset = (box.name === "sediment") ? 55 : 0,
        x = box.x + (box.width * box.scale) / 2 + xOffset,
        y = box.y + (box.height * box.scale) / 2 + yOffset,
        width = box.width * (box.scale + 0.2),
        height = box.height * (box.scale + 0.2),
        spotlight = document.getElementById("spotter"),
        light_radius = document.getElementById("light_beamz"),
        stoppers = (light_radius.getElementsByTagName("stop")),
        greatest = [width, height].sort().reverse()[0];

    greatest = pixelsToPercent(greatest, 2588) / 2;
    greatest = Math.round(greatest * 1000) / 1000;

    //    $("#spotter").animate({opacity:0},durration/2, function(){
    //        spotlight.setAttributeNS(null, "cx", x);
    //        spotlight.setAttributeNS(null, "cy", y);
    //        $("#spotter").animate({opacity:1},durration/2, callback);
    //    });

    x = Math.round(x);
    y = Math.round(y);

    spotlight.setAttributeNS(null, "cx", x);
    spotlight.setAttributeNS(null, "cy", y);
    stoppers[0].setAttributeNS(null, "offset", greatest + "%");
    stoppers[1].setAttributeNS(null, "offset", (greatest + 2) + "%");
}

/*
 * Centers Spotlight at Specific x & y coords and ajusts the width and height accordingly
 */
function moveSpotlight() {
    "use strict";
    var box = boxen[animations[0]],
        xOffset = (box.name === "sediment") ? -10 : 0,
        yOffset = (box.name === "sediment") ? 55 : 0,
        x = box.x + (box.width * box.scale) / 2 + xOffset,
        y = box.y + (box.height * box.scale) / 2 + yOffset,
        width = box.width * (box.scale + 0.2),
        height = box.height * (box.scale + 0.2),
        spotlight = document.getElementById("spotter"),
        light_radius = document.getElementById("light_beamz"),
        stoppers = (light_radius.getElementsByTagName("stop")),
        greatest = [width, height].sort().reverse()[0],
        interval,
        startPercent,
        startX,
        startY,
        percentIncrementor,
        xIncrementor,
        yIncrementor;

    greatest = pixelsToPercent(greatest, 2588) / 2;
    greatest = Math.round(greatest * 1000) / 1000;

    //    $("#spotter").animate({opacity:0},durration/2, function(){
    //        spotlight.setAttributeNS(null, "cx", x);
    //        spotlight.setAttributeNS(null, "cy", y);
    //        $("#spotter").animate({opacity:1},durration/2, callback);
    //    });

    x = Math.round(x);
    y = Math.round(y);

    startPercent = getStopperPercent(stoppers[0]);
    startX = parseInt(spotlight.getAttributeNS(null, "cx"), 10);
    startY = parseInt(spotlight.getAttributeNS(null, "cy"), 10);
    percentIncrementor = (startPercent < greatest) ? 0.2 : -0.2;
    xIncrementor = (startX < x) ? 10 : -10;
    yIncrementor = (startY < y) ? 10 : -10;

    //    $("#spotter").animate({cx: x, cy:y},durration/2, callback);

    function animateBeam() {
        var currentPercent = getStopperPercent(stoppers[0]),
            currentX = parseInt(spotlight.getAttributeNS(null, "cx"), 10),
            currentY = parseInt(spotlight.getAttributeNS(null, "cy"), 10);

        if (currentX === x && currentY === y && currentPercent === greatest) {
            //Stop interval
            clearInterval(interval);
            box.transition(checkAnimationStatus);
            return;
        }
        if (currentPercent !== greatest) {
            currentPercent += percentIncrementor;
            currentPercent = ((percentIncrementor < 0 && currentPercent < greatest) || (percentIncrementor > 0 && currentPercent > greatest)) ? greatest : currentPercent;
            stoppers[0].setAttributeNS(null, "offset", currentPercent + "%");
            stoppers[1].setAttributeNS(null, "offset", (currentPercent + 2.5) + "%");
        }
        if (currentX !== x) {
            currentX += xIncrementor;
            currentX = ((xIncrementor < 0 && currentX < x) || (xIncrementor > 0 && currentX > x)) ? x : currentX;
            spotlight.setAttributeNS(null, "cx", currentX);
        }
        if (currentY !== y) {
            currentY += yIncrementor;
            currentY = ((yIncrementor < 0 && currentY < y) || (yIncrementor > 0 && currentY > y)) ? y : currentY;
            spotlight.setAttributeNS(null, "cy", currentY);
        }
    }

    interval = setInterval(animateBeam, 10);

}

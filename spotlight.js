/*jslint plusplus: true, browser: true, devel: true */
/*global boxen, animations, checkAnimationStatus*/
var Spotlight = (function () {
    "use strict";

    var Spotlight = function (id, radius, stopers, secondary = false) {
            this.id = id || "spotter";
            this.radius = radius || "light_beamz";
            this.stoppers = "stop";
            
        var newSpot = document.createElementNS("http://www.w3.org/2000/svg", "g");
            newSpot.setAttributeNS(null, "id", this.id + "-group");
            var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            var gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
            gradient.setAttributeNS(null, "id", this.radius)
            gradient.setAttributeNS(null, "cx", "50%");
            gradient.setAttributeNS(null, "cy", "50%");
            var stopper1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stopper1.setAttributeNS(null, "offset", "22%");
            stopper1.setAttributeNS(null, "stop-color", "transparent");
            var stopper2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stopper2.setAttributeNS(null, "offset", "25%");
            stopper2.setAttributeNS(null, "stop-color", "rgba(0, 0, 0, 0.50)");
            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttributeNS(null, "id", this.id);
            circle.setAttributeNS(null, "fill", `url(#${this.radius})`);
            circle.setAttributeNS(null, "cx", "865");
            circle.setAttributeNS(null, "cy", "469");
            circle.setAttributeNS(null, "r", "2588");
            circle.setAttributeNS(null, "style", "opacity:0");
            circle.setAttributeNS(null, "clip-path", "url(#clip)");
            newSpot.appendChild(circle);
            gradient.appendChild(stopper1);
            gradient.appendChild(stopper2);
            defs.appendChild(gradient);
            var clip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
            clip.setAttributeNS(null, "id", "clip");
            var clipc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            clipc.setAttributeNS(null, "cx", 2588/4);
            clipc.setAttributeNS(null, "cy", 2588/4);
            clipc.setAttributeNS(null, "r", 200);
            clip.appendChild(clipc);
            defs.appendChild(clip);
            newSpot.appendChild(defs);
            document.getElementById("spots").appendChild(newSpot);
            console.log(newSpot);
            console.log(this);
        },
        spotlight = Spotlight.prototype;

    
    spotlight.adjustForLights = function(lights){
        document.getElementById(this.radius).getElementsByTagName("stop")[1].setAttributeNS(null,"stop-color",`rgba(0, 0, 0, ${.5/lights})`);
        console.log(document.getElementById(this.radius).getElementsByTagName("stop")[1].getAttributeNS(null,"stop-color"));
    }
    
    spotlight.turnOn = function (callback) {
        $("#"+this.id).animate({
            opacity: 1
        }, 1000, function () {
           if(callback) callback();
        });
    }
    spotlight.turnOff = function (callback) {
        $("#"+this.id).animate({
            opacity: 0
        }, 1000, function () {
            if(callback) callback();
        });
    }

    spotlight.getStopperPercent = function (el) {
        var percent;
        percent = el.getAttributeNS(null, 'offset');
        percent = parseFloat(percent.slice(0, percent.indexOf('%')));
        return Math.round(percent * 1000) / 1000;
    };

    spotlight.percentToPixels = function (percent, size) {
        return (percent / 100) * size;
    };

    spotlight.pixelsToPercent = function (pixels, size) {
        return (pixels / size) * 100;
    };

    spotlight.resetSpotlightPosition = function () {
        var spotlight = document.getElementById(this.id),
            light_radius = document.getElementById(this.radius),
            stoppers = light_radius.getElementsByTagName(this.stoppers);
        spotlight.setAttributeNS(null, "cx", 865);
        spotlight.setAttributeNS(null, "cy", 469);
        stoppers[0].setAttributeNS(null, "offset", 22 + "%");
        stoppers[1].setAttributeNS(null, "offset", 25 + "%");
    };

    spotlight.moveToStart = function (box) {

        //var box = boxen[animations[0]],
        
        var xOffset = (box.name === "sediment") ? -10 : 0,
            yOffset = (box.name === "sediment") ? 55 : 0,
            x = box.x + (box.width * box.scale.x) / 2 + xOffset,
            y = box.y + (box.height * box.scale.y) / 2 + yOffset,
            width = box.width * (box.scale.x + 0.2),
            height = box.height * (box.scale.y + 0.2),
            spotlight = document.getElementById(this.id),
            light_radius = document.getElementById(this.radius),
            stoppers = (light_radius.getElementsByTagName(this.stoppers)),
            greatest = [width, height].sort().reverse()[0];

        greatest = this.pixelsToPercent(greatest, 2588) / 2;
        greatest = Math.round(greatest * 1000) / 1000;
        x = Math.round(x);
        y = Math.round(y);
        console.log(x,y,width,height, this.id)
        spotlight.setAttributeNS(null, "cx", x);
        spotlight.setAttributeNS(null, "cy", y);
        stoppers[0].setAttributeNS(null, "offset", greatest + "%");
        stoppers[1].setAttributeNS(null, "offset", (greatest + 2) + "%");
    };
    /*
     * Centers Spotlight at Specific x & y coords and ajusts the width and height accordingly
     */
    spotlight.moveSpotlight = function (box, done) {
        //var box = boxen[animations[0]],
        var xOffset = (box.name === "sediment") ? -10 : 0,
            yOffset = (box.name === "sediment") ? 55 : 0,
            x = box.x + (box.width * box.scale.x) / 2 + xOffset,
            y = box.y + (box.height * box.scale.y) / 2 + yOffset,
            width = box.width * (box.scale.x + 0.2),
            height = box.height * (box.scale.y + 0.2),
            spotlight = document.getElementById(this.id),
            light_radius = document.getElementById(this.radius),
            stoppers = (light_radius.getElementsByTagName(this.stoppers)),
            greatest = [width, height].sort().reverse()[0],
            interval,
            startPercent,
            startX,
            startY,
            percentIncrementor,
            xIncrementor,
            yIncrementor,
            me = this;
        greatest = this.pixelsToPercent(greatest, 2588) / 2;
        greatest = Math.round(greatest * 1000) / 1000;
        x = Math.round(x);
        y = Math.round(y);
        startPercent = this.getStopperPercent(stoppers[0]);
        startX = parseInt(spotlight.getAttributeNS(null, "cx"), 10);
        startY = parseInt(spotlight.getAttributeNS(null, "cy"), 10);
        percentIncrementor = (startPercent < greatest) ? 0.2 : -0.2;
        xIncrementor = (startX < x) ? 10 : -10;
        yIncrementor = (startY < y) ? 10 : -10;
        //kept for future revision
        //    $("this.id).animate({cx: x, cy:y},durration/2, callback);
        function animateBeam() {
            var currentPercent = me.getStopperPercent(stoppers[0]),
                currentX = parseInt(spotlight.getAttributeNS(null, "cx"), 10),
                currentY = parseInt(spotlight.getAttributeNS(null, "cy"), 10);
            if (currentX === x && currentY === y && currentPercent === greatest) {
                //stops spotlight movement
                clearInterval(interval);
                // spotlight has reached the destination
                done();
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
        // animates spotlight movement
        interval = setInterval(animateBeam, 10);
    };

    return Spotlight;
}());
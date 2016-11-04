/*jslint plusplus: true, browser: true, devel: true */
/*global $:false, Frame:false, Animator:false, moveLightBeam:false, transitionBoxen:false, createSpotlight:false, getCSV:false*/
var containers = [
    {
        name: "floods",
        isFrame: true,
        items: 5,
        width: 392,
        height: 392,
        x: 205,
        y: 351,
        path: "./images/animations/flooding/flood",
        ext: ".png",
        scale: 1.1
    }, {
        name: "iceCaps",
        isFrame: false,
        items: 5,
        width: 304,
        height: 392,
        x: 253,
        y: 350,
        path: "./images/animations/iceCaps/iceCap",
        ext: ".png",
        scale: 1.1
    },
    {
        name: "lightRays",
        isFrame: true,
        items: 5,
        width: 334,
        height: 412,
        x: -4,
        y: 214,
        path: "./images/animations/lightRays/lightRay",
        ext: ".png"
    },
    {
        name: "co2Meter",
        isFrame: true,
        items: 9,
        width: 70,
        height: 135,
        x: 482,
        y: 281,
        path: "./images/animations/co2Meter/co2Meter",
        ext: ".png",
        scale: 4.3
    },
    {
        name: "tempMeter",
        isFrame: true,
        items: 9,
        width: 70,
        height: 135,
        x: 482,
        y: 281,
        path: "./images/animations/tempMeter/tempMeter",
        ext: ".png",
        scale: 4.25
    },
    {
        name: "mountains",
        isFrame: false,
        items: 5,
        width: 187,
        height: 238,
        x: 155,
        y: 456,
        path: "./images/animations/mountains/mountain",
        ext: ".png"
    },
/* Commented out because they were too darn ugly with the transparency issues!*/
//    {
//        name: "volcanoes",
//        isFrame: false,
//        items: 5,
//        width: 325,
//        height: 322,
//        x: 274,
//        y: 425,
//        path: "./images/animations/volcanoes/volcano",
//        ext: ".png"
//    },
    {
        name: "underwaterVolcanoes",
        isFrame: true,
        items: 5,
        width: 164,
        height: 305,
        x: 1287,
        y: 419,
        path: "./images/animations/underwaterVolcanoes/volcano",
        ext: ".gif"
    },
    {
        name: "seaSnow",
        isFrame: true,
        items: 5,
        width: 120,
        height: 216,
        x: 1165,
        y: 564,
        path: "./images/animations/seaSnow/seaSnow",
        ext: ".gif"
    },
    {
        name: "sediment",
        isFrame: true,
        items: 5,
        width: 129,
        height: 129,
        x: 978,
        y: 527,
        path: "./images/animations/sediment/sediment",
        ext: ".gif"
    },
    {
        name: "carbonateRock",
        isFrame: true,
        items: 5,
        width: 204,
        height: 168,
        x: 1396,
        y: 396,
        path: "./images/animations/carbonateRock/carbonateRock",
        ext: ".gif"
    },
    {
        name: "shadow",
        isFrame: true,
        items: 1,
        width: 392,
        height: 392,
        x: 205,
        y: 351,
        path: "./images/paper-doll/shadow",
        ext: ".png",
        scale: 1.1
    }
];

function setForcers(forcerObj) {
    "use strict";
    var forcers = ["mountains", "volcanoes", "weatheringBurial", "weatheringRelease", "lightRays"],
        showIcons = false,
        activeForcer = 4,
        processedText;

    forcers.forEach(function (forcer, forcerIndex) {
        if (forcerObj[forcer] === 1) {
            $("#forcers g:nth-child(" + (forcerIndex + 1) + ") image:nth-of-type(2)").toggleClass("hide");
            showIcons = true;
        }
    });

    if (!showIcons) {
        //hide all the icons and show text
        $("#forcers").toggleClass("hide");
        $("#forcerText").toggleClass("hide");

        //proccess text
        //TODO actully proccess text
        //<tspan class="smallText" dy="-5">2</tspan>
        processedText = forcerObj.other;

        //Update text
        $("#forcerText text").html(processedText);
    }

}

function init(forcerObj, timeScaleOps) {
    "use strict";
    var boxen,
        animationInProgress = false;

    setForcers(forcerObj);

    boxen = containers.map(function (container, index) {
        var i, box,
            frames = [];

        function transitionBoxen(stepData) {
            var currentBoxen = 0;

            function loopBoxen(box) {
                var properOrder = [2, 1, 0, 3, 4, 5, 6, 7, 8, 9],
                    cc = boxen[properOrder[box]];
                //move spotlight
                moveLightBeam(cc.x + (cc.width * cc.scale) / 2, cc.y + (cc.height * cc.scale) / 2,
                    cc.width * cc.scale, cc.height * cc.scale, 1500,
                    function () {
                        console.log('name: ' + cc.Name);
                        cc.transitionToStep(stepData[cc.Name] - 1);
                        window.setTimeout(function () {
                            currentBoxen++;
                            if (currentBoxen < properOrder.length) {
                                loopBoxen(currentBoxen);
                            } else {
                                $("#spotter").animate({
                                    opacity: 0
                                }, 2000);
                                animationInProgress = false;
                            }
                        }, 2500);
                    });
            }

            loopBoxen(currentBoxen);
        }

        //make a list of filenames
        for (i = 0; i < container.items; i++) {
            frames[i] = container.path + (i + 1) + container.ext;
        }

        frames = frames.map(function (url) {
            var frame = new Frame(url, container.width, container.height);
            if (container.frames) {
                frame.setFrameAmount(container.frames);
            }
            return frame;
        });
        box = new Animator(frames, container.isFrame, container.x, container.y, container.scale);
        return box.setName(container.name)
            .setTargetStep(0)
            .display();
    });

    // modified to make text clickable too
    $("a, a + * + text").on("click", function () {
        if (animationInProgress) {
            return;
        }

        var step = parseInt(this.parentElement.id.slice(-1), 10) - 1;
        // Set active state
        $("#timeline g").removeClass("active");
        $(this.parentElement).addClass("active");
        animationInProgress = true;
        transitionBoxen(timeScaleOps[step]);
        // Transition to next step
        //    boxen.forEach(function (box) {
        //        box.transitionToStep(step);
        //    });
    });

    /*
     * Steps through with spotlight
     * Centers Spotlight on specified x,y
     */

    //creates spotlight
    createSpotlight();
    $("#spotter").animate({
        opacity: 0
    }, 0);
}

/******************************* START ***************************************/
// Get CSV with file name from url
getCSV(function (err, csvData) {
    "use strict";
    var forcerObj = csvData.shift();

    if (err) {
        console.log("error:", err);
        return;
    }
    console.log("scenario:", csvData);
    console.log("forcerObj:", forcerObj);

    init(forcerObj, csvData);
});

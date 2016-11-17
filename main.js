/*jslint plusplus: true, browser: true, devel: true */
/*global $, Frame, Animator, getCSV, containers, resetSpotlightPosition, moveSpotlight, moveToStart, Spotlight*/
var boxen, animations,
    animationInProgress = false,
    spotlight = new Spotlight();

function setForcers(forcerObj) {
    "use strict";
    var forcers = ["mountain", "volcano", "weatheringCBurial", "weatheringCRelease", "insolation"],
        showIcons = false,
        processedText;
    //show the ones we want
    forcers.forEach(function (forcer, forcerIndex) {
        if (forcerObj[forcer] === 1) {
            //hide the image
            $("#forcers g:nth-child(" + (forcerIndex + 1) + ") image:nth-of-type(2)").toggleClass("hide");
            //fix the text
            $("#forcers g:nth-child(" + (forcerIndex + 1) + ") text").toggleClass("disabled");
            showIcons = true;
        }
    });

    if (!showIcons) {
        //hide all the icons and show text
        $("#forcers").toggleClass("hide");
        $("#forcerText").toggleClass("hide");

        //proccess text
        //wrap in tspans the subscript was messing up the words after
        processedText = '<tspan>' + forcerObj.other + '</tspan>';

        //find the underscores followed by a number replace with tspan
        //also it has than ends and starts of other tspan so that all text is in own tspans
        processedText = processedText.replace(/_(\d)/g, function (match, number) {
            return '</tspan><tspan class="forcerSubscript" dy="5" >' + number + '</tspan><tspan dy="-5">';
        });

        //Update text
        $("#forcerText text").html(processedText);
    }

}

function animationsComplete() {
    "use strict";
    $("#spotter").animate({
        opacity: 0
    }, 1000, function () {
        spotlight.resetSpotlightPosition();
        animationInProgress = false;
    });
}

function checkAnimationStatus() {
    'use strict';
    var box = boxen[animations[0]];

    if (box.targetFrame === box.currentFrame) {
        animations.shift();
        if (animations.length > 0) {
            spotlight.moveSpotlight();
        } else {
            animationsComplete();
        }
    } else {
        box.transition(checkAnimationStatus);
    }
}

function updateBoxen(stepData) {
    'use strict';

    var properOrder = [3, 4, 2, 0, 1, 5, 6, 11, 9, 8, 7, 10];

    // Determine which animations need to fire
    animations = properOrder.filter(function (val) {
        var box = boxen[val],
            newTarget = stepData[box.name] - 1;
        if (box.targetStep === newTarget) {
            return false;
        }
        // Update properties
        box.transitionDuration = 1500 / (Math.abs(box.targetStep - newTarget)) / box.framesPerStep;
        box.targetStep = newTarget;
        box.targetFrame = box.targetStep * box.framesPerStep;
        if (box.MiniMacaroniMeter) {
            box.MiniMacaroniMeter.transitionDuration = 1500 / (Math.abs(box.MiniMacaroniMeter.targetStep - newTarget)) / box.MiniMacaroniMeter.framesPerStep;
            box.MiniMacaroniMeter.targetStep = newTarget;
            box.MiniMacaroniMeter.targetFrame = box.MiniMacaroniMeter.targetStep * box.MiniMacaroniMeter.framesPerStep;
        }
        return true;
    });

    if (animations.length > 0) {
        spotlight.moveToStart();
    }

    // Turn on spotlight
    $("#spotter").animate({
        opacity: 1
    }, 1000);

    if (animations.length > 0) {
        spotlight.moveSpotlight();
    } else {
        $('#noChangeMessage').delay(500).fadeIn(800, function () {
            $('#noChangeMessage').delay(1000).fadeOut(800, animationsComplete);
        });
    }

}

function init(forcerObj, timeScaleOps) {
    "use strict";

    setForcers(forcerObj);

    boxen = containers.map(function (container, index) {
        var i, box,
            frames = [];

        //make a list of filenames
        for (i = 0; i < container.items; i++) {
            frames[i] = container.path + (i + 1) + container.ext;
        }

        frames = frames.map(function (url) {
            var frame = new Frame(url, container.width, container.height);
            return frame;
        });
        box = new Animator(container.name, frames, container.isFrame, container.x, container.y, container.scale, timeScaleOps[0][container.name] - 1);
        box.display();
        if (container.macaroni.needed) {
            box.createMacaroniMeter(container.macaroni.name + "MacaroniMeter", container.macaroni.x, container.macaroni.y, container.macaroni.mirrored);
        }

        return box;
    });

    // trims overflow arrows in IE 11
    var insolation = document.getElementById("insolation"),
        volcano = document.getElementById("underwaterVolcano");
    insolation.setAttributeNS(null, "clip-path", "url(#overflowClip)");

    // makes volcano plume tranparent towards the top by applying a mask
    volcano.setAttribute("mask", "url(#Mask)");

    // modified to make text clickable too
    $("a, a + * + text").on("click", function () {
        if (animationInProgress || $(this.parentElement).hasClass("active")) {
            return;
        }
        // IE 11 Support
        var parent = this.parentElement || this.parentNode,
            step = parseInt(parent.id.slice(-1), 10) - 1;
        // Set active state
        $("#timeline g").removeClass("active");
        $(this.parentElement).addClass("active");
        animationInProgress = true;
        updateBoxen(timeScaleOps[step]);
        return false;
    });

}

function parsingFunc(d) {
    "use strict";

    function zeroOrNum(textIn) {
        var num = parseInt(textIn, 10);
        return isNaN(num) ? 0 : num;
    }

    return {
        rowHeading: d["Row Heading"],
        other: d.Other,
        sediment: zeroOrNum(d.Sediment),
        co2: zeroOrNum(d.CO2),
        ice: zeroOrNum(d.Ice),
        insolation: zeroOrNum(d.Insolation),
        mountain: zeroOrNum(d.Mountains),
        sea: zeroOrNum(d.Sea),
        temperature: zeroOrNum(d.Temperature),
        volcano: zeroOrNum(d.Volcano),
        underwaterVolcano: zeroOrNum(d.Volcano),
        co3Desposition: zeroOrNum(d["CO3 Desposition"]),
        weatheringCRelease: zeroOrNum(d["Weathering C Release"]),
        weatheringCBurial: zeroOrNum(d["Weathering C Burial"])
    };
}

function callbackForGetCSV(err, csvData) {
    "use strict";
    var forcerObj;

    if (err) {
        console.log("error:", err);
        $("#error").toggleClass("hide");
        $("svg").toggleClass("hide");
        return;
    }

    forcerObj = csvData.shift();
    console.log("scenario:", csvData);
    console.log("forcerObj:", forcerObj);

    init(forcerObj, csvData);
}

/******************************* START ***************************************/
// Get CSV with file name from url
getCSV(parsingFunc, callbackForGetCSV);

//help for development - placing pictures
function placeSomething(selectorIn) {

    "use strict";
    var clickCounter = 0,
        clickCounterMax = 1,
        fixX = 161,
        fixY = 9,
        selector = selectorIn,

        obj = {
            x: 0,
            y: 0,
            scale: 1
        };

    function runTransform() {
        var ele = document.querySelector(selector);
        if (ele) {
            ele.setAttributeNS(null, "transform", 'translate(' + obj.x + ',' + obj.y + ') scale(' + obj.scale + ')');
        }
    }

    $("svg").on("mousemove", function (options) {
        if (clickCounter < clickCounterMax) {
            console.clear();
            obj.x = options.clientX - fixX;
            obj.y = options.clientY - fixY;
            console.log(obj);
            runTransform();
        }
    });

    $("svg").on("click", function (options) {
        clickCounter += 1;
    });

    document.querySelector("svg").addEventListener("wheel", function (event) {
        if (clickCounter < clickCounterMax) {
            obj.scale = +((obj.scale - event.deltaY / 100 * 0.05).toFixed(2));
            console.log(obj);
            runTransform();
        }
    });

}

//placeSomething("#insolation");

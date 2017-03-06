/*jslint plusplus: true, browser: true, devel: true */
/*global $, Frame, Animator, getCSV, containers, resetSpotlightPosition, moveSpotlight, moveToStart, Spotlight*/
var boxen, animations,
    animationInProgress = false;
//    spotlight = new Spotlight();
var lightCrew = new Spotlights();
lightCrew.generateScene(1730, 938, "#spots")
lightCrew.addLight(50, 50, 200, 200);
lightCrew.turnOffLights(1000, function () {})

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
    lightCrew.turnOffLights(1000, function () {
        animationInProgress = false;
    })
    $("#messageBox").animate({
        opacity: 0
    }, 1000);
}

function checkAnimationStatus() {
    'use strict';
    updateMessageBoxInfo();
    var box = boxen[animations[0]];
    console.log(box);
    if (box.targetFrame === box.currentFrame) {
        animations.shift();
        boxen[animations[0]].startingFrame = boxen[animations[0]].currentFrame;
        if (animations.length > 0) {
            //            goThroughText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et lacus venenatis, sodales mi ac, pharetra nibh. Phasellus congue nisi at mi lacinia finibus. Curabitur lectus elit, tincidunt quis gravida in, porta nec nulla. Nam pretium vulputate tincidunt. In sit amet sapien et metus congue mollis in quis quam. Vestibulum egestas non metus vitae venenatis. Curabitur iaculis nunc nulla, vitae interdum ante pellentesque in. In hac habitasse platea dictumst. Sed id volutpat lorem, nec venenatis nisi. Nulla ac aliquet nulla. Suspendisse id imperdiet enim, sit amet posuere felis. Maecenas volutpat augue quis felis imperdiet, vel porttitor ex laoreet. Nunc egestas mollis libero quis pulvinar. Etiam quis ex lacus.", function(){
            //                moveToNext();
            //            });
            //            console.log(boxen[animations[0]])
            goThroughText(boxen[animations[0]].text, function () {
                console.log("You called?");
                if (animations.length > 1) {
                    moveToNext();
                } else
                    animationsComplete();
            })
        } else {
            animationsComplete();
        }
    } else {
        box.transition(checkAnimationStatus);
    }
}

function grabSegment(word, maxLength) {
    function getLength(item) {
        var test = document.getElementById("ruler");
        test.innerText = item;
        test.style.fontSize = 18;
        // 		var height = (test.clientHeight + 1) + "px";
        var width = (test.clientWidth + 1);
        return width;
    }
    var totalLength = 0;
    var averageLen = getLength(word) / word.length;
    console.log(averageLen);
    var maxReached = false;
    var newWord = word.split(" ").filter(function (value, index) {
        if (!maxReached && totalLength + (value.length * averageLen) < maxLength) {
            totalLength += ((value.length + 1) * averageLen)
            console.log("item ", value);
            return true;
        }
        maxReached = true;
        return false;
    }).join(" ");

    return newWord;

}

function goThroughText(text, complete) {

    //    var segment = grabSegment(text, 800);
    $("#msgTxt").text(text);
    console.log(text);
    //    if(text.trim() === "")
    //        complete();
    var completed = false;
    $("#next").click(function () {
        if (!completed) {
            complete();
            completed = true;
        }
    });
}

function getCurrentAnimationBounds() {
    //    console.log(boxen[animations[0]]);
    console.log(boxen[animations[0]].name);
    if (!boxen[animations[0]].offset)
        boxen[animations[0]].offset = {
            x: 0,
            y: 0
        }
    if (!boxen[animations[0]].scale)
        boxen[animations[0]].scale = {
            x: 1,
            y: 1
        }
    var larger = (boxen[animations[0]].states[0].width > boxen[animations[0]].states[0].height) ? boxen[animations[0]].states[0].width : boxen[animations[0]].states[0].height;
    var bounds = {
        width: larger,
        height: larger,
        x: boxen[animations[0]].x,
        y: boxen[animations[0]].y,
        scale: {
            x: boxen[animations[0]].scale.x * 1.5,
            y: boxen[animations[0]].scale.y * 1.5
        },
        offset: {
            x: (boxen[animations[0]].offset.x || 0) + boxen[animations[0]].states[0].width / 2,
            y: (boxen[animations[0]].offset.y || 0) + boxen[animations[0]].states[0].height / 2
        }
    }
    if (boxen[animations[0]].name === "sediment" || boxen[animations[0]].name === "weatheringCBurial") {
        bounds.scale.x = 2;
        bounds.scale.y = 2;
    }
    //    console.log(bounds);
    return bounds;
}

function moveToNext() {


    lightCrew.moveLightToLocation(0, getCurrentAnimationBounds(), 1000, function () {
        boxen[animations[0]].transition(checkAnimationStatus);
    });
}
console.log("Hello World!")

function updateBoxen(stepData) {
    'use strict';

    var properOrder = [3, 4, 2, 0, 1, 5, 6, 11, 9, 8, 7, 10];

    // Determine which animations need to fire
    animations = properOrder.filter(function (val) {
        var box = boxen[val];
        var newTarget = stepData[box.name].value - 1;
        if (box.targetStep === newTarget) {
            return false;
        }
        // Update properties
        box.transitionDuration = 1500 / (Math.abs(box.targetStep - newTarget)) / box.framesPerStep;
        box.targetStep = newTarget;
        box.targetFrame = box.targetStep * box.framesPerStep;
        box.text = stepData[box.name].text;
        box.timing = stepData[box.name].timing;
        if (box.MiniMacaroniMeter) {
            box.MiniMacaroniMeter.transitionDuration = 1500 / (Math.abs(box.MiniMacaroniMeter.targetStep - newTarget)) / box.MiniMacaroniMeter.framesPerStep;
            box.MiniMacaroniMeter.targetStep = newTarget;
            box.MiniMacaroniMeter.targetFrame = box.MiniMacaroniMeter.targetStep * box.MiniMacaroniMeter.framesPerStep;
        }
        return true;
    });

    if (animations.length > 0) {
        boxen[animations[0]].startingFrame = boxen[animations[0]].currentFrame;
        updateMessageBoxInfo();
        lightCrew.moveLightToLocation(0, getCurrentAnimationBounds(), 0, function () {
            lightCrew.turnOnLights(1000, function () {
                console.log("Spotlight is on!");
                console.log("Moving To Next...");
                console.log("TPz: ", TP)
                moveToNext();
            });
        });
    } else {
        $('#noChangeMessage').delay(500).fadeIn(800, function () {
            $('#noChangeMessage').delay(1000).fadeOut(800, animationsComplete);
        });
    }

    //    // Turn on spotlight
    //    spotlight.turnOn();

    if (animations.length > 0) {
        //        spotlight.moveSpotlight(boxen[animations[0]], funtion () {
        //            
        //        });
    }
}

function updateMessageBoxInfo() {
    //        spotlight.moveToStart(boxen[animations[0]]);
    $("#timePeriod").text("Time Period: " + TP);
    var box = boxen[animations[0]];
    $("#washappenin").html(box.name + " " + box.startingFrame + " " + "&#11157; " + box.targetFrame);
    $("#msgTxt").text("");
    $("#messageBox").animate({
        opacity: 1
    }, 1000);
}

function init(forcerObj, timeScaleOps) {
    "use strict";
    console.log(forcerObj, timeScaleOps)
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
        TP = $(this).parent().find("text").text().replace(/Y/g, "Years").replace(/K/g, "Thousand ").replace(/M/g, "Million ");
        console.log('TP: ', TP);
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

var TP = "";

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
getCSV(callbackForGetCSV);

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
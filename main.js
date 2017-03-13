/*jslint plusplus: true, browser: true, devel: true */
/*global $, Frame, Animator, getCSV, containers, resetSpotlightPosition, moveSpotlight, moveToStart, Spotlights, settings, containerIndexes*/

var boxen, animations,
    animationInProgress = false;
//    spotlight = new Spotlight();
var lightCrew = new Spotlights();
lightCrew.generateScene(1730, 938, "#spots");
lightCrew.addLight(-50, -50, 20, 20);
lightCrew.turnOffLights(0, function () {});
/*
$("#MRRECT").click(function () {
    //    alert("WHO DARE CLICK MR. RECT?!?");
    window.location.href = ("./homepage.html");
});
*/

function setForcers(forcerObj) {
    "use strict";
    var forcers = ["mountain", "volcano", "weatheringCBurial", "weatheringCRelease", "insolation"],
        showIcons = false,
        processedText;
    //show the ones we want
    forcers.forEach(function (forcer, forcerIndex) {
        if (forcerObj[forcer] === "1") {
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
    // animateThroughTimePeriods returns true if it actually done
    lightCrew.turnOffLights(settings.TURNOFFLIGHTS_LENGTH, function () {
        animationInProgress = false;
    });
    if (animateThroughTimePeriods()) {
        hideMessageBox();
    }
    //    animateThroughTimePeriods()
}

function checkAnimationStatus() {
    'use strict';
    //console.log(box);
    var there = 0;
    animations[0].forEach(function (item,index) {
        console.log(index);
        var box = boxen[animations[0][index]];
        if (box.targetFrame === box.currentFrame) {
            if (++there >= animations[0].length) {
                $("#next").removeClass("disabled");
                goThroughText(boxen[animations[0][0]].text, function () {
                    animations.shift();
                    if (animations.length > 0) {
                        console.log(animations);
                        boxen[animations[0][0]].startingFrame = boxen[animations[0][0]].currentFrame;
                        updateMessageBoxInfo();
                        if (lightCrew.lights.length > 1)
                            lightCrew.deleteLights(1, lightCrew.lights.length - 1);
                        moveToNext();
                    } else {
                        animationsComplete();
                    }

                });
            }

        } else {
            box.transition(checkAnimationStatus);
        }
    })
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
            totalLength += ((value.length + 1) * averageLen);
            console.log("item ", value);
            return true;
        }
        maxReached = true;
        return false;
    }).join(" ");

    return newWord;

}

function goThroughText(text, complete) {

    //add the text to the div
    $("#msgTxt").text(text);

    //just for testing
    if (settings.SKIP_NEXT_BUTTON) {
        complete();
    }

    var completed = false;
    $("#next").click(function () {
        if ($(this).hasClass("disabled"))
            return;
        if (!completed) {
            complete();
            completed = true;
        }
    });
}

/*
 * Custom fitting of spotlight to objects
 */
function getCurrentAnimationBounds(index) {
    index = index || 0;

    //    console.log(boxen[animations[0]]);
    var currentAnimation = animations[0][index];
    var box = boxen[currentAnimation];
    console.log(box.name);

    if (!box.offset)
        box.offset = {
            x: 0,
            y: 0
        };
    if (!box.scale)
        box.scale = {
            x: 1,
            y: 1
        };
    var larger = (box.states[0].width > box.states[0].height) ? box.states[0].width : box.states[0].height;
    var bounds = {
        width: larger,
        height: larger,
        x: box.x,
        y: box.y,
        scale: {
            x: box.scale.x * 1.5,
            y: box.scale.y * 1.5
        },
        offset: {
            x: (box.offset.x || 0) + box.states[0].width / 2,
            y: (box.offset.y || 0) + box.states[0].height / 2
        }
    };
    if (box.name === "sediment" || box.name === "weatheringCBurial") {
        bounds.scale.x = 2;
        bounds.scale.y = 2;
    }
    if (box.name === "insolation") {
        bounds.y += 30;
        bounds.scale.x = .9;
        bounds.scale.y = .9;
    }
    if (box.name === "mountain") {
        bounds.scale.x = 1.2;
        bounds.scale.y = 1.2;
    }
    if (box.name === "volcano") {
        bounds.scale.x = .9;
        bounds.scale.y = .9;
    }
    if (box.name === "temperature") {
        bounds.x -= 25;
        bounds.scale.x = .5;
        bounds.scale.y = 1.2;
    }
    if (box.name === "co2") {
        bounds.x -= 30;
        bounds.scale.x = .5;
        bounds.scale.y = 1.2;
    }
    if (box.name === "underwaterVolcano") {
        bounds.y += 50;
        bounds.x -= 15;
        bounds.scale.x = .65;
        bounds.scale.y = 1.5;
    }
    if (box.name === "weatheringCBurial") {
        bounds.y -= 50;
        //        bounds.x -= 15;
        bounds.scale.x = 5;
        bounds.scale.y = 5;
    }
    //    console.log(bounds);
    return bounds;
}

function moveToNext() {

    $("#next").addClass("disabled");
    var arrived = 0;
    lightCrew.moveLightToLocation(0, getCurrentAnimationBounds(), settings.SPOTLIGHT_MOVE_DURATION, syncLightArrival);
    for (var i in animations[0])
        if (i !== "0") {
            var bounds = getCurrentAnimationBounds(i);
            lightCrew.addLight(bounds.x, bounds.y, 1, 1);
            lightCrew.moveLightToLocation(i, getCurrentAnimationBounds(i), 1000, syncLightArrival);
        }


    function syncLightArrival() {
        arrived++;
        if (arrived >= animations[0].length)
            setTimeout(startTransitions, 500);
    }

    function startTransitions() {
        var completed = 0;
        for (var i in animations[0])
            boxen[animations[0][i]].transition(function () {
                completed++;
                if (completed >= animations[0].length) {
                    console.log("DONE!");
                    checkAnimationStatus();
                }
            });
    }
}

function getProperOrder(stepData) {
    console.log("stepData:", stepData);

    //make array of objects that hold correct index from containers and timeing from csv stepData
    //filter out any stepTimeings that are 0
    //getCSV makes any timings that are blank equal 0
    var steps = Object.keys(stepData).reduce(function (endArray, key) {
        var stepTimeing = stepData[key].timing;

        //skip the rowHeadings and anything with timing 0
        if (key === "rowHeading" || stepTimeing === 0) {
            return endArray;
        }
        //make objects that hold correct index and timeing
        endArray.push({
            index: containerIndexes[key], // get the index from the container array
            timing: stepTimeing
        });
        return endArray;
    }, []);

    //sort on timing
    steps.sort(function (a, b) {
        return a.timing - b.timing;
    });

    /*
     * Groups animations with same timing together.
     */
    var used = [];
    steps = steps.map(function (step) {
        return steps.filter(function (stp) {
            return stp.timing === step.timing;
        })
    }).filter(function (step) {
        if (used.indexOf(JSON.stringify(step)) >= 0)
            return false;
        used.push(JSON.stringify(step));
        return true;
    }).map(function (items) {
        return items.map(function (item) {
            return item.index;
        });
    });

    //    console.log("steps:", steps);


    return steps;

}

function animateThroughTimePeriods() {
    console.log(CurrentTP, TargetTP)
    var actuallyDone = true;
    if (CurrentTP < TargetTP) {
        CurrentTP++
        updateBoxen(csv_data[CurrentTP], false)
        actuallyDone = false;
    } else if (TargetTP < CurrentTP) {
        CurrentTP = TargetTP
        updateBoxen(csv_data[CurrentTP], true)
    } else {
        console.log("Uhhhh")
    }
    console.log("Actually Done:", actuallyDone)
    return actuallyDone;
}

function updateBoxen(stepData, skipAnimations) {
    'use strict';
    var properOrder = getProperOrder(stepData);
    console.log(properOrder);
    // Determine which animations need to fire
    animations = properOrder.filter(function (vals) {
        vals = vals.filter(function (val) {

            var box = boxen[val];
            var newTarget = stepData[box.name].value - 1;
            console.log("box.text:", stepData[box.name].text);
            if (box.targetStep === newTarget && stepData[box.name].text === '') {
                return false;
            }
            // Update properties
            box.transitionDuration = settings.ANIMATION_LENGTH / (Math.abs(box.targetStep - newTarget)) / box.framesPerStep;
            box.targetStep = newTarget;
            box.targetFrame = box.targetStep * box.framesPerStep;
            box.text = stepData[box.name].text;
            box.timing = stepData[box.name].timing;
            if (box.MiniMacaroniMeter) {
                box.MiniMacaroniMeter.transitionDuration = settings.ANIMATION_LENGTH / (Math.abs(box.MiniMacaroniMeter.targetStep - newTarget)) / box.MiniMacaroniMeter.framesPerStep;
                box.MiniMacaroniMeter.targetStep = newTarget;
                box.MiniMacaroniMeter.targetFrame = box.MiniMacaroniMeter.targetStep * box.MiniMacaroniMeter.framesPerStep;
            }
            return true;
        });

        return (vals.length > 0);
    });

    console.log(animations);

    if (animations.length > 0) {
        // SKIPS ANIMATIONS
        if (skipAnimations) {
            animations.forEach(function (items) {
                items.forEach(function (item) {
                    var stateNumber = stepData[boxen[item].name].value - 1;
                    //console.log(boxen[item].name, "Set To State:", stateNumber);
                    boxen[item].setState(stateNumber);
                })
            });
            animationInProgress = false;
            return;
        }
        boxen[animations[0][0]].startingFrame = boxen[animations[0][0]].currentFrame;
        updateMessageBoxInfo();
        showMessageBox();
        lightCrew.moveLightToLocation(0, getCurrentAnimationBounds(), 0, function () {
            lightCrew.turnOnLights(settings.TURN_ON_LIGHTS_LENGTH, function () {
                console.log("Spotlight is on!");
                console.log("Moving To Next...");
                console.log("TPz: ", timeKeys[CurrentTP]);
                moveToNext();
            });
        });
    } else {
        // NO CHANGES MADE
        var bigAndCenter = {
            x: 1730 / 2, //the new x position
            y: 938 / 2, // the new y position
            width: 1730 * 0.9, // new spotlight width
            height: 938 / 0.9, // new spotlight height
            scale: {
                x: 1, // scales the object x by the specified amount
                y: 1 // scales the object y by the specified amount
            },
            offset: {
                x: 1, // offsets the object x by the specified amount
                y: 1
            } // offsets the object y by the specified amount
        };
        lightCrew.moveLightToLocation(0, bigAndCenter, 0, function () {
            lightCrew.turnOnLights(settings.TURN_ON_LIGHTS_LENGTH, function () {
                $('#noChangeMessage').delay(500).fadeIn(800, function () {
                    $('#noChangeMessage').delay(1000).fadeOut(800, animationsComplete);
                });
            });
        });
    }
}

function showMessageBox() {
    $("#messageBox").animate({
        opacity: 1
    }, settings.MESSAGEBOX_ANIMATION_LENGTH);
}

function hideMessageBox() {
    $("#messageBox").animate({
        opacity: 0
    }, settings.MESSAGEBOX_ANIMATION_LENGTH);
}

function updateMessageBoxInfo() {
    //        spotlight.moveToStart(boxen[animations[0]]);
    function frameToValue(num, box) {
        return Math.floor(num / box.framesPerStep) + 1;
    }

    $("#timePeriod").text("Time Period: " + timeKeys[CurrentTP]);
    var wasHappenin = "",
        box = boxen[animations[0][0]];
    //setup the string
    wasHappenin += box.label + ": ";
    wasHappenin += frameToValue(box.startingFrame, box);
    wasHappenin += " " + "&#10140; ";
    wasHappenin += frameToValue(box.targetFrame, box);


    $("#washappenin").html(wasHappenin);
    $("#msgTxt").text(boxen[animations[0][0]].text);
}

/*
 * SETS ALL OF THE ANIMATION STATES
 */
function setAnimationStates(state) {
    boxen.forEach(function (item) {
        console.log("IN BLAST:", item.name);
        item.setState(state);
    });
}

function init(forcerObj, timeScaleOps) {
    "use strict";
    console.log(forcerObj, timeScaleOps);
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
        box = new Animator(container.name, frames, container.isFrame, container.x, container.y, container.scale, timeScaleOps[0][container.name].value - 1);
        box.display();
        if (container.macaroni.needed) {
            box.createMacaroniMeter(container.macaroni.name + "MacaroniMeter", container.macaroni.x, container.macaroni.y, container.macaroni.mirrored);
        }
        box.label = container.label;
        return box;
    });


    // trims overflow arrows in IE 11
    var insolation = document.getElementById("insolation"),
        volcano = document.getElementById("underwaterVolcano");
    insolation.setAttributeNS(null, "clip-path", "url(#overflowClip)");

    // makes volcano plume tranparent towards the top by applying a mask
    volcano.setAttribute("mask", "url(#Mask)");

    // modified to make text clickable too
    $("#timeline a, #timeline a + * + text").on("click", function () {
        if (animationInProgress || $(this.parentElement).hasClass("active")) {
            return;
        }
        animationInProgress = true;
        var phase = $(this).parent().find("text").text();
        // IE 11 Support
        var parent = this.parentElement || this.parentNode,
            step = parseInt(parent.id.slice(-1), 10) - 1;
        // Set active state
        $("#timeline g").removeClass("active");
        $(this.parentElement).addClass("active");

        TargetTP = step
        console.log(TargetTP < CurrentTP, TargetTP, CurrentTP);
        animateThroughTimePeriods()

        return false;
    });

}

var timeKeys = ["INITIAL", "100-1000 Years", "100 Thousand Years", "1 Million Years", "10 Million Years"];
var CurrentTP = 0;
var TargetTP = 0;
var csv_data;

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
    csv_data = csvData

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
/*jslint plusplus: true, browser: true, devel: true */
/*global $, states*/


function appendImageToSVG(element, url, x, y, width, height) {
    "use strict";
    var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", url);
    image.setAttributeNS(null, "x", x);
    image.setAttributeNS(null, "y", y);
    image.setAttributeNS(null, "width", width);
    image.setAttributeNS(null, "height", height);
    image.setAttributeNS(null, "visibility", "visibile");

    document.querySelector(element).appendChild(image);
}


var Frame = (function () {
    "use strict";

    function Frame(location, width, height) {
        this.file = location;
        this.opacity = 0;
        this.width = width;
        this.height = height;
    }

    return Frame;
}());

/*
 * THE ANIMATOR CLASS
 */

var Animator = (function () {

    "use strict";

    function getScale(scale) {
        if (typeof scale === "object") {
            return scale;
        } else if (typeof scale === "number") {
            return {
                x: scale,
                y: scale
            };
        }
        return {
            x: 1,
            y: 1
        };
    }

    function Animator(name, states, isFrame, x, y, scale, targetStep) {
        this.x = x;
        this.y = y;
        this.states = states;
        this.isFrame = isFrame;
        this.framesPerStep = Math.round((states.length) / 5);
        this.targetStep = targetStep;
        this.targetFrame = targetStep * this.framesPerStep;
        this.currentFrame = this.targetFrame;
        this.name = name;
        this.transitionDuration = 500;
        this.frames = [];
        this.scale = getScale(scale);
        this.width = this.states[0].width;
        this.height = this.states[0].height;
        this.MiniMacaroniMeter = null;
    }

    Animator.prototype.display = function () {
        var framesPerStep,
            animator = this,
            group = document.createElementNS("http://www.w3.org/2000/svg", "g");

        group.setAttributeNS(null, "id", animator.name);

        group.setAttributeNS(null, "transform", "translate(" + animator.x + "," + animator.y + ") scale(" + animator.scale.x + " " + animator.scale.y + ")");

        if (animator.isFrame) {
            animator.transition = animator.frameTransition;
        } else {
            animator.transition = animator.crossfadeTransition;
        }

        document.querySelector("#child_container").appendChild(group);
        animator.currentFrame = animator.targetFrame;

        animator.states.forEach(function (frame, index) {
            var image,
                svg = $(animator.name),
                fadeOut;

            if (animator.frames.length < index + 1) {
                image = document.createElementNS("http://www.w3.org/2000/svg", "image");
                image.setAttributeNS("http://www.w3.org/1999/xlink", "href", frame.file);
                image.setAttributeNS(null, "x", 0);
                image.setAttributeNS(null, "y", 0);
                image.setAttributeNS(null, "height", frame.height);
                image.setAttributeNS(null, "width", frame.width);

                group.appendChild(image);
                animator.frames.push(image);
            } else {
                svg = animator.frames[index];
            }
            // INSTANT CHANGE OF ANIMATIONS
            // TURN TO OWN FUNCTION
            if (index <= animator.targetFrame) {
                frame.opacity = 1;
            } else {
                frame.opacity = 0;
                $(image).css("opacity", "0");
            }
            fadeOut = window.setInterval(function () {
                window.clearInterval(fadeOut);
            }, 1500);
            return frame;

        });

        this.group = group;
        return this;
    };
    // SKIPS ANIMATIONS AND INSTANTLY SETS STATES
    //state in is a number between 0-4
    Animator.prototype.setState = function (state) {
        var that = this;

        //make sure state is with in bounds
        if (state > 4) {
            state = 4;
        } else if (state < 0) {
            state = 0;
        }

        //update current frame so animations work later
        this.targetFrame = this.currentFrame = state * that.framesPerStep;

        //set the frames and states themselfs
        this.states.forEach(function (frame, index) {
            // console.log(frame);
            if (index <= state * that.framesPerStep) {
                frame.opacity = 1;
                //  console.log(index, state);
            } else {
                frame.opacity = 0;
            }

            $(that.frames[index]).css("opacity", frame.opacity);
        });

        //fix the macaroniMeter too if it has one
        if (this.MiniMacaroniMeter) {
            this.MiniMacaroniMeter.setState(state);
        }
    };

    Animator.prototype.createMacaroniMeter = function (name, x, y, mirrored) {
        var i,
            files = [],
            path = "./images/animations/MininMacaroniMeter/miniMacMeter";

        for (i = 1; i <= 5; i++) {
            files.push(new Frame(path + i + ".png", 23, 54));
        }

        this.MiniMacaroniMeter = new Animator(name, files, true, x, y, 1, this.currentFrame);
        this.MiniMacaroniMeter.display();
        if (mirrored) {
            this.MiniMacaroniMeter.mirror();
        }
        return this;
    };

    Animator.prototype.mirror = function () {
        this.group.setAttributeNS(null, "transform", "translate(" + (this.x) + "," + this.y + ") scale(" + this.scale.x * -1 + " " + this.scale.y + ")");
    };

    Animator.prototype.frameTransition = function (callback) {
        var frameIndex;

        if (this.MiniMacaroniMeter) {
            this.MiniMacaroniMeter.transition();
        }

        // Determine frame to animate and set necessary values
        if (this.targetFrame < this.currentFrame) {
            frameIndex = this.currentFrame;
            this.states[frameIndex].opacity = 0;
            this.currentFrame = this.currentFrame - 1;
        } else {
            frameIndex = this.currentFrame + 1;
            this.states[frameIndex].opacity = 1;
            this.currentFrame = frameIndex;
        }

        // Animate
        this.fade(frameIndex, this.transitionDuration, callback);
    };

    Animator.prototype.crossfadeTransition = function (callback) {

        var startFrame = this.currentFrame,
            nextFrame = (this.targetFrame < startFrame) ? startFrame - 1 : startFrame + 1,
            that = this;

        // Update current frame
        this.currentFrame = nextFrame;

        // Update opacities
        this.states[startFrame].opacity = 0;
        this.states[nextFrame].opacity = 1;

        // Animate - only one should have the callback to keep animation from moving to fast
        this.fade(startFrame, this.transitionDuration, callback);
        this.fade(nextFrame, this.transitionDuration);
    };

    Animator.prototype.fade = function (frameIndex, durration, callback) {
        // Start Animation
        $(this.frames[frameIndex]).animate({
            opacity: this.states[frameIndex].opacity
        }, durration, callback);
    };


    return Animator;
}());

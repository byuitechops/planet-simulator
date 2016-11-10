/*jslint plusplus: true, browser: true, devel: true */
/*global $, states*/
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
        this.scale = scale || 1;
        this.width = this.states[0].width;
        this.height = this.states[0].height;
        this.MiniMacaroniMeter = null;
    }

    Animator.prototype.display = function () {
        var framesPerStep,
            animator = this,
            group = document.createElementNS("http://www.w3.org/2000/svg", "g");

        group.setAttributeNS(null, "id", animator.name);

        if (animator.scale) {
            group.setAttributeNS(null, "transform", "translate(" + animator.x + "," + animator.y + ") scale(" + animator.scale + ")");
        } else {
            group.setAttributeNS(null, "transform", "translate(" + animator.x + "," + animator.y + ")");
        }
        
        if (animator.isFrame) {
            animator.transition = animator.frameTransition;
        } else {
            animator.transition = animator.crossfadeTransition;
        }

        document.querySelector("#other_crap").appendChild(group);
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
                image.setAttributeNS(null, "visibility", "visibile");

                group.appendChild(image);
                animator.frames.push(image);
            } else {
                svg = animator.frames[index];
            }
            if (index <= animator.targetFrame) {
                frame.opacity = 100;
            } else {
                frame.opacity = 0;
                $(image).attr("opacity", "0");
            }
            fadeOut = window.setInterval(function () {
                window.clearInterval(fadeOut);
            }, 1500);
            return frame;

        });

        return this;
    };

    Animator.prototype.createMacaroniMeter = function (name, x, y, malicious) {
        var path = (malicious) ? "./images/animations/MaliciousMiniMacaroniMeter/miniMacMeter" : "./images/animations/MininMacaroniMeter/miniMacMeter";
        var files = [];
        for (var i = 1; i <= 5; i++) {
            files.push(new Frame(path + i + ".png", 23, 54));
        }

        this.MiniMacaroniMeter = new Animator(name, files, true, x, y, this.scale, this.currentFrame);
        this.MiniMacaroniMeter.display();
        return this;
    }

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
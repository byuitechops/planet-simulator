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

    Frame.prototype.getWidth = function () {
        return this.width;
    };

    Frame.prototype.getHeight = function () {
        return this.height;
    };

    Frame.prototype.setWidth = function (width) {
        this.width = width;
        return this;
    };

    Frame.prototype.setHeight = function (height) {
        this.height = height;
        return this;
    };

    Frame.prototype.getOpacity = function () {
        return this.opacity;
    };

    Frame.prototype.setOpacity = function (opactiy) {
        this.opacity = opactiy;
        return this;
    };

    Frame.prototype.getFile = function () {
        return this.file;
    };

    Frame.prototype.setFile = function (location) {
        this.file = location;
        return this;
    };

    return Frame;
}());

/*
 * THE ANIMATOR CLASS
 */

var Animator = (function () {

    "use strict";

    function Animator(states, isFrame, x, y, scale) {
        this.x = x;
        this.y = y;
        this.states = states;
        this.isFrame = isFrame;
        this.targetStep = 0;
        this.currentFrame = 0;
        this.targetFrame = 0;
        this.Name = undefined;
        this.transitionDuration = 500;
        this.frames = [];
        this.scale = scale || 1;
        this.width = this.states[0].width;
        this.height = this.states[0].height;

        /*
         * The Mini Maceroni Meter!
         */
        this.MiniMaceroniMeter = null;
    }
    //inital state could be hard coded here
    Animator.prototype.display = function () {
        var framesPerStep,
            currentAnimator = this,
            group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttributeNS(null, "id", this.getName());

        if (this.scale) {
            group.setAttributeNS(null, "transform", "translate(" + this.getX() + "," + this.getY() + ") scale(" + this.scale + ")");
        } else {
            group.setAttributeNS(null, "transform", "translate(" + this.getX() + "," + this.getY() + ")");
        }

        document.querySelector("#other_crap").appendChild(group);
        
        // Calculate frames per step
        framesPerStep = Math.round((this.states.length) / 5);

        // Calculate target frame
        currentAnimator.targetFrame = currentAnimator.targetStep * framesPerStep;
        currentAnimator.currentFrame = currentAnimator.targetFrame;

        this.states.forEach(function (frame, index) {
            var image,
                svg = $(currentAnimator.getName()),
                fadeOut;

            if (currentAnimator.frames.length < index + 1) {
                image = document.createElementNS("http://www.w3.org/2000/svg", "image");
                image.setAttributeNS("http://www.w3.org/1999/xlink", "href", frame.getFile());
                image.setAttributeNS(null, "x", 0);
                image.setAttributeNS(null, "y", 0);
                image.setAttributeNS(null, "height", frame.getHeight());
                image.setAttributeNS(null, "width", frame.getWidth());
                image.setAttributeNS(null, "visibility", "visibile");

                group.appendChild(image);
                currentAnimator.frames.push(image);
            } else {
                svg = currentAnimator.frames[index];
            }
            if (index <= currentAnimator.targetFrame) {
                frame.setOpacity(100);
            } else {
                frame.setOpacity(0);
                $(image).attr("opacity", "0");
            }
            fadeOut = window.setInterval(function () {
                window.clearInterval(fadeOut);
            }, 1500);
            return frame;

        });

        return this;
    };

    // Getters and Setters
    Animator.prototype.getStates = function () {
        return this.states.map(function (x) {
            return x;
        });
    };
    Animator.prototype.getTargetStep = function () {
        return this.targetStep;
    };
    Animator.prototype.getName = function () {
        return this.Name;
    };
    Animator.prototype.getTransitionDuration = function () {
        return this.transitionDuration;
    };
    Animator.prototype.setStates = function () {
        this.states = states;
        return this;
    };
    Animator.prototype.setTargetStep = function (step) {
        if (step < 0) {
            step = 0;
        }
        if (step >= this.states.length) {
            step = this.states.length - 1;
        }
        this.targetStep = step;
        return this;
    };
    Animator.prototype.setName = function (Name) {
        this.Name = Name;
        return this;
    };
    Animator.prototype.setTransitionDuration = function (durration) {
        this.transitionDuration = durration;
        return this;
    };
    Animator.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    Animator.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    Animator.prototype.getX = function () {
        return this.x;
    };
    Animator.prototype.getY = function () {
        return this.y;
    };

    Animator.prototype.createMaceroniMeter = function (x, y, malicious) {
        var i,
            path = (malicious) ? "./images/animations/MaliciousMiniMaceroniMeter/miniMacMeter" : "./images/animations/MininMaceroniMeter/miniMacMeter",
            files = [];
        for (i = 1; i <= 5; i++) {
            files.push(new Frame(path + i + ".png", 23, 54));
        }
        this.MiniMaceroniMeter = new Animator(files, false, x, y, this.scale);
        this.MiniMaceroniMeter.setTargetStep(this.currentFrame)
            .display();
        return this;
    }

    Animator.prototype.transitionToStep = function (targetStep, cback) {
        if (this.MiniMaceroniMeter) {
            this.MiniMaceroniMeter.transitionToStep(targetStep);
        }

        var framesPerStep, targetFrame;
        // Dont move if you are already there
        if (targetStep === this.targetStep) {
            console.log('no transition needed');
            return this;
        }

        // Calculate frames per step
        framesPerStep = Math.round((this.states.length) / 5);

        // Adjust duration
        this.setTransitionDuration(1500 / (Math.abs(this.targetStep - targetStep)) / framesPerStep);

        // Calculate target frame
        targetFrame = targetStep * framesPerStep;

        // Update step and target frame
        this.targetStep = targetStep;
        this.targetFrame = targetFrame;

        // Transistion
        if (this.isFrame) {
            this.frameTransition(cback);
        } else {
            this.crossfadeTransition(cback);
        }
    };

    Animator.prototype.frameTransition = function (cback) {
        var frameIndex,
            that = this;

        if (this.currentFrame === this.targetFrame) {
            if (cback) {
                cback();
            }
            return;
        }

        // Determine frame to animate and set necessary values
        if (this.targetFrame < this.currentFrame) {
            frameIndex = this.currentFrame;
            this.states[frameIndex].setOpacity(0);
            this.currentFrame = this.currentFrame - 1;
        } else {
            frameIndex = this.currentFrame + 1;
            this.states[frameIndex].setOpacity(1);
            this.currentFrame = frameIndex;
        }

        // Create callback
        function complete() {
            that.frameTransition(cback);
        }

        // Animate
        this.fade(frameIndex, this.transitionDuration, complete);
    };

    Animator.prototype.crossfadeTransition = function (cback) {
        if (this.currentFrame === this.targetFrame) {
            if (cback) {
                cback();
            }
            return;
        }

        var startFrame = this.currentFrame,
            nextFrame = (this.targetFrame < startFrame) ? startFrame - 1 : startFrame + 1,
            that = this;

        // Update current frame
        this.currentFrame = nextFrame;

        // Update opacities
        this.states[startFrame].setOpacity(0);
        this.states[nextFrame].setOpacity(1);

        // Create callback
        function complete() {
            that.crossfadeTransition();
        }

        // Animate - only one should have the callback to keep animation from moving to fast
        this.fade(startFrame, this.transitionDuration, complete);
        this.fade(nextFrame, this.transitionDuration);

        if (nextFrame === this.targetFrame && cback) {
            cback();
        }
    };

    Animator.prototype.fade = function (frameIndex, durration, callback) {
        // Start Animation
        $(this.frames[frameIndex]).animate({
            opacity: this.states[frameIndex].getOpacity()
        }, durration, callback);
    };

    return Animator;
}());

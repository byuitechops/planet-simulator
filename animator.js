"use strict";

function Frame(location, width, height) {
    this.file = location;
    this.opacity = 0;
    this.width = width;
    this.height = height;
    this.frameAmount = 1;
}

Frame.prototype.getFrameAmount = function () {
    return this.frameAmount;
}
Frame.prototype.getWidth = function () {
    return this.width;
}
Frame.prototype.getHeight = function () {
    return this.height;
}

Frame.prototype.setWidth = function (width) {
    this.width = width;
    return this;
}
Frame.prototype.setHeight = function (height) {
    this.height = height;
    return this;
}
Frame.prototype.getOpacity = function () {
    return this.opacity;
}
Frame.prototype.setOpacity = function (opactiy) {
    this.opacity = opactiy;
    return this;
}
Frame.prototype.getFile = function () {
    return this.file;
}
Frame.prototype.setFile = function (location) {
    this.file = location;
    return this;
}
Frame.prototype.setFrameAmount = function (amount) {
        this.frameAmount = amount;
        return this;
    }
/*
 * THE ANIMATOR CLASS
 */
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
	this.scale = scale;
}

Animator.prototype.display = function () {
        var currentAnimator = this;
        var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttributeNS(null, "id", this.getName());
		if (this.scale) {
			group.setAttributeNS(null, "transform", "translate(" + this.getX() + "," + this.getY() + ") scale(" + this.scale + ")");
		} else {
			group.setAttributeNS(null, "transform", "translate(" + this.getX() + "," + this.getY() + ")");
		}
        document.querySelector("#other_crap").appendChild(group);
        var items = this.states.map(function (frame, index) {


            var svg = $(currentAnimator.getName());
            var image;
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
            if (index <= currentAnimator.getTargetStep()) {
                frame.setOpacity(100);
            } else {
                frame.setOpacity(0);
                $(image).attr("opacity", "0");
            }
            var fadeOut = window.setInterval(function () {
                window.clearInterval(fadeOut);
            }, 1500);
            return frame;

        });

        return this;
    }

// Getters and Setters
Animator.prototype.getStates = function () {
    return this.states.map(function (x) {
        return x;
    });
}
Animator.prototype.getTargetStep = function () {
    return this.targetStep;
}
Animator.prototype.getName = function () {
    return this.Name;
}
Animator.prototype.getTransitionDuration = function () {
    return this.transitionDuration;
}
Animator.prototype.setStates = function () {
    this.states = states;
    return this;
}
Animator.prototype.setTargetStep = function (step) {
    if (step < 0) step = 0;
    if (step >= this.states.length) step = this.states.length - 1;
    this.targetStep = step;
    return this;
}
Animator.prototype.setName = function (Name) {
    this.Name = Name;
    return this;
}
Animator.prototype.setTransitionDuration = function (durration) {
    this.transitionDuration = durration;
    return this;
}
Animator.prototype.setX = function (x) {
    this.x = x;
    return this;
}
Animator.prototype.setY = function (y) {
    this.y = y;
    return this;
}
Animator.prototype.getX = function () {
    return this.x;
}
Animator.prototype.getY = function () {
    return this.y;
}

Animator.prototype.transitionToStep = function (targetStep) {
    // Dont move if you are already there
    if (targetStep === this.targetStep) return this;
    
    // Calculate frames per step
    var framesPerStep = Math.round((this.states.length) / 5);

    // Adjust duration
    this.setTransitionDuration(1500 / (Math.abs(this.targetStep - targetStep)) / framesPerStep);

    // Calculate target frame
    var targetFrame = targetStep * framesPerStep;

    // Update step and target frame
    this.targetStep = targetStep;
    this.targetFrame = targetFrame;

    // Transistion
    if (this.isFrame) {
        this.frameTransition();   
    } else {
        this.crossfadeTransition();
    }
}

Animator.prototype.frameTransition = function () {
    if (this.currentFrame === this.targetFrame) return;
    
    var frameIndex;
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
    var that = this;
    function complete() {
        that.frameTransition();
    }

    // Animate
    this.fade(frameIndex, this.transitionDuration, complete);
}

Animator.prototype.crossfadeTransition = function () {
    if (this.currentFrame === this.targetFrame) return;
    
    var startFrame = this.currentFrame;
    var nextFrame = (this.targetFrame < startFrame) ? startFrame - 1 : startFrame + 1;
    
    // Update current frame
    this.currentFrame = nextFrame;
    
    // Update opacities
    this.states[startFrame].setOpacity(0);
    this.states[nextFrame].setOpacity(1);
    
    // Create callback
    var that = this;
    function complete() {
        that.crossfadeTransition();
    }
    
    // Animate - only one should have the callback to keep animation from moving to fast
    this.fade(startFrame, this.transitionDuration, complete);
    this.fade(nextFrame, this.transitionDuration);
}

Animator.prototype.fade = function (frameIndex, durration, callback) {
    // Start Animation
    $(this.frames[frameIndex]).animate({
        opacity: this.states[frameIndex].getOpacity()
    }, durration, callback);
}

/* global settings, Snap, $*/
var Spotlights = (function () {

    /*
     * Spotlight Object
     * Creates a spotlight rect with the specified bounds and ID.
     * If an ID is not specified, a random one will be generated for it.
     */
    var light = function (x, y, width, height, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id || generateRandomCharacterString(12);

        // Renders the spotlight SVG
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttributeNS(null, "width", this.width);
        rect.setAttributeNS(null, "height", this.height);
        rect.setAttributeNS(null, "x", this.x);
        rect.setAttributeNS(null, "y", this.y);
        rect.setAttributeNS(null, "id", this.id);
        this.rect = rect;

    };

    var protoBaggins = light.prototype;

    /*
     * Location object contains:
     * x - the new x position
       y - the new y position
       width - new spotlight width
       height - new spotlight height
       scale:
            x - scales the object x by the specified amount
            y - scales the object y by the specified amount
       offset:
            x - offsets the object x by the specified amount
            y - offsets the object y by the specified amount
     * Moves the light to the specified bounds over the specified durration.
     * If no durration is specified, it will default to one second.
     * Once the light has reached the proper location, it will fire the callback.
     * If no callback is specified, it will just end the process.
     */
    protoBaggins.moveToDestination = function (position, durration, callback) {
        durration = durration || settings.SPOTLIGHT_MOVE_DURATION;
        //        console.log(position);
        if (!position.offset)
            position.offset = {};
        if (!position.offset.x)
            position.offset.x = 0;
        if (!position.offset.y)
            position.offset.y = 0;
        if (!position.scale)
            position.scale = {};
        if (!position.scale.x)
            position.scale.x = 1;
        if (!position.scale.y)
            position.scale.y = 1;

        if (!callback) callback = function () {};
        var that = this;
        var dest = {
            x: (position.x + position.offset.x) - (position.width * position.scale.x) / 2,
            y: (position.y + position.offset.y) - (position.height * position.scale.y) / 2,
            width: position.width * (position.scale.x),
            height: position.height * (position.scale.y)
        };
        Snap(this.rect).animate(dest, durration, function () {
            callback();
        });
    };

    /*
     * Updates the bounds of the spotlight object
     */
    protoBaggins.updateRectPositions = function () {
        this.rect.setAttributeNS(null, "width", this.width);
        this.rect.setAttributeNS(null, "height", this.height);
        this.rect.setAttributeNS(null, "x", this.x);
        this.rect.setAttributeNS(null, "y", this.y);
        this.rect.setAttributeNS(null, "id", this.id);
    };

    //generates a random number within the specified bounds.
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // creates a random character string with the specified length.
    function generateRandomCharacterString(length) {
        var stringz = [];
        for (var i = 0; i < length; i++)
            stringz.push(String.fromCharCode(getRandomInt(45, 91)));
        return stringz.join("").replace(/[^\w]|\d/g, function () {
            return String.fromCharCode(getRandomInt(65, 91));
        });
    }

    // Scene object
    var lightCrew = function (id) {
        this.id = id || generateRandomCharacterString(12);
        this.lights = [];

    };

    // Scene prototype
    var proto = lightCrew.prototype;

    /*
     * Creates a spotlight with the specified bounds and id.
     * If no ID is provided, a random one will be generated for it.
     * The generated light will then be added to the scene's lights array
     */
    proto.addLight = function (x, y, width, height, id) {
        var newSpot = new light(x, y, width, height, id);
        newSpot.rect.setAttributeNS(null, "fill", "url(#" + this.id + "Spotlight)");
        this.lights.push(newSpot);
        document.getElementById(this.id).appendChild(newSpot.rect);
    };


    /*
     * Deletes the scene from view
     */
    proto.deleteScene = function () {
        $("#" + this.id + "Group").remove();
    };

    proto.turnOnLights = function (durration, callback) {
        durration = durration || settings.TURN_ON_LIGHTS_LENGTH;
        this.generateScene(this.width, this.height, this.parent);
        var that = this;
        this.lights.forEach(function (light) {
            document.getElementById(that.id).appendChild(light.rect);
        });
        this.scene.setAttributeNS(null, "opacity", "0");
        if (!callback) callback = function () {};
        Snap.select("#" + this.id + "Group").animate({
            opacity: 1
        }, durration, function () {
            console.log("Done!");
            callback();
        });
    };
    proto.turnOffLights = function (durration, callback) {
        durration = durration || settings.TURN_OFF_LIGHTS_LENGTH;
        var that = this;
        if (!callback) callback = function () {};
        Snap.select("#" + this.id + "Group").animate({
            opacity: 0
        }, durration, function () {
            console.log("Done!");
            that.deleteScene();
            callback();
        });
    };

    // fires callback when all spotlights reach the destination
    var recieved = 0;

    function syncLandings(done) {
        if (++recieved >= this.lights.length) {
            done();
            recieved = 0;
        }
    }

    /*
     * Moves the spotlight at the specified index to the specified position over
     * the specified durration. The callback is fired when the spotlight is in 
     * position. When "all" is passed as the light all the lights will be moved 
     * to the specified location.
     *
     * Parameters:
     * light - index of the spotlight or "all" for all spotlights
     * position - see spotlight.moveToDestination for object reference
     * durration - time in ms for the light(s) to reach the position
     * callback - fucntion to run when the light(s) reach the position
     * 
     */
    proto.moveLightToLocation = function (light, position, durration, callback) {
        if (light < 0 || (typeof light === "string" && light.toLowerCase() === "all")) {

            this.lights.forEach(function (spot) {
                spot.moveToDestination(position, durration, function () {
                    syncLandings(callback);
                });
            });
            return;
        }
        this.lights[light].moveToDestination(position, durration, callback);
    };


    /*
     * Refreshes the scene.
     */
    proto.refreshScene = function () {
        if (!this.parent)
            return;
        this.deleteScene();
        this.generateScene(this.width, this.height, this.parent);
    };

    /*
     * Creates the dark canvas that the spotlights shine on with the specified width
     * and height. It then appends it to the specified parent node.
     * The parent parameter can either be a selector or a node.
     */
    proto.generateScene = function (width, height, parent) {
        //group 
        var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttributeNS(null, "id", this.id + "Group");
        var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        // GRADIENT
        var light = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
        light.setAttributeNS(null, "id", this.id + "Spotlight");
        var stopper1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stopper1.setAttributeNS(null, "offset", "70%");
        stopper1.setAttributeNS(null, "stop-color", "black");
        var stopper2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stopper2.setAttributeNS(null, "offset", "100%");
        stopper2.setAttributeNS(null, "stop-color", "transparent");
        light.appendChild(stopper1);
        light.appendChild(stopper2);
        defs.appendChild(light);
        //MASKS
        var mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
        mask.setAttributeNS(null, "id", this.id);
        var bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bg.setAttributeNS(null, "x", 0);
        bg.setAttributeNS(null, "y", 0);
        bg.setAttributeNS(null, "fill", "white");
        bg.setAttributeNS(null, "width", width);
        bg.setAttributeNS(null, "height", height);
        mask.appendChild(bg);
        defs.appendChild(mask);
        var scene = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        scene.setAttributeNS(null, "width", width);
        scene.setAttributeNS(null, "height", height);
        scene.setAttributeNS(null, "fill", "black");
        scene.setAttributeNS(null, "opacity", "0.78");
        scene.setAttributeNS(null, "mask", "url(#" + this.id + ")");
        scene.setAttributeNS(null, "x", 0);
        scene.setAttributeNS(null, "y", 0);
        scene.setAttributeNS(null, "id", this.id + "Scene");

        group.appendChild(defs);
        group.appendChild(scene);
        this.scene = group;
        this.parent = parent;
        this.width = width;
        this.height = height;
        $(parent).append(group);


    };
    return lightCrew;
}());

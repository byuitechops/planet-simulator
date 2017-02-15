var Spotlights = (function () {

    /*
     * Spotlight Object
     */
    var light = function (x, y, width, height, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id || generateRandomCharacterString(12);
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        rect.setAttributeNS(null, "width", this.width);
        rect.setAttributeNS(null, "height", this.height);
        rect.setAttributeNS(null, "x", this.x);
        rect.setAttributeNS(null, "y", this.y);
        rect.setAttributeNS(null, "id", this.id);
        this.rect = rect;

    };

    var protoBaggins = light.prototype;
    /*
     * Location object contains x,y,width,height,scale.x,scale.y,offset.x, offset.y 
     */
    protoBaggins.moveToDestination = function (position, durration = 1000, callback) {
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
            x: (position.x  + position.offset.x) - (position.width * position.scale.x) / 2,
            y: (position.y + position.offset.y) - (position.height * position.scale.y) / 2,
            width: position.width * (position.scale.x),
            height: position.height * (position.scale.y)
        }
        Snap(this.rect).animate(dest, durration, function(){
//            that.x = position.x + (position.width * position.scale.x) / 2 + position.offset.x,
//            that.y = position.y + (position.height * position.scale.y) / 2 + position.offset.y,
//            that.width = position.width * (position.scale.x + 0.2),
//            that.height = position.height * (position.scale.y + 0.2)
//            that.updateRectPositions();
            callback();
        });
    }
    protoBaggins.updateRectPositions = function(){
        this.rect.setAttributeNS(null, "width", this.width);
        this.rect.setAttributeNS(null, "height", this.height);
        this.rect.setAttributeNS(null, "x", this.x);
        this.rect.setAttributeNS(null, "y", this.y);
        this.rect.setAttributeNS(null, "id", this.id);
    }
    /*
     * Spotlight Manager
     */
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function generateRandomCharacterString(length) {
        var stringz = [];
        for (var i = 0; i < length; i++)
            stringz.push(String.fromCharCode(getRandomInt(45, 91)));
        return stringz.join("").replace(/[^\w]/g, function () {
            return String.fromCharCode(getRandomInt(65, 91));
        });
    }

    var lightCrew = function (id) {
        this.id = id || generateRandomCharacterString(12);
        this.lights = [];

    };
    var proto = lightCrew.prototype;
    proto.addLight = function(x, y, width, height, id){
        var newSpot = new light(x,y,width,height,id);
        newSpot.rect.setAttributeNS(null, "fill", "url(#"+this.id+"Spotlight)")
        this.lights.push(newSpot);
        document.getElementById(this.id).appendChild(newSpot.rect);
    }
    proto.deleteScene = function(){
            $("#"+this.id+"Group").remove();
    }
    var recieved = 0;
    function syncLandings(done){
        if(++recieved >= this.lights.length){
            done();
        }
    }
    proto.moveLightToLocation = function(light, position, durration, callback){
        if(light < 0 || (typeof light === "string" && light.toLowerCase() === "all")){
            
            this.lights.forEach(function(spot){
               spot.moveToDestination(position, durration, function(){
                  syncLandings(callback); 
               });
            });
            return;
        }
        this.lights[light].moveToDestination(position,durration,callback);
    }
    proto.refreshScene = function(){
        if(!this.parent)
            return;
        this.deleteScene();
        this.generateScene(this.width, this.height, this.parent);
    }
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
            scene.setAttributeNS(null, "opacity", "0.5");
            scene.setAttributeNS(null, "mask", "url(#"+this.id+")");
            scene.setAttributeNS(null, "x", 0);
            scene.setAttributeNS(null, "y", 0);
            scene.setAttributeNS(null, "id", this.id + "Scene");

            group.appendChild(defs);
            group.appendChild(scene);
            this.scene = group;
            this.parent = parent;
            this.width = width;
            this.height = height;
            $((typeof parent === "string") ? "#"+parent : parent).append(group);


        }
        /*
<defs>
    <radialGradient id="yolo">
        <stop offset="70%" stop-color="black" />
        <stop offset="100%" stop-color="transparent" />
    </radialGradient>
    <mask id="batman">
        <rect x="0" y="0" width="1000" height="1000" fill="white" />
        <rect id="anim1" x="105" y="105" width="100" height="100" fill="url(#yolo)" />
    </mask>

</defs>
<rect x='0' y='0' width='1000' height='1000' fill='yellow'></rect>
<rect x='0' y='0' width='1000' height='1000' mask="url(#batman)" fill='black' opacity=".5"></rect>
*/
    return lightCrew;
}());
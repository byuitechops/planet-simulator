var Spotlights = (function () {

    /*
     * Spotlight Object
     */
    var light = function (x, y, width, height, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id= id || generateRandomCharacterString(12);
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        rect.setAttributeNS(null, "width", this.width);
        rect.setAttributeNS(null, "height", this.height);
        rect.setAttributeNS(null, "x", this.x);
        rect.setAttributeNS(null, "y", this.y);
        rect.setAttributeNS(null, "id", this.id);
        console.log(rect);
        this.rect = rect;

    };    
    
    var protoBaggins = light.prototype;
    /*
     * Location object contains x,y,width,height,scale.x,scale.y,offset.x, offset.y 
     */
    protoBaggins.moveToDestination = function (location, durration = 1000, callback) {
        if (!location.offset)
            location.offset = {};
        if (!location.offset.x)
            location.offset.x = 0;
        if (!location.offset.y)
            location.offset.y = 0;
        if (!location.scale)
            location.scale = {};
        if (!location.scale.x)
            location.scale.x = 1;
        if (!location.scale.y)
            location.scale.y = 1;
        
        if(!callback) callback = function(){};
        $(this.rect).animate({
            x: location.x + (location.width * location.scale.x) / 2 + location.offset.x,
            y: location.y + (location.height * location.scale.y) / 2 + location.offset.y,
            width: location.width * (location.scale.x + 0.2),
            height: location.height * (location.scale.y + 0.2)
        }, durration, callback);
    }

    /*
     * Spotlight Manager
     */
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function generateRandomCharacterString(length){
        var stringz = [];
        for(var i = 0; i < length; i++)
            stringz.push(String.fromCharCode(getRandomInt(45,91)));
        return stringz.join("").replace(/[^\w]/g, function(){
            return String.fromCharCode(getRandomInt(65,91));
        });
    }
    
    var lightCrew = function (id) {
        this.id= id || generateRandomCharacterString(12);
        this.lights = [];
        console.log(this.id);

    };    
    var proto = lightCrew.prototype;
    proto.generateScene = function(width,height){
        var defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
        // GRADIENT
        var light = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
        light.setAttributeNS(null,"id",this.id+"Spotlight");
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
        bg.setAttributeNS(null,"x", 0);
        bg.setAttributeNS(null,"y", 0);
        bg.setAttributeNS(null,"width", width);
        bg.setAttributeNS(null,"height", height);
        mask.appendChild(bg);
        defs.appendChild(mask);
        console.log(defs);
        
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
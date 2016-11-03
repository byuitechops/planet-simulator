// creates spot in center
function createSpotlight(){
    var demo = document.getElementById("demo");

    var light_beam = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    light_beam.setAttributeNS(null, "id", "spotter");
    light_beam.setAttributeNS(null, "fill", "url('#light_beamz')");
    light_beam.setAttributeNS(null, "cx", "865");
    light_beam.setAttributeNS(null, "cy", "469");
    light_beam.setAttributeNS(null, "r", "2588");

    demo.appendChild(light_beam);

//    console.log(demo);
}

/*
 * Centers Spotlight at Specific x & y coords and ajusts the width and height accordingly
 */
function moveLightBeam(x,y, width, height, durration, callback){
    var light_beam = document.getElementById("spotter");

    var light_radius = document.getElementById("light_beamz");
    var stoppers = (light_radius.getElementsByTagName("stop"));

    var greatest = [width,height].sort().reverse()[0];
    greatest = pixelsToPercent(greatest, 2588)/2;
    greatest = Math.round(greatest * 1000) / 1000;
//    stoppers[0].setAttributeNS(null, "offset", greatest+"%");
//    stoppers[1].setAttributeNS(null, "offset", (greatest+2.5)+"%");

//    $("#spotter").animate({opacity:0},durration/2, function(){
//        light_beam.setAttributeNS(null, "cx", x);
//        light_beam.setAttributeNS(null, "cy", y);
//        $("#spotter").animate({opacity:1},durration/2, callback);
//    });
    
    $("#spotter").animate({opacity:1},durration/2);
    x = Math.round(x);
    y = Math.round(y);
    var interval,
        startPercent = getStopperPercent(stoppers[0]),
        startX = parseInt(light_beam.getAttributeNS(null, "cx")),
        startY = parseInt(light_beam.getAttributeNS(null, "cy")),
        percentIncrementor = (startPercent < greatest) ? .1 : -.1,
        xIncrementor = (startX < x) ? 5 : -5,
        yIncrementor = (startY < y) ? 5 : -5;

//    $("#spotter").animate({cx: x, cy:y},durration/2, callback);
    
    function animateBeam() {
        var currentPercent = getStopperPercent(stoppers[0]),
            currentX = parseInt(light_beam.getAttributeNS(null, "cx")),
            currentY = parseInt(light_beam.getAttributeNS(null, "cy"));
        if (currentX === x && currentY === y && currentPercent === greatest) {
            //Stop interval
            clearInterval(interval);
            callback();
            return;
        }
        if (currentPercent != greatest) {
            currentPercent += percentIncrementor;
            currentPercent = ((percentIncrementor < 0 && currentPercent < greatest)||(percentIncrementor > 0 && currentPercent > greatest)) ? greatest: currentPercent;
            stoppers[0].setAttributeNS(null, "offset", currentPercent+"%");
            stoppers[1].setAttributeNS(null, "offset", (currentPercent+2.5)+"%");
        }
        if (currentX != x) {
            currentX += xIncrementor;
            currentX = ((xIncrementor < 0 && currentX < x)||(xIncrementor > 0 && currentX > x)) ? x: currentX;
            light_beam.setAttributeNS(null, "cx", currentX);
        }
        if (currentY != y) {
            currentY += yIncrementor;
            currentY = ((yIncrementor < 0 && currentY < y)||(yIncrementor > 0 && currentY > y)) ? y: currentY;
            light_beam.setAttributeNS(null, "cy", currentY);
        }
    }
    
    interval = setInterval(animateBeam, 10);

}

function getStopperPercent (el) {
    var percent;
    percent = el.getAttributeNS(null, 'offset');
    percent = parseFloat(percent.slice(0, percent.indexOf('%')));
    return Math.round(percent * 1000) / 1000;
}

function percentToPixels(percent, size){
    return (percent/100)*size;
}

function pixelsToPercent(pixels, size){
    return (pixels/size)*100
}

//createSpotlight();


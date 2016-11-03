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

    console.log(demo);
}

/*
 * Centers Spotlight at Specific x & y coords
 */
function moveLightBeam(x,y, width, height, durration, callback){
    var light_beam = document.getElementById("spotter");

    var light_radius = document.getElementById("light_beamz");
    var stoppers = (light_radius.getElementsByTagName("stop"));

    var greatest = [width,height].sort().reverse()[0];
    console.log("Greatest" ,pixelsToPercent(greatest, 2588));
    greatest = pixelsToPercent(greatest, 2588)/2;
    stoppers[0].setAttributeNS(null, "offset", greatest+"%");
    stoppers[1].setAttributeNS(null, "offset", (greatest+2)+"%");

    $("#spotter").animate({opacity:0},durration/2, function(){
        light_beam.setAttributeNS(null, "cx", x);
        light_beam.setAttributeNS(null, "cy", y);
        $("#spotter").animate({opacity:1},durration/2, callback);
    });

}

function percentToPixels(percent, size){
    return (percent/100)*size;
}

function pixelsToPercent(pixels, size){
    return (pixels/size)*100
}

//createSpotlight();


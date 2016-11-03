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
function moveLightBeam(x,y, durration, callback){
    var light_beam = document.getElementById("spotter");
    $("#spotter").animate({opacity:0},durration/2, function(){
        light_beam.setAttributeNS(null, "cx", x);
        light_beam.setAttributeNS(null, "cy", y);
        $("#spotter").animate({opacity:1},durration/2, callback);
    });

}

//createSpotlight();


var containers = [
    {
        name: "floods",
        isFrame: true,
        items: 5,
        width: 392,
        height: 392,
        x: 205,
        y: 351,
        path: "./images/animations/flooding/flood",
        ext: ".png",
        scale:1.1
    }, {
        name: "iceCaps",
        isFrame: false,
        items: 5,
        width: 304,
        height: 392,
        x: 249,
        y: 351,
        path: "./images/animations/iceCaps/iceCap",
        ext: ".png",
        scale:1.1
    },
    {
        name: "lightRays",
        isFrame: true,
        items: 5,
        width: 334,
        height: 412,
        x: -4,
        y: 214,
        path: "./images/animations/lightRays/lightRay",
        ext: ".png"
    },
    {
        name: "c02Meter",
        isFrame: true,
        items: 9,
        width: 70,
        height: 135,
        x: 482,
        y: 281,
        path: "./images/animations/co2Meter/co2Meter",
        ext: ".png",
		scale: 4.3
    },
    {
        name: "tempMeter",
        isFrame: true,
        items: 9,
        width: 70,
        height: 135,
        x: 482,
        y: 281,
        path: "./images/animations/tempMeter/tempMeter",
        ext: ".png",
		scale: 4.25
    },
    {
        name: "mountains",
        isFrame: false,
        items: 5,
        width: 187,
        height: 238,
        x: 155,
        y: 456,
        path: "./images/animations/mountains/mountain",
        ext: ".png"
    },
/* Commented out because they were too darn ugly with the transparency issues!*/
//    {
//        name: "volcanoes",
//        isFrame: false,
//        items: 5,
//        width: 325,
//        height: 322,
//        x: 274,
//        y: 425,
//        path: "./images/animations/volcanoes/volcano",
//        ext: ".png"
//    },
    {
        name: "underwaterVolcanoes",
        isFrame: true,
        items: 5,
        width: 164,
        height: 305,
        x: 1287,
        y: 419,
        path: "./images/animations/underwaterVolcanoes/volcano",
        ext: ".gif"
    },
    {
        name: "seaSnow",
        isFrame: true,
        items: 5,
        width: 120,
        height: 216,
        x: 1165,
        y: 564,
        path: "./images/animations/seaSnow/seaSnow",
        ext: ".gif"
    },
    {
        name: "sediment",
        isFrame: true,
        items: 5,
        width: 129,
        height: 129,
        x: 978,
        y: 527,
        path: "./images/animations/sediment/sediment",
        ext: ".gif"
    },
    {
        name: "carbonateRock",
        isFrame: true,
        items: 5,
        width: 204,
        height: 168,
        x: 1396,
        y: 396,
        path: "./images/animations/carbonateRock/carbonateRock",
        ext: ".gif"
    },
    {
        name: "shadow",
        isFrame: true,
        items: 1,
        width: 392,
        height: 392,
        x: 205,
        y: 351,
        path: "./images/paper-doll/shadow",
        ext: ".png",
        scale:1.1
    },
];

var boxen = containers.map(function (container, index) {
    var frames = new Array(container.items);
    for (var i = 0; i < frames.length; i++) frames[i] = container.path + (i + 1) + container.ext;
    frames = frames.map(function (url) {
        var frame = new Frame(url, container.width, container.height);
        if (container.frames) frame.setFrameAmount(container.frames);
        return frame;
    });
    var box = new Animator(frames, container.isFrame, container.x, container.y, container.scale);
    return box.setName(container.name)
        .setTargetStep(0)
        .display();
});

// modified to make text clickable too
$("a, a + * + text").on("click", function () {
    var step = parseInt(this.parentElement.id.slice(-1),10) - 1;
    // Set active state
    $("#timeline g").removeClass("active");
	$(this.parentElement).addClass("active");
    transitionBoxen(step);
    // Transition to next step
//    boxen.forEach(function (box) {
//        box.transitionToStep(step);
//    });
});


/*
 * Steps through with spotlight
 * Centers Spotlight on specified x,y
 */

function transitionBoxen(step){
    var currentBoxen = 0;
    function loopBoxen(box){
        var cc = boxen[box];
        moveLightBeam(cc.x,cc.y, 1500,function(){
            cc.transitionToStep(step);
            window.setTimeout(function(){
                 currentBoxen++;
                if(currentBoxen < boxen.length)
                    loopBoxen(currentBoxen);
                else
                    $("#spotter").animate({opacity:0},0);
            },2500);
        });
    }

    loopBoxen(currentBoxen);
}

//creates spotlight
createSpotlight();
$("#spotter").animate({opacity:0},0);

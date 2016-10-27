//var containers = [
//    {
//        name: "meter",
//        isFrame: true,
//        items: 9,
//        width: 300,
//        height: 300,
//        x: 0,
//        y: 0,
//        path: "./GIF/Meter/thermometer",
//        ext: ".png"
//    },
//    {
//        name: "stackable",
//        isFrame: true,
//        items: 5,
//        width: 175,
//        height: 325,
//        x: 0,
//        y: 0,
//        path: "./GIF/Stackable/volcano",
//        ext: ".gif"
//    },
//    {
//        name: "crossfade",
//        isFrame: false,
//        items: 5,
//        width: 300,
//        height: 300,
//        x: 0,
//        y: 0,
//        path: "./GIF/Crossfade/mountain",
//        ext: ".png"
//    }
//];
//
//var boxen = containers.map(function (container, index) {
//    var frames = new Array(container.items);
//    for (var i = 0; i < frames.length; i++) frames[i] = container.path + (i + 1) + container.ext;
//    frames = frames.map(function (url) {
//        var frame = new Frame(url, container.width, container.height);
//        if (container.frames) frame.setFrameAmount(container.frames);
//        return frame;
//    });
//    var box = new Animator(frames, container.isFrame, index * 325, 0);
//    return box.setName(container.name)
//        .setTargetStep(0)
//        .display();
//});
//
//$("li").on("click", function () {
//    var step = parseInt($(this).text()) - 1;
//    // Set active state
//    $("li.active").removeClass("active");
//    $(this).addClass("active");
//    // Transition to next step
//    boxen.forEach(function (box) {
//        box.transitionToStep(step);
//    });
//});
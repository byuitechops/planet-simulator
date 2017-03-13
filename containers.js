/*
    205,351
    227,369
    22,18
 */

var containers = [
    {
        name: "sea",
        label: "Sea Level",
        isFrame: true,
        items: 5,
        width: 392,
        height: 392,
        x: 227,
        y: 369,
        path: "./images/animations/flooding/flood",
        ext: ".png",
        scale: 1,
        macaroni: {
            needed: false
        }
    },
    {
        name: "volcano",
        label: "Volcanic Activity",
        isFrame: true,
        items: 5,
        width: 401,
        height: 417,
        x: 229,
        y: 377,
        scale: 1,
        path: "./images/animations/volcanoes/volcano",
        ext: ".png",
        macaroni: {
            needed: false
        }
    },
    {
        name: "ice",
        label: "Ice",
        isFrame: false,
        items: 5,
        width: 304,
        height: 392,
        x: 271,
        y: 368,
        path: "./images/animations/iceCaps/iceCap",
        ext: ".png",
        scale: 1,
        macaroni: {
            needed: false
        }
    },
    {
        name: "insolation",
        label: "Insolation",
        isFrame: true,
        items: 5,
        width: 334,
        height: 412,
        x: -75,
        y: 150,
        path: "./images/animations/lightRays/lightRay",
        ext: ".png",
        macaroni: {
            needed: false
        }
    },
    {
        name: "mountain",
        label: "Mountains",
        isFrame: false,
        items: 5,
        width: 187,
        height: 238,
        x: 154,
        y: 459,
        scale: 1,
        path: "./images/animations/mountains/mountain",
        ext: ".png",
        macaroni: {
            needed: false
        }
    },
    {
        name: "co2",
        label: "CO<sub>2</sub>",
        isFrame: true,
        items: 9,
        width: 126,
        height: 440,
        x: 563,
        y: 346,
        path: "./images/animations/co2Meter/co2Meter",
        ext: ".png",
        macaroni: {
            needed: false
        }
    },

    {
        name: "temperature",
        label: "Temperature",
        isFrame: true,
        items: 9,
        width: 148,
        height: 522,
        x: 589,
        y: 307,
        path: "./images/animations/tempMeter/tempMeter",
        ext: ".png",
        macaroni: {
            needed: false
        }
    },
    {
        name: "underwaterVolcano",
        label: "Volcanic Activity",
        isFrame: true,
        items: 5,
        width: 164,
        height: 305,
        x: 1287,
        y: 330,
        path: "./images/animations/underwaterVolcanoes/volcano",
        ext: ".gif",
        scale: {
            x: 1,
            y: 1.3
        },
        macaroni: {
            needed: true,
            x: 1386,
            y: 653,
            mirrored: false,
            name: "underwaterVolcano"
        }
    },
    {
        name: "co3Desposition",
        label: "Carbonate Desposition",
        isFrame: true,
        items: 5,
        width: 120,
        height: 216,
        x: 1165,
        y: 564,
        path: "./images/animations/seaSnow/seaSnow",
        ext: ".gif",
        scale: {
            x: 1,
            y: 0.72
        },
        macaroni: {
            needed: true,
            x: 1215,
            y: 624,
            mirrored: false,
            name: "co3Desposition"
        }
    },
    {
        name: "sediment",
        label: "Sediment (Carbon Burrial)",
        isFrame: true,
        items: 5,
        width: 129,
        height: 129,
        x: 978,
        y: 527,
        path: "./images/animations/sediment/sediment",
        ext: ".gif",
        macaroni: {
            needed: true,
            x: 979,
            y: 642,
            mirrored: false,
            name: "sediment"
        }
    },
    {
        name: "weatheringCRelease",
        label: "Weathering (Carbon Release)",
        isFrame: true,
        items: 5,
        width: 204,
        height: 168,
        x: 1396,
        y: 396,
        path: "./images/animations/carbonateRock/carbonateRock",
        ext: ".gif",
        macaroni: {
            needed: true,
            x: 1560,
            y: 458,
            mirrored: true,
            name: "weatheringCRelease"

        }
    },
    {
        name: "weatheringCBurial",
        label: "Weathering (Carbon Burrial)",
        isFrame: true,
        items: 5,
        width: 23,
        height: 54,
        x: 994,
        y: 485,
        path: "./images/animations/MininMacaroniMeter/miniMacMeter",
        ext: ".png",
        macaroni: {
            needed: false
        }
    }
    //*/
];


var containerIndexes = {};
containers.forEach(function (container, index) {
    "use strict";
    containerIndexes[container.name] = index;
});

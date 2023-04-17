import { kMeans } from "./lib/calc.js";
import { createPalettes, deletePalettes } from "./lib/interface.js";
import { setupCamera } from "./lib/setup.js";
import { drawFrame } from "./lib/frame.js";
import { updateCameraCanvas } from "./lib/canvas.js";

// Camera Video Element

const cam = document.createElement("video");

// CVD Type Selector

const type = document.getElementById("type");

// Canvas for drawing camera frames

const camCanvas = document.createElement("canvas");
camCanvas.width = 0;
camCanvas.height = 0;

// Div for storing canvas element

const camDiv = document.getElementById("cam");
camDiv.appendChild(camCanvas);

// Context for getting pixels from frame

const camContext = camCanvas.getContext("2d", { willReadFrequently: true });

// Global variables used in the functions bellow

let hasVideoInput = false;
let w, h;
let camPixels;
let framerate = 1000 / 24;
let windowSizes = [ window.innerWidth, window.innerHeight ];

// Add toggle functionality to palette button

const paletteButton = document.getElementById("palette-button");
paletteButton.addEventListener("click", () => {
    if (cam.paused) {
        deletePalettes();
        cam.play()
    } else {
        cam.pause();
        createPalettes(kMeans(camPixels));
    }
});

// Setup Camera

window.addEventListener("load", () => {
    setupCamera(cam, camDiv, () => {
        hasVideoInput = true;
        [ windowSizes[0], windowSizes[1], w, h ] = updateCameraCanvas(camCanvas, windowSizes);
    })
});

// Loop for generating frames

const generateFrames = () => {
    if (hasVideoInput) {
        camPixels = drawFrame(cam, camContext, w, h);
    }
    setTimeout(generateFrames, framerate);
}
cam.addEventListener("playing", () => {
    generateFrames()
});

// Screen orientation responsiveness

window.matchMedia("(orientation: landscape)").addEventListener("change", () => {
    [ windowSizes[0], windowSizes[1], w, h ] = updateCameraCanvas(camCanvas, windowSizes);
});

// Update palettes when the user change the CVD type

type.addEventListener("change", () => {
    if (cam.paused) {
        setTimeout(() => {
            createPalettes(kMeans(camPixels));
        }, framerate) // wait for one frame to be generated before getting new palettes
    }
})  
import { setupCamera } from "./lib/setup.js";
import { drawFrame } from "./lib/frame.js";
import { updateCameraCanvas } from "./lib/canvas.js";

// Camera Video Element

const cam = document.createElement("video");

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

let hasVideoInput;
let w, h;
let camPixels;
let framerate = 1000 / 24;
let windowSizes = [ window.innerWidth, window.innerHeight ];

// Setup Camera

window.addEventListener("load", () => {
    setupCamera(cam, camDiv, () => {
        hasVideoInput = true;
        [ windowSizes[0], windowSizes[1], w, h ] = updateCameraCanvas(camCanvas, windowSizes);
    })
});

// Loop for generating frames

const generateFrames = () => {
    camPixels = drawFrame(cam, camContext, w, h);
    setTimeout(generateFrames, framerate);
}
cam.addEventListener("playing", () => {
    generateFrames()
});

// Screen orientation responsiveness

window.matchMedia("(orientation: landscape)").addEventListener("change", () => {
    [ windowSizes[0], windowSizes[1], w, h ] = updateCameraCanvas(camCanvas, windowSizes);
});
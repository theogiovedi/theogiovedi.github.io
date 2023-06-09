import { setupCamera } from "./lib/setup.js";
import { updateCameraCanvas } from "./lib/canvas.js";
import { drawSimulationFrame } from "./lib/frame.js";
import { menu } from "./lib/menu.js";
import { registerServiceWorker } from "./lib/pwa.js";
import { framerate } from "./lib/framerate.js";

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

let w, h;
let windowSizes = [window.innerWidth, window.innerHeight];

// Setup Camera

window.addEventListener("load", () => {
  setupCamera(cam, camDiv, () => {
    [windowSizes[0], windowSizes[1], w, h] = updateCameraCanvas(
      camCanvas,
      windowSizes
    );
  });
});

// Loop for generating frames

cam.addEventListener("playing", () => {
  setInterval(() => {
    drawSimulationFrame(cam, camContext, type, w, h);
  }, framerate);
});

// Screen orientation responsiveness

window.matchMedia("(orientation: landscape)").addEventListener("change", () => {
  [windowSizes[0], windowSizes[1], w, h] = updateCameraCanvas(
    camCanvas,
    windowSizes
  );
});

menu();

registerServiceWorker();

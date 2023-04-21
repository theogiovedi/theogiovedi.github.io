import { updatePhotoCanvas } from "./lib/canvas.js";
import { drawFrame } from "./lib/frame.js";
import { setupPhoto } from "./lib/setup.js"

// File Input Element

const file = document.getElementById("file");

// CVD Type Selector

const type = document.getElementById("type");

// Photo Element
const photo = document.createElement("img");
photo.style.display = "none";

// Canvas for drawing the photo

const photoCanvas = document.createElement("canvas");
photoCanvas.width = 0;
photoCanvas.height = 0;

// Div for storing canvas element

const photoDiv = document.getElementById("photo");
photoDiv.appendChild(photoCanvas);

// Context for getting pixels from photo

const photoContext = photoCanvas.getContext("2d", { willReadFrequently: true });

// Global Variables

let w, h;
let windowSizes = [ window.innerWidth, window.innerHeight ];

// Setup photo when user enters a file into file input

file.addEventListener("change", () => {
    setupPhoto(type, photo, file);
});

// Update photo when the user change the CVD type

type.addEventListener("change", () => {
    drawFrame(photo, photoContext, type, w, h);
});

// Update canvas and frame when image ends loading

photo.addEventListener("load", () => {
    [ w, h ] = updatePhotoCanvas(photoCanvas, windowSizes[0], photo.naturalWidth, photo.naturalHeight); // only update new height and width, without screen orientation change
    drawFrame(photo, photoContext, type, w, h);
});

// Screen orientation responsiveness

window.matchMedia("(orientation: portrait)").addEventListener("change", () => {
    [ windowSizes[0], windowSizes[1] ] = [ windowSizes[1], windowSizes[0] ]
    if (photo.src) {
        [ w, h ] = updatePhotoCanvas(photoCanvas, windowSizes[0], photo.naturalWidth, photo.naturalHeight);
        drawFrame(photo, photoContext, type, w, h);
    }
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .catch(() => console.log("Erro: Não foi possível registrar o Service Worker"))
    });
}
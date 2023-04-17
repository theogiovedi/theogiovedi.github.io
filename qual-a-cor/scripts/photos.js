import { updatePhotoCanvas } from "./lib/canvas.js";
import { drawFrame } from "./lib/frame.js";
import { setupPhoto } from "./lib/setup.js"

const file = document.getElementById("file");
const type = document.getElementById("type");
const photo = document.createElement("img");
photo.style.display = "none";
const photoCanvas = document.createElement("canvas");
photoCanvas.width = 0;
photoCanvas.height = 0;
const photoDiv = document.getElementById("photo");
photoDiv.appendChild(photoCanvas);
const photoContext = photoCanvas.getContext("2d", { willReadFrequently: true });

let w, h;
let windowSizes = [ window.innerWidth, window.innerHeight ];

file.addEventListener("change", () => {
    setupPhoto(type, photo, file);
});

type.addEventListener("change", () => {
    drawFrame(photo, photoContext, w, h);
});

photo.addEventListener("load", () => {
    [ w, h ] = updatePhotoCanvas(photoCanvas, photo.naturalWidth, photo.naturalHeight); // only update new height and width, without screen orientation change
    drawFrame(photo, photoContext, w, h);
});

window.matchMedia("(orientation: portrait)").addEventListener("change", () => {
    [ windowSizes[0], windowSizes[1] ] = [ windowSizes[1], windowSizes[0] ]
    [ w, h ] = updatePhotoCanvas(photoCanvas, photo.naturalWidth, photo.naturalHeight);
    drawFrame(photo, photoContext, w, h);
});
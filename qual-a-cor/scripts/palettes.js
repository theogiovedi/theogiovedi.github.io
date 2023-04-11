import { getClosestColor, rgbToHex } from "./calc.js";
import { getColorName } from "./colors.js";

const cam = document.createElement("video");
const camCanvas = document.createElement("canvas");
const camDiv = document.getElementById("cam");
const color1Element = document.createElement("p");
const color2Element = document.createElement("p");
const color3Element = document.createElement("p");
const color4Element = document.createElement("p");
camDiv.appendChild(camCanvas);
camDiv.appendChild(color1Element);
camDiv.appendChild(color2Element);
camDiv.appendChild(color3Element);
camDiv.appendChild(color4Element);
const errorMessage = document.createElement("p");
const camContext = camCanvas.getContext("2d", { willReadFrequently: true });
let hasVideoInput = false;
let w, h;

function updateCameraCanvas() {
    w = window.innerWidth - 40;
    if (w > 600) {
        w = 600;
    }
    if (window.innerWidth < window.innerHeight) {
        h = w * 4 / 3;
    }
    else {
        h = w * 3 / 4;
    }
    camCanvas.width = w;
    camCanvas.height = h;
}

function camSetup() {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => {
            if (device.kind == "videoinput") {
                hasVideoInput = true;
            }
        })
    }).catch(() => {
        errorMessage.innerHTML = "Erro: Não foi possível verificar se seu navegador possui uma câmera";
        camDiv.appendChild(errorMessage);
        return;
    }).then(() => {
        if (!hasVideoInput) {
            errorMessage.innerHTML = "Erro: Seu navegador não possui uma câmera";
            camDiv.appendChild(errorMessage);
            return;
        } else {
            navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                },
                audio: false
            }).then(stream => {
                cam.srcObject = stream;
                cam.play();
            });
            cam.style.display = "none";
            updateCameraCanvas();
        }
    });
}

function camDraw() {

    if (!hasVideoInput) {
        return;
    }

    camContext.drawImage(cam, 0, 0, w, h);
    getPalette();
    setTimeout(camDraw, 1000 / 24); // 24fps
}

function getPalette() {
    let camPixels = camContext.getImageData(0, 0, w, h);

    // Mean Cut Algorithm to determine the most dominant colors in an image

    // Part 1: Determine the color channel (R, G or B) with the largest range

    let rgb = [];
    let redMax = 0, greenMax = 0, blueMax = 0;
    let redMin = 255, greenMin = 255, blueMin = 255;
    for (let i = 0; i < camPixels.data.length; i += 4) {
        rgb.push([
            camPixels.data[i],
            camPixels.data[i + 1],
            camPixels.data[i + 2]
        ]);
        redMax = Math.max(rgb[rgb.length - 1][0], redMax);
        greenMax = Math.max(rgb[rgb.length - 1][1], greenMax);
        blueMax = Math.max(rgb[rgb.length - 1][2], blueMax);

        redMin = Math.min(rgb[rgb.length - 1][0], redMin);
        greenMin = Math.min(rgb[rgb.length - 1][1], greenMin);
        blueMin = Math.min(rgb[rgb.length - 1][2], blueMin);
    }
    let redRange = redMax - redMin;
    let greenRange = greenMax - greenMin;
    let blueRange = blueMax - blueMin;
    let maxRange = Math.min(redRange, greenRange, blueRange);
    let maxRangeChannel;
    if (maxRange === redRange) {
        maxRangeChannel = 0;
    } else if (maxRangeChannel === blueRange) {
        maxRangeChannel = 1;
    } else {
        maxRangeChannel = 2;
    }

    // Part 2: Sort the pixels according with the greatest range channel

    rgb.sort((firstPixel, secondPixel) => firstPixel[maxRangeChannel] - secondPixel[maxRangeChannel]);

    // Part 3: Divide the pixels into buckets, according with the number of dominant colors we want

    // In this specific case, we want 4 colors, i.e., 4 buckets

    let mean = Math.floor(rgb.length / 2);
    let upperHalf = rgb.slice(0, mean);
    let lowerHalf = rgb.slice(mean + 1);

    let buckets = [];

    mean = Math.floor(upperHalf.length / 2);
    buckets.push(upperHalf.slice(0, mean));
    buckets.push(upperHalf.slice(mean + 1));

    mean = Math.floor(lowerHalf.length / 2);
    buckets.push(lowerHalf.slice(0, mean));
    buckets.push(lowerHalf.slice(mean + 1));

    // Part 4: Get the 4 most dominant colors by getting the average of the pixels of each bucket

    let colorSum = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            colorSum[i][0] += buckets[i][j][0];
            colorSum[i][1] += buckets[i][j][1];
            colorSum[i][2] += buckets[i][j][2];
        }
    }

    let color1 = [Math.floor(colorSum[0][0] / buckets[0].length), Math.floor(colorSum[0][1] / buckets[0].length), Math.floor(colorSum[0][2] / buckets[0].length)];
    let color2 = [Math.floor(colorSum[1][0] / buckets[1].length), Math.floor(colorSum[1][1] / buckets[1].length), Math.floor(colorSum[1][2] / buckets[1].length)];
    let color3 = [Math.floor(colorSum[2][0] / buckets[2].length), Math.floor(colorSum[2][1] / buckets[2].length), Math.floor(colorSum[2][2] / buckets[2].length)];
    let color4 = [Math.floor(colorSum[3][0] / buckets[3].length), Math.floor(colorSum[3][1] / buckets[3].length), Math.floor(colorSum[3][2] / buckets[3].length)];

    color1Element.innerHTML = `<div class="color-square" style="background-color: rgb(${color1[0]}, ${color1[1]}, ${color1[2]})"></div>${getColorName(getClosestColor(rgbToHex(color1[0], color1[1], color1[2])))}`;
    color2Element.innerHTML = `<div class="color-square" style="background-color: rgb(${color2[0]}, ${color2[1]}, ${color2[2]})"></div>${getColorName(getClosestColor(rgbToHex(color2[0], color2[1], color2[2])))}`;
    color3Element.innerHTML = `<div class="color-square" style="background-color: rgb(${color3[0]}, ${color3[1]}, ${color3[2]})"></div>${getColorName(getClosestColor(rgbToHex(color3[0], color3[1], color3[2])))}`;
    color4Element.innerHTML = `<div class="color-square" style="background-color: rgb(${color4[0]}, ${color4[1]}, ${color4[2]})"></div>${getColorName(getClosestColor(rgbToHex(color4[0], color4[1], color4[2])))}`;
};

window.addEventListener("load", camSetup);
cam.addEventListener("playing", camDraw);

let viewport = window.matchMedia("(orientation: landscape)")
viewport.addEventListener("change", updateCameraCanvas);
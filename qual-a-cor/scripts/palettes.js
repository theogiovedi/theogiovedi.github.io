import { rgbToHex, getClosestColor } from "./calc.js";
import { getColorName } from "./colors.js";

const cam = document.createElement("video");
const type = document.getElementById("type").value;
const camCanvas = document.createElement("canvas");
camCanvas.width = 0;
camCanvas.height = 0;
const camDiv = document.getElementById("cam");
camDiv.appendChild(camCanvas);
const paletteButton = document.getElementById("palette-button");
const color1Element = document.getElementById("color1");
color1Element.style.display = 'none';
const color2Element = document.getElementById("color2");
color2Element.style.display = 'none';
const color3Element = document.getElementById("color3");
color3Element.style.display = 'none';
const color4Element = document.getElementById("color4");
color4Element.style.display = 'none';
const errorMessage = document.createElement("p");
const camContext = camCanvas.getContext("2d", { willReadFrequently: true });
let hasVideoInput = false;
let w, h;

let windowSizes = [window.innerWidth, window.innerHeight]
let isPaused = false;

function updateCanvas() {
    w = windowSizes[0] - 40;
    if (w > 600) {
        w = 600;
    }
    if (windowSizes[0] < windowSizes[1]) {
        h = w * 4 / 3;
    }
    else {
        h = w * 3 / 4;
    }
    camCanvas.width = w;
    camCanvas.height = h;
    windowSizes = [windowSizes[1], windowSizes[0]];
}

function camSetup() {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => {
            if (device.kind == "videoinput") {
                hasVideoInput = true;
            }
        })
    }).catch(() => {
        outerHeight
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
            updateCanvas();
        }
    });
}

function camDraw() {
    if (!hasVideoInput) {
        return;
    }

    if (!isPaused) {
        camContext.drawImage(cam, 0, 0, w, h);
        let camPixels = camContext.getImageData(0, 0, w, h);

        const type = document.getElementById("type").value;
        switch (type) {
            case "normal":
                break;
            case "prot":
                for (let i = 0; i < camPixels.data.length; i += 4) {
                    const rgb = [
                        camPixels.data[i] / 255,
                        camPixels.data[i + 1] / 255,
                        camPixels.data[i + 2] / 255
                    ]

                    camPixels.data[i] = ((rgb[0] * 0.152286) + (rgb[1] * 1.052583) + (rgb[2] * -0.204868)) * 255;
                    camPixels.data[i + 1] = ((rgb[0] * 0.114503) + (rgb[1] * 0.786281) + (rgb[2] * 0.099216)) * 255;
                    camPixels.data[i + 2] = ((rgb[0] * -0.003882) + (rgb[1] * -0.048116) + (rgb[2] * 1.051998)) * 255;
                }
                break;
            case "deut":
                for (let i = 0; i < camPixels.data.length; i += 4) {
                    const rgb = [
                        camPixels.data[i] / 255,
                        camPixels.data[i + 1] / 255,
                        camPixels.data[i + 2] / 255
                    ]

                    camPixels.data[i] = ((rgb[0] * 0.367322) + (rgb[1] * 0.860646) + (rgb[2] * -0.227968)) * 255;
                    camPixels.data[i + 1] = ((rgb[0] * 0.280085) + (rgb[1] * 0.672501) + (rgb[2] * 0.047413)) * 255;
                    camPixels.data[i + 2] = ((rgb[0] * -0.011820) + (rgb[1] * 0.042940) + (rgb[2] * 0.968881)) * 255;
                }
                break;
            case "trit":
                for (let i = 0; i < camPixels.data.length; i += 4) {
                    const rgb = [
                        camPixels.data[i] / 255,
                        camPixels.data[i + 1] / 255,
                        camPixels.data[i + 2] / 255
                    ]

                    camPixels.data[i] = ((rgb[0] * 1.255528) + (rgb[1] * -0.076749) + (rgb[2] * -0.178779)) * 255;
                    camPixels.data[i + 1] = ((rgb[0] * -0.078411) + (rgb[1] * 0.930809) + (rgb[2] * 0.147602)) * 255;
                    camPixels.data[i + 2] = ((rgb[0] * 0.004733) + (rgb[1] * 0.691367) + (rgb[2] * 0.303900)) * 255;
                }
                break;
        }
        camContext.putImageData(camPixels, 0, 0);
    }

    setTimeout(camDraw, 1000 / 24); // 24fps
}


function getPalette() {
    let camPixels = camContext.getImageData(0, 0, w, h);

    // K-means algorithm for extracting a palette of 4 colors

    let k = 4;
    let sum = new Array(k);
    let clusterLength = new Array(k);
    let centroids = new Array(k);

    // Forgy's Initialization: Randomly choosing k observations from data set
    for (let i = 0; i < k; i++) {
        let random = Math.floor(Math.random() * camPixels.data.length);
        centroids[i] = [ 
            camPixels.data[random - (random % 4)], // get the nearest multiple of 4 less than random
            camPixels.data[random - (random % 4) + 1], 
            camPixels.data[random - (random % 4) + 2]
        ];
        sum[i] = [ 0, 0, 0 ];
        clusterLength[i] = 0;
    }
    
    for (let i = 0; i < camPixels.data.length; i += 4) {

        // Assign the observation to the closest cluster

        let rgb = [
            camPixels.data[i],
            camPixels.data[i + 1],
            camPixels.data[i + 2]
        ];

        let euclideanDistance;
        let closestEuclideanDistance = Number.MAX_VALUE;
        let closestCentroid;
        
        for (let j = 0; j < centroids.length; j++) {
            euclideanDistance = Math.sqrt(Math.pow(rgb[0] - centroids[j][0], 2) + Math.pow(rgb[1] - centroids[j][1], 2) + Math.pow(rgb[2] - centroids[j][2], 2));
            if (euclideanDistance < closestEuclideanDistance) {
                closestEuclideanDistance = euclideanDistance;
                closestCentroid = j;
            }
        }

        clusterLength[closestCentroid]++;

        // Update the centroid
    
        sum[closestCentroid][0] += rgb[0];
        sum[closestCentroid][1] += rgb[1];
        sum[closestCentroid][2] += rgb[2];

        centroids[closestCentroid][0] = sum[closestCentroid][0] / clusterLength[closestCentroid];
        centroids[closestCentroid][1] = sum[closestCentroid][1] / clusterLength[closestCentroid];
        centroids[closestCentroid][2] = sum[closestCentroid][2] / clusterLength[closestCentroid];
    }
    
    for (let i = 0; i < k; i++) {
        centroids[i][0] = Math.floor(centroids[i][0]);
        centroids[i][1] = Math.floor(centroids[i][1]);
        centroids[i][2] = Math.floor(centroids[i][2]);
    }

    let color1 = centroids[0];
    let color2 = centroids[1];
    let color3 = centroids[2];
    let color4 = centroids[3];

    console.log(color1[0], color1[1], color1[2])
    console.log(color2[0], color2[1], color2[2])
    console.log(color3[0], color3[1], color3[2])
    console.log(color4[0], color4[1], color4[2])

    color1Element.innerHTML = `<div class="color-square" style="background-color: rgb(${color1[0]}, ${color1[1]}, ${color1[2]})"></div>${getColorName(getClosestColor(rgbToHex(color1[0], color1[1], color1[2])))}`;
    color2Element.innerHTML = `<div class="color-square" style="background-color: rgb(${color2[0]}, ${color2[1]}, ${color2[2]})"></div>${getColorName(getClosestColor(rgbToHex(color2[0], color2[1], color2[2])))}`;
    color3Element.innerHTML = `<div class="color-square" style="background-color: rgb(${color3[0]}, ${color3[1]}, ${color3[2]})"></div>${getColorName(getClosestColor(rgbToHex(color3[0], color3[1], color3[2])))}`;
    color4Element.innerHTML = `<div class="color-square" style="background-color: rgb(${color4[0]}, ${color4[1]}, ${color4[2]})"></div>${getColorName(getClosestColor(rgbToHex(color4[0], color4[1], color4[2])))}`;

    paletteButton.innerHTML = "Apagar paleta"
    color1Element.style.display = "block";
    color2Element.style.display = "block";
    color3Element.style.display = "block";
    color4Element.style.display = "block";
};

function deletePalette() {
    paletteButton.innerHTML = "Extrair paleta"
    color1Element.style.display = "none";
    color2Element.style.display = "none";
    color3Element.style.display = "none";
    color4Element.style.display = "none";
}

paletteButton.addEventListener("click", () => {
    if (isPaused) {
        deletePalette();
    } else {
        getPalette();
    }
    isPaused = !isPaused;
    console.log(isPaused);
})

window.addEventListener("load", camSetup);
cam.addEventListener("playing", camDraw);

window.matchMedia("(orientation: landscape)").addEventListener("change", updateCanvas);
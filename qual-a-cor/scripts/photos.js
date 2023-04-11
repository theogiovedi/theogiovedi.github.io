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

let windowSizes = [ window.innerWidth, window.innerHeight ]

function toggleOrientation() {
    windowSizes = [ windowSizes[1], windowSizes[0] ];
}

function updateCanvas() {
    if (!photo.src) {
        return;
    }
    w = windowSizes[0] - 40;
    if (w > 600) {
        w = 600;
    }
    h = w * (photo.naturalHeight / photo.naturalWidth);
    photoCanvas.width = w;
    photoCanvas.height = h;
}

function showPhoto() {
    if (!photo.src) {
        return;
    }
    photoContext.drawImage(photo, 0, 0, w, h);
    let photoPixels = photoContext.getImageData(0, 0, w, h);

    switch (type.value) {
        case "normal":
            break;
        case "prot":
            for (let i = 0; i < photoPixels.data.length; i += 4) {
                const rgb = [
                    [photoPixels.data[i] / 255],
                    [photoPixels.data[i + 1] / 255],
                    [photoPixels.data[i + 2] / 255]
                ]

                const matrix = [
                    [0.152286, 1.052583, -0.204868],
                    [0.114503, 0.786281, 0.099216],
                    [-0.003882, -0.048116, 1.051998]
                ]

                const simulatedRgb = [
                    [(rgb[0][0] * matrix[0][0]) + (rgb[1][0] * matrix[0][1]) + (rgb[2][0] * matrix[0][2])],
                    [(rgb[0][0] * matrix[1][0]) + (rgb[1][0] * matrix[1][1]) + (rgb[2][0] * matrix[1][2])],
                    [(rgb[0][0] * matrix[2][0]) + (rgb[1][0] * matrix[2][1]) + (rgb[2][0] * matrix[2][2])]
                ]

                if (simulatedRgb[0][0] < 0) {
                    simulatedRgb[0][0] = 0;
                } else if (simulatedRgb[0][0] > 1) {
                    simulatedRgb[0][0] = 1;
                }

                if (simulatedRgb[1][0] < 0) {
                    simulatedRgb[1][0] = 0;
                } else if (simulatedRgb[1][0] > 1) {
                    simulatedRgb[1][0] = 1;
                }


                if (simulatedRgb[2][0] < 0) {
                    simulatedRgb[2][0] = 0;
                } else if (simulatedRgb[2][0] > 1) {
                    simulatedRgb[2][0] = 1;
                }

                photoPixels.data[i] = Math.floor(simulatedRgb[0][0] * 255);
                photoPixels.data[i + 1] = Math.floor(simulatedRgb[1][0] * 255);
                photoPixels.data[i + 2] = Math.floor(simulatedRgb[2][0] * 255);
            }
            break;
        case "deut":
            for (let i = 0; i < photoPixels.data.length; i += 4) {
                const rgb = [
                    [photoPixels.data[i] / 255],
                    [photoPixels.data[i + 1] / 255],
                    [photoPixels.data[i + 2] / 255]
                ]

                const matrix = [
                    [0.367322, 0.860646, -0.227968],
                    [0.280085, 0.672501, 0.047413],
                    [-0.011820, 0.042940, 0.968881]
                ]

                const simulatedRgb = [
                    [(rgb[0][0] * matrix[0][0]) + (rgb[1][0] * matrix[0][1]) + (rgb[2][0] * matrix[0][2])],
                    [(rgb[0][0] * matrix[1][0]) + (rgb[1][0] * matrix[1][1]) + (rgb[2][0] * matrix[1][2])],
                    [(rgb[0][0] * matrix[2][0]) + (rgb[1][0] * matrix[2][1]) + (rgb[2][0] * matrix[2][2])]
                ]

                if (simulatedRgb[0][0] < 0) {
                    simulatedRgb[0][0] = 0;
                } else if (simulatedRgb[0][0] > 1) {
                    simulatedRgb[0][0] = 1;
                }

                if (simulatedRgb[1][0] < 0) {
                    simulatedRgb[1][0] = 0;
                } else if (simulatedRgb[1][0] > 1) {
                    simulatedRgb[1][0] = 1;
                }


                if (simulatedRgb[2][0] < 0) {
                    simulatedRgb[2][0] = 0;
                } else if (simulatedRgb[2][0] > 1) {
                    simulatedRgb[2][0] = 1;
                }

                photoPixels.data[i] = Math.floor(simulatedRgb[0][0] * 255);
                photoPixels.data[i + 1] = Math.floor(simulatedRgb[1][0] * 255);
                photoPixels.data[i + 2] = Math.floor(simulatedRgb[2][0] * 255);
            }
            break;
        case "trit":
            for (let i = 0; i < photoPixels.data.length; i += 4) {
                const rgb = [
                    [photoPixels.data[i] / 255],
                    [photoPixels.data[i + 1] / 255],
                    [photoPixels.data[i + 2] / 255]
                ]

                const matrix = [
                    [1.255528, -0.076749, -0.178779],
                    [-0.078411, 0.930809, 0.147602],
                    [0.004733, 0.691367, 0.303900]
                ]

                const simulatedRgb = [
                    [(rgb[0][0] * matrix[0][0]) + (rgb[1][0] * matrix[0][1]) + (rgb[2][0] * matrix[0][2])],
                    [(rgb[0][0] * matrix[1][0]) + (rgb[1][0] * matrix[1][1]) + (rgb[2][0] * matrix[1][2])],
                    [(rgb[0][0] * matrix[2][0]) + (rgb[1][0] * matrix[2][1]) + (rgb[2][0] * matrix[2][2])]
                ]

                if (simulatedRgb[0][0] < 0) {
                    simulatedRgb[0][0] = 0;
                } else if (simulatedRgb[0][0] > 1) {
                    simulatedRgb[0][0] = 1;
                }

                if (simulatedRgb[1][0] < 0) {
                    simulatedRgb[1][0] = 0;
                } else if (simulatedRgb[1][0] > 1) {
                    simulatedRgb[1][0] = 1;
                }


                if (simulatedRgb[2][0] < 0) {
                    simulatedRgb[2][0] = 0;
                } else if (simulatedRgb[2][0] > 1) {
                    simulatedRgb[2][0] = 1;
                }

                photoPixels.data[i] = Math.floor(simulatedRgb[0][0] * 255);
                photoPixels.data[i + 1] = Math.floor(simulatedRgb[1][0] * 255);
                photoPixels.data[i + 2] = Math.floor(simulatedRgb[2][0] * 255);
            }
            break;
    }

    photoContext.putImageData(photoPixels, 0, 0);
}

function loadPhoto() {
    type.style.display = "block";
    photo.src = URL.createObjectURL(file.files[0]);
}

file.addEventListener("change", loadPhoto);
type.addEventListener("change", showPhoto);
photo.addEventListener("load", () => {
    updateCanvas();
    showPhoto();
});

let screenOrientation = window.matchMedia("(orientation: portrait)")
screenOrientation.addEventListener("change", () => {
    toggleOrientation();
    updateCanvas();
    showPhoto();
});
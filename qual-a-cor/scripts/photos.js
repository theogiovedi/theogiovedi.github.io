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
                    photoPixels.data[i] / 255,
                    photoPixels.data[i + 1] / 255,
                    photoPixels.data[i + 2] / 255
                ]

                photoPixels.data[i] = ((rgb[0] * 0.152286) + (rgb[1] * 1.052583) + (rgb[2] * -0.204868)) * 255;
                photoPixels.data[i + 1] = ((rgb[0] * 0.114503) + (rgb[1] * 0.786281) + (rgb[2] * 0.099216)) * 255;
                photoPixels.data[i + 2] = ((rgb[0] * -0.003882) + (rgb[1] * -0.048116) + (rgb[2] * 1.051998)) * 255;
            }
            break;
        case "deut":
            for (let i = 0; i < photoPixels.data.length; i += 4) {
                const rgb = [
                    photoPixels.data[i] / 255,
                    photoPixels.data[i + 1] / 255,
                    photoPixels.data[i + 2] / 255
                ]

                photoPixels.data[i] = ((rgb[0] * 0.367322) + (rgb[1] * 0.860646) + (rgb[2] * -0.227968)) * 255;
                photoPixels.data[i + 1] = ((rgb[0] * 0.280085) + (rgb[1] * 0.672501) + (rgb[2] * 0.047413)) * 255;
                photoPixels.data[i + 2] = ((rgb[0] * -0.011820) + (rgb[1] * 0.042940) + (rgb[2] * 0.968881)) * 255;
            }
            break;
        case "trit":
            for (let i = 0; i < photoPixels.data.length; i += 4) {
                const rgb = [
                    photoPixels.data[i] / 255,
                    photoPixels.data[i + 1] / 255,
                    photoPixels.data[i + 2] / 255
                ]

                photoPixels.data[i] = ((rgb[0] * 1.255528) + (rgb[1] * -0.076749) + (rgb[2] * -0.178779)) * 255;
                photoPixels.data[i + 1] = ((rgb[0] * -0.078411) + (rgb[1] * 0.930809) + (rgb[2] * 0.147602)) * 255;
                photoPixels.data[i + 2] = ((rgb[0] * 0.004733) + (rgb[1] * 0.691367) + (rgb[2] * 0.303900)) * 255;
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

window.matchMedia("(orientation: portrait)").addEventListener("change", () => {
    toggleOrientation();
    updateCanvas();
    showPhoto();
});
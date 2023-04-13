const cam = document.createElement("video");
const type = document.getElementById("type").value;
const camCanvas = document.createElement("canvas");
camCanvas.width = 0;
camCanvas.height = 0;
const camDiv = document.getElementById("cam");
camDiv.appendChild(camCanvas);
const errorMessage = document.createElement("p");
const camContext = camCanvas.getContext("2d", { willReadFrequently: true });
let hasVideoInput = false;
let w, h;

let windowSizes = [ window.innerWidth, window.innerHeight ]

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
    windowSizes = [ windowSizes[1], windowSizes[0] ];
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
            updateCanvas();
        }
    });
}

function camDraw() {
    if (!hasVideoInput) {
        return;
    }

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
    setTimeout(camDraw, 1000 / 24); // 24fps
}

window.addEventListener("load", camSetup);

cam.addEventListener("playing", camDraw);

window.matchMedia("(orientation: landscape)").addEventListener("change", updateCanvas);
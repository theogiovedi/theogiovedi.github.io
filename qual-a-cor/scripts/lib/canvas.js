export function updateCameraCanvas(camCanvas, windowSizes) {
    let w, h;
    
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

    return [ windowSizes[1], windowSizes[0], w, h ];
}

export function updatePhotoCanvas(photoCanvas, windowWidth, photoWidth, photoHeight) {
    let w, h;
    
    w = windowWidth - 40;
    if (w > 600) {
        w = 600;
    }
    
    h = w * (photoHeight / photoWidth);
    
    photoCanvas.width = w;
    photoCanvas.height = h;

    return [ w, h ];
} 
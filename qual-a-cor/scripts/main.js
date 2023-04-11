import { createResults, createContrast, createExamples, createLearnMore, createPrint, createMainFooter } from './interface.js'
import { getClosestColor } from './calc.js'
import { getColorName } from './colors.js'

function showResults() {
    let colorHex;
    const color = document.getElementById("text").value;
    if (!color) {
        colorHex = document.getElementById("color-picker").value;
    } else {
        colorHex = color;
    }

    const closestColor = getClosestColor(colorHex);
    const colorName = getColorName(closestColor);

    createResults(colorHex);

    // CONTRAST

    createContrast(colorHex);

    // EXAMPLES

    createExamples(colorHex);

    // LEARN MORE

    createLearnMore(colorName);

    // PRINT

    createPrint();

    // FOOTNOTES

    createMainFooter();
}

const resultsButton = document.getElementById("results-button");
resultsButton.addEventListener("click", showResults)

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .catch(() => console.log("Erro: Não foi possível registrar o Service Worker"))
    });
}
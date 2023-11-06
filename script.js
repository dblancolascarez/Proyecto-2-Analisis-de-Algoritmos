var OpenCV_module = {
    // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
    onRuntimeInitialized() {
      document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
};
let image_elem = document.getElementById('imageSrc');
let input_elem = document.getElementById('fileInput');
input_elem.addEventListener('change', (e) => {
      image_elem.src = URL.createObjectURL(e.target.files[0]);
}, false);

// Function to get the selected value of a slider
function getSliderValue(sliderId) {
    return document.getElementById(sliderId).value;
}
function setValues(){
    maxGenerations = getSliderValue("sliderGENERATIONS");
    populationPerGeneration = getSliderValue("slidernIndividualsPopulationPerGen");
    selectedPercentage = getSliderValue("sliderPercentSelectedIndividualsEachGeneration");
    mutatePercentage = getSliderValue("sliderPercentIndividualsMutate");
    combinePercentage = getSliderValue("sliderPercentIndividualsCombination");
}

function numberUpdate(text,value,idp) {
    document.getElementById(idp).textContent = text + value;
}

function percentageUpdate(text,value,idp) {
    document.getElementById(idp).innerText = text + value + '%';
}

function startGeneticAlgorithm() {
    document.getElementById('totalTime').textContent = 'Total time: 0';
    document.getElementById('resultProcess').textContent = 'Processing image...';
    document.getElementById('msg').textContent = '';
    setValues();
    var btnStart = document.getElementById("buttonStart");
    btnStart.disabled = true;
    var startTotalTime = new Date();
    var endTotalTime = new Date();
    var totalTime = Math.floor((endTotalTime - startTotalTime) / 1000);
    document.getElementById("totalTime").textContent = 'Total time: ' + totalTime + ' seconds';
    var AverageTimeGen = 0;

    //creo que lleva una funcion de iteracion dentro de esta fn



}

function restart() {
    window.location.reload();
}
//OpenCV image dependencies
var OpenCV_module = {
    // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
};
let image_elem = document.getElementById('imageSrc'); //image element
let input_elem = document.getElementById('fileInput'); //get input image
input_elem.addEventListener('change', (e) => {
      image_elem.src = URL.createObjectURL(e.target.files[0]);
}, false);

//slider values
var points = 10;
var maxPoints = 30;
var populationPerGeneration = 10;
var maxGeneration = 10;
var combinePercentage = 30;
var selectedPercentage = 30;
var mutatePercentage = 40;


function draw(){
  let mat = new cv.Mat(image_elem.height, image_elem.width, cv.CV_8UC4);
  console.log(mat.ucharPtr(100,100))
  let p1 = new cv.Point(0, 0);
  let p2 = new cv.Point(20, 82);

  cv.line(mat, p1, p2, [0, 0, 0, 255], 5);

  cv.imshow('canvasSquare', mat);

  mat.delete();
}

function startGeneticAlgorithm() {
  document.getElementById('totalTime').textContent = 'Total time: 0'; //label total time
  document.getElementById('resultProcess').textContent = 'Processing image...'; //label resultProcess
  document.getElementById('msg').textContent = ''; //label message
  setValues(); //call the set values function to get the slider values
  var btnStart = document.getElementById("buttonStart"); //start algorith button
  btnStart.disabled = true; //disable start button after is clicked once to start

  var startTimeTotal = new Date(); //total time timer
  var AverageTimeGen = 0; //variable to set average time per gen

  let objetivo = cv.imread(image_elem);
  let generaciones = [];
  let poblacion = generatePoblation();
  let i = 0;

  function runIteration() {
    console.log("generation number:" + (i + 1)); //print gen number to console
    document.getElementById('currentGen').innerHTML = 'Generations: ' + (i+ 1); //get the currentGeneration label
    var startAverageTimeGen = performance.now(); //start running average time timer

    const copiaPoblacion = JSON.parse(JSON.stringify(poblacion));

    let seleccionados = selection(copiaPoblacion, objetivo);

    const poblacionReproducida = reproduction(JSON.parse(JSON.stringify(poblacion)), seleccionados);
    //console.log("reproducidos")
    //console.log(poblacionReproducida)

    const poblacionMutacion = mutation(JSON.parse(JSON.stringify(poblacionReproducida)));
    //console.log("poblacion mutada")
    //console.log(poblacionMutacion)

    generaciones.push(JSON.parse(JSON.stringify(poblacionMutacion)));
    poblacion = JSON.parse(JSON.stringify(poblacionMutacion));

    var endAverageTimeGen = performance.now(); //end running average time timer
    AverageTimeGen += endAverageTimeGen - startAverageTimeGen; //get average time per generations
    document.getElementById("genTime").textContent = 'Average time per generation: ' + ((AverageTimeGen/maxGeneration)/ 1000).toFixed(2)+ ' seg'; //set value to label

    i++;



    if (i < maxGeneration) {
      setTimeout(runIteration, 0);
    } else {
      var endTotalTime = new Date(); //end total time timer
      var totalTime = Math.floor((endTotalTime - startTimeTotal) / 1000); //get total time of the genetic algorithm
      document.getElementById("totalTime").textContent = 'Total time: ' + totalTime + ' seg'; //set value to label

      document.getElementById('resultProcess').textContent = 'Showing result:'; //set resultProcess label output

      setTimeout(() => {
        console.log(generaciones);
        mostrarGeneracion(generaciones);
      }, 0);
    }
  }

  runIteration();
}



function mostrarIndividuo(individuo){
  individuo = ordenamientoCoordenadas(individuo);
  let mat = new cv.Mat.zeros(image_elem.height, image_elem.width, cv.CV_8UC4);

  for (let i = 0; i < individuo.length-1; i++) {
    cv.line(mat, individuo[i], individuo[i+1], [0, 0, 0, 255], 1);
  }
  cv.imshow('canvasSquare', mat);
  mat.delete();
}
function ordenamientoCoordenadas(coordenadas){

  // Función de comparación para ordenar las coordenadas por cercanía
  function compararCercania(coordA, coordB) {
    const distanciaA = Math.sqrt(coordA.x * coordA.x + coordA.y * coordA.y);
    const distanciaB = Math.sqrt(coordB.x * coordB.x + coordB.y * coordB.y);
    return distanciaA - distanciaB;
  }

  // Ordenar el arreglo de coordenadas por cercanía
  coordenadas.sort(compararCercania);

  return coordenadas;
}

function mostrarGeneracion(generacion) {
  let tiempoEspera = 200;

  for (let g = 0; g < generacion.length; g++) {
    setTimeout(() => {
      document.getElementById('currentGeneration').innerHTML = 'Current generation: ' + (g + 1);

      for (let i = 0; i < generacion[g].length; i++) {
        setTimeout(() => {
          mostrarIndividuo(generacion[g][i]);
        }, tiempoEspera * (i + 1));
      }
    }, tiempoEspera * (g + 1) * generacion[g].length);
  }

  setTimeout(() => {
    document.getElementById('msg').textContent = 'Algorithm finished';
  }, tiempoEspera * generacion.length * generacion[generacion.length - 1].length + tiempoEspera);
}




/**
 * Updates the text content of an element with the given value.
 * @param text - The text to display before the value.
 * @param value - The value to be added to the text.
 * @param idp - The ID of the HTML element to be updated.
 */
function numberUpdate(text, value, idp) {
  document.getElementById(idp).textContent = text + value; //get number value from slider
}

/**
 * Updates the text content of an element with the given value and a percentage symbol.
 * @param text - The text to display before the value.
 * @param value - The value to be added to the text.
 * @param idp - The ID of the HTML element to be updated.
 */
function percentageUpdate(text, value, idp) {
  document.getElementById(idp).innerText = text + value + '%'; //get percentage value from slider
}

/**
 * Retrieves the value of a slider element.
 * @param sliderId - The ID of the slider element.
 * @returns The value of the slider.
 */
function getSliderValue(sliderId) {
  return document.getElementById(sliderId).value; //get slider value to use it as integers
}

/**
 * Sets values based on slider inputs and performs a validation check on percentage values.
 */
function setValues() {
  points = getSliderValue("slidernPoints");
  maxPoints = getSliderValue("slidernMaxPoints");
  maxGeneration = getSliderValue("slidernMaxgenerations");
  populationPerGeneration = getSliderValue("slidernIndividualsPopulationPerGen");
  selectedPercentage = parseInt(getSliderValue("sliderPercentSelectedIndividualsEachGeneration"));
  mutatePercentage = parseInt(getSliderValue("sliderPercentIndividualsMutate"));
  combinePercentage = parseInt(getSliderValue("sliderPercentIndividualsCombination"));

  //message to prevent using invalid percentage
  if ((selectedPercentage + mutatePercentage + combinePercentage) > 100) {
    alert("The percentages sum must be lower than 100%");
  } else {
    alert("Changes saved");
  }
}

/**
 * Reloads the current window, effectively restarting the page.
 */
function restart() {
  window.location.reload();
}

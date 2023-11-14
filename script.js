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

/**
 * Inicia el algoritmo genético, crea la población, transforma las generaciones y las dibuja
 */
function startGeneticAlgorithm() {
  document.querySelector('#totalTime').innerText = 'Total time: 0'; //label total time
  document.querySelector('#resultProcess').innerText = 'Processing image...'; //label resultProcess
  document.querySelector('#msg').innerText = ''; //label message

  setValues(); //call the set values function to get the slider values
  var btnStart = document.getElementById("buttonStart"); //start algorith button
  btnStart.disabled = true; //disable start button after is clicked once to start

  var startTimeTotal = new Date(); //total time timer
  var AverageTimeGen = 0; //variable to set average time per gen

  let target = cv.imread(image_elem);
  let generations = [];
  let poblation = generatePoblation();
  let i = 0;

  function runIteration() {
    document.getElementById('currentGen').innerHTML = 'Generations: ' + (i+ 1); //get the currentGeneration label
    var startAverageTimeGen = performance.now(); //start running average time timer

    const copiaPoblacion = JSON.parse(JSON.stringify(poblation));
    let seleccionados = selection(copiaPoblacion, target);

    const poblacionReproducida = reproduction(JSON.parse(JSON.stringify(poblation)), seleccionados);
    const poblacionMutacion = mutation(JSON.parse(JSON.stringify(poblacionReproducida)));

    generations.push(JSON.parse(JSON.stringify(poblacionMutacion)));
    poblation = JSON.parse(JSON.stringify(poblacionMutacion));

    var endAverageTimeGen = performance.now(); //end running average time timer
    AverageTimeGen += endAverageTimeGen - startAverageTimeGen; //get average time per generations
    document.getElementById("genTime").textContent = 'Average time per generation: ' + ((AverageTimeGen/maxGeneration)/ 1000).toFixed(2)+ ' seg'; //set value to label

    i++;
    if (i < maxGeneration) {
      runIteration();
    } else {
      var endTotalTime = new Date(); //end total time timer
      var totalTime = Math.floor((endTotalTime - startTimeTotal) / 1000); //get total time of the genetic algorithm
      document.getElementById('totalTime').textContent = 'Total time: ' + totalTime + ' seg'; //set value to label

      document.getElementById('resultProcess').textContent = 'Showing result:'; //set resultProcess label output
      mostrarGeneracion(generations);
    }
  }
  runIteration();
}

/**
 * Dibuja un individuo en el canvas
 */
function showIndividual(individual, index, container){
  individual = ordenamientoCoordenadas(individual);
  let mat = new cv.Mat.zeros(image_elem.height, image_elem.width, cv.CV_8UC4);

  for (let i = 0; i < individual.length-1; i++) {
    cv.line(mat, individual[i], individual[i+1], [0, 0, 0, 255], 1);
  }

  // creamos canvas
  const canvas = document.createElement("canvas");
  const id = `individual-${index}`;
  canvas.id = id;
  container.appendChild(canvas);

  cv.imshow(id, mat);
  mat.delete();
}

/**
 * Devuelve las coordenadas de una línea ordenadas de menor a mayor
 * @param {{x: number, y: number}[]} coordenadas
 * @returns {{x: number, y: number}[]}
 */
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

/**
 * Dibuja los indivudos de una generación en el canvas
 * @param {{x: number, y: number}[]} generacion
 */
function mostrarGeneracion(generacion) {
  for (let g = 0; g < generacion.length; g++) {
      document.getElementById('currentGeneration').innerHTML = 'Current generation: ' + (g + 1);
      const container = document.createElement("div");
      container.className = "generation-container";
      document.querySelector("#square").appendChild(container);
      for (let i = 0; i < generacion[g].length; i++) {
          showIndividual(generacion[g][i], g * generacion[g].length + i, container);
      }
  }
  document.getElementById('msg').textContent = 'Algorithm finished';
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
  }
}

/**
 * Reloads the current window, effectively restarting the page.
 */
function restart() {
  window.location.reload();
}

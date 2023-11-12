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

function generateIndividual(){

  let arrayPuntos = []
  for (let i = 0; i < points; i++){
    const pointX =  Math.floor(Math.random() * (image_elem.width - 0 + 1)) + 0;
    const pointY =  Math.floor(Math.random() * (image_elem.height - 0 + 1)) + 0;
    arrayPuntos.push([pointX,pointY])
  }

  let puntosIndividuo = []

  for (let i = 0; i < arrayPuntos.length; i++) {
    let p1 = new cv.Point(arrayPuntos[i][0], arrayPuntos[i][1]);
    puntosIndividuo.push(p1)
  }
  
  return puntosIndividuo;
}


function generatePoblation(){
  let arrayPoblation = [];
  for (let i = 0; i < populationPerGeneration; i++){
    arrayPoblation.push(generateIndividual())
  }
  return arrayPoblation;
}

function fitness(individuo,imagenRecibida){
  let total = 0;
  for(let i = 0; i< individuo.length; i++){
    let punto = individuo[i];
    const pixel = imagenRecibida.ucharPtr(punto.x,punto.y);
    if(pixel[0] != 0 || pixel[1] != 0 || pixel[2] != 0){
      total+=1;
    }

  }
  return total;

}
function ordenarMatrizDescendente(matriz) {
  matriz.sort((a, b) => b[0] - a[0]);
  return matriz;
}

function selection(poblation,objetivo){

  const cantidadSeleccion = (populationPerGeneration * selectedPercentage)/100
  const seleccionados = [];
  for(let i = 0; i < poblation.length ; i++){
      seleccionados.push([fitness(poblation[i],objetivo),poblation[i]]);
  }
  const seleccionadosDesordenados = ordenarMatrizDescendente(seleccionados);
  const seleccionadosFinalesConNumero =  seleccionadosDesordenados.slice(0, cantidadSeleccion);
  //console.log(seleccionadosFinalesConNumero)
  console.log("fitness")
  console.log(seleccionadosFinalesConNumero[0][0])
  //elimnar el numero del puntaje
  const seleccionadosFinalesListos = seleccionadosFinalesConNumero.map(([_, texto]) => texto);
  return seleccionadosFinalesListos;

}

function reproduction(poblation,seleccion){

  for(let i = 0; i< poblation.length; i++){

    var numeroAleatorio = Math.floor(Math.random() * 100) + 1;
    if(numeroAleatorio<=combinePercentage){

      const arregloSeleccionadosCopias = seleccion.slice(); 
      const arregloPadres = []

      for (let a= 0; a < 2; a++) {
          const indiceAleatorio = Math.floor(Math.random() * arregloSeleccionadosCopias.length);
          const elementoAleatorio = arregloSeleccionadosCopias[indiceAleatorio];
          arregloPadres.push(elementoAleatorio);
      }

      let padre1 = false;
      for (let x = 0; x < poblation[i].length; x++) {
        
        if(padre1){
          poblation[i][x] = arregloPadres[0][x];
          padre1 = false;
        }else{
          poblation[i][x] = arregloPadres[1][x];
          padre1 = true;
        }
        
      }
    }

  }
  return poblation;
}

function mutation(poblation){
  
  const poblacionCopia = poblation.slice();

  for(let i = 0; i< poblation.length; i++){

    var numeroAleatorio = Math.floor(Math.random() * 100) + 1;
    if(numeroAleatorio<=mutatePercentage){
      
      for(let p = 0; p< poblacionCopia[i].length; p++){

        let punto = poblacionCopia[i][p];

        const coordenadasMejoradas = aproximacionCoordenada(punto.x,punto.y);
        const puntoNuevasCoordenadas = new cv.Point(coordenadasMejoradas.x, coordenadasMejoradas.y);
        poblacionCopia[i][p] = puntoNuevasCoordenadas;

      }
          
    }maxPoints
    if(poblacionCopia[i].length <= maxPoints){
      const pointX =  Math.floor(Math.random() * (image_elem.width - 0 + 1)) + 0;
      const pointY =  Math.floor(Math.random() * (image_elem.height - 0 + 1)) + 0;
      const p1 = new cv.Point(pointX, pointY);
      //console.log(p1)
      poblacionCopia[i].push(p1);
    }
    
    
  }
  return poblacionCopia
}
function validarCoordenada(targetX, targetY) {
  const objetivo = cv.imread(image_elem);

  let gray = new cv.Mat();
  cv.cvtColor(objetivo, gray, cv.COLOR_RGBA2GRAY);

  let binary = new cv.Mat();
  cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

  for (let y = 0; y < binary.rows; y++) {
    for (let x = 0; x < binary.cols; x++) {
      let pixelValue = binary.ucharPtr(y, x)[0];

      if (pixelValue === 0 && x === targetX && y === targetY) {
        return true;
      }
    }
  }

  return false;
}
function aproximacionCoordenada(targetX,targetY) {
  const objetivo = cv.imread(image_elem);

  let gray = new cv.Mat();
  cv.cvtColor(objetivo, gray, cv.COLOR_RGBA2GRAY);

  let binary = new cv.Mat();
  cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

  let minDistance = Infinity;
  let puntoCercano = null;
  for (let y = 0; y < binary.rows; y++) {

    for (let x = 0; x < binary.cols; x++) {
      
      let pixelValue = binary.ucharPtr(y, x)[0];
      //console.log(pixelValue)
      if (pixelValue == 0) {
        //super formula
        let distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));

        if (distance < minDistance) {
          minDistance = distance;
          puntoCercano = { x, y };
          //console.log(puntoCercano)
        }
      }
    }
  }

  return puntoCercano;
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

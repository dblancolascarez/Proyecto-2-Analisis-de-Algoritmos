/**
 * Devuelve un listado de individuos
 * @param {number} populationSize
 * @returns {[[]]}
 */
function generatePoblation() {
	let arrayPoblation = [];
	for (let i = 0; i < populationPerGeneration; i++) {
		arrayPoblation.push(generateIndividual())
	}
	return arrayPoblation;
}

/**
 * Devuelve un arreglo de puntos aleatorios en opencv
 * @returns {[]}
 */
function generateIndividual() {
	let arrayPuntos = []
	for (let i = 0; i < points; i++) {
		const pointX = Math.floor(Math.random() * (image_elem.width - 0 + 1)) + 0;
		const pointY = Math.floor(Math.random() * (image_elem.height - 0 + 1)) + 0;
		arrayPuntos.push([pointX, pointY])
	}

	let puntosIndividuo = []
	for (let i = 0; i < arrayPuntos.length; i++) {
		const [x, y] = arrayPuntos[i];
		let p1 = new cv.Point(x, y);
		puntosIndividuo.push(p1);
	}
	return puntosIndividuo;
}
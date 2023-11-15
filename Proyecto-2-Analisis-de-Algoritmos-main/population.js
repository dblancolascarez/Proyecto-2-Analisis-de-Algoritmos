/**
 * Returns a list of individuals
 * @param {number} populationSize
 * @returns {[[]]}
 */
function generatePopulation() {
	let arrayPopulation = [];
	for (let i = 0; i < populationPerGeneration; i++) {
		arrayPopulation.push(generateIndividual())
	}
	return arrayPopulation;
}

/**
 * Returns an array of random points in opencv
 * @returns {[]}
 */
function generateIndividual() {
	let arrayPoints = []
	for (let i = 0; i < points; i++) {
		const pointX = Math.floor(Math.random() * (image_elem.width - 0 + 1)) + 0;
		const pointY = Math.floor(Math.random() * (image_elem.height - 0 + 1)) + 0;
		arrayPoints.push([pointX, pointY])
	}

	let individualPoints = []
	for (let i = 0; i < arrayPoints.length; i++) {
		const [x, y] = arrayPoints[i];
		let p1 = new cv.Point(x, y);
		individualPoints.push(p1);
	}
	return individualPoints;
}
/**
 * Returns the number of individuals selected per generation with the highest fitness.
 * @param {[[{x: number, y: number}]]} population
 * @param {OpenCVImage} target
 * @returns
 */
function selection(population, target) {
	const quantitySelection = (populationPerGeneration * selectedPercentage) / 100
	const selected = [];
	for (let i = 0; i < population.length; i++) {
		selected.push([fitness(population[i], target), population[i]]);
	}
	const selectedUnsorted = sortMatrixDescending(selected);
	const selectedFinalsWithNumber = selectedUnsorted.slice(0, quantitySelection);
	const selectedFinalsReady = selectedFinalsWithNumber.map(([_, texto]) => texto);
	return selectedFinalsReady;
}

/**
 * Returns the number of non-black dots in an individual.
 * @param {{x: number, y: number}[]} individual
 * @param {Image} imageRecived
 * @returns
 */
function fitness(individual, imageRecived) {
	let total = 0;
	for (let i = 0; i < individual.length; i++) {
		let point = individual[i];
		const pixel = imageRecived.ucharPtr(point.x, point.y);
		if (pixel[0] != 0 || pixel[1] != 0 || pixel[2] != 0) {
			total += 1;
		}
	}
	return total;
}

/**
 * Sort an array by the first element which is fitness.
 * @param {[]} matrix
*/
function sortMatrixDescending(matrix) {
	matrix.sort((a, b) => b[0] - a[0]);
	return matrix;
}
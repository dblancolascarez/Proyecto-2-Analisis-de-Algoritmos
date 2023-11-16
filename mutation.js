/**
 * Returns a new population, some individuals will have modified points, but all will have a new point.
 * @param {*} population
 * @returns - a copy of the population
 */
function mutation(population) {
	const copyPopulation = population.slice();
	for (let i = 0; i < population.length; i++) {
		// There is a probability that one point of an individual will change
		var randomNumber = Math.floor(Math.random() * 100) + 1;
		if (randomNumber <= mutatePercentage) {
			for (let p = 0; p < copyPopulation[i].length; p++) {
				let point = copyPopulation[i][p];
				const improvedCoordinates = approximateCoordinate(point.x, point.y);
				const newCoordinatesPoint = new cv.Point(improvedCoordinates.x, improvedCoordinates.y);
				copyPopulation[i][p] = newCoordinatesPoint;
			}
		}
		// Add one point to each individual in the population
		if (copyPopulation[i].length <= maxPoints) {
			const pointX = Math.floor(Math.random() * (image_elem.width - 0 + 1)) + 0;
			const pointY = Math.floor(Math.random() * (image_elem.height - 0 + 1)) + 0;
			const p1 = new cv.Point(pointX, pointY);
			copyPopulation[i].push(p1);
		}
	}
	return copyPopulation
}

/**
 * Returns the coordinates of the nearest point of the given point.
 * @param {number} targetX
 * @param {number} targetY
 * @returns {number} nearbyPoint
 */
function approximateCoordinate(targetX, targetY) {
	const target = cv.imread(image_elem);

	let gray = new cv.Mat();
	cv.cvtColor(target, gray, cv.COLOR_RGBA2GRAY);

	let binary = new cv.Mat();
	cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

	let minDistance = Infinity;
	let nearbyPoint = null;
	for (let y = 0; y < binary.rows; y++) {

		for (let x = 0; x < binary.cols; x++) {

			let pixelValue = binary.ucharPtr(y, x)[0];
			if (pixelValue == 0) {
				//super formula
				let distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));

				if (distance < minDistance) {
					minDistance = distance;
					nearbyPoint = { x, y };
				}
			}
		}
	}
	return nearbyPoint;
}
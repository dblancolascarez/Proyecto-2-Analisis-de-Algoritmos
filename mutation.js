/**
 * Devuelve una nueva población, algunos individuos tendrán puntos modificados, pero todos tendrán un nuevo punto
 * @param {*} poblation
 * @returns
 */
function mutation(poblation) {
	const poblacionCopia = poblation.slice();
	for (let i = 0; i < poblation.length; i++) {
		// Hay una probabilidad de que un punto de un individuo cambie
		var numeroAleatorio = Math.floor(Math.random() * 100) + 1;
		if (numeroAleatorio <= mutatePercentage) {
			for (let p = 0; p < poblacionCopia[i].length; p++) {
				let punto = poblacionCopia[i][p];
				const coordenadasMejoradas = aproximacionCoordenada(punto.x, punto.y);
				const puntoNuevasCoordenadas = new cv.Point(coordenadasMejoradas.x, coordenadasMejoradas.y);
				poblacionCopia[i][p] = puntoNuevasCoordenadas;
			}
		}
		// Añade un punto a cada individuo de la población
		if (poblacionCopia[i].length <= maxPoints) {
			const pointX = Math.floor(Math.random() * (image_elem.width - 0 + 1)) + 0;
			const pointY = Math.floor(Math.random() * (image_elem.height - 0 + 1)) + 0;
			const p1 = new cv.Point(pointX, pointY);
			poblacionCopia[i].push(p1);
		}
	}
	return poblacionCopia
}

/**
 * Devuelve las coordenadas del punto más cercano del punto dado
 * @param {number} targetX
 * @param {number} targetY
 * @returns {{x: number, y: number}}
 */
function aproximacionCoordenada(targetX, targetY) {
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
			if (pixelValue == 0) {
				//super formula
				let distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));

				if (distance < minDistance) {
					minDistance = distance;
					puntoCercano = { x, y };
				}
			}
		}
	}
	return puntoCercano;
}
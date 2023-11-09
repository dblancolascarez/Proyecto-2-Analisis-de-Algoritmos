/**
 * El segundo parámetro es un callback que recibe las coordenadas de las líneas que se sacaron de la imágen
 * Muchas de las líneas generadas son parecidas
 * Las que tengan una similitud de unos 100 serán agrupadas
 * @param {Element} imgElement
 * @param {(lineas: {
 * 		startPoint:{x: number, y: number},
 * 		endPoint:{x: number, y: number}
 * }[]) => void} onLineFinding
 */
const obtenerLineas = (imgElement, onLineFinding) => {
	imgElement.onload = function () {
		let src = cv.imread(imgElement);
		let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
		let lines = new cv.Mat();
		cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
		cv.Canny(src, src, 50, 200, 3);
		cv.HoughLines(src, lines, 1, Math.PI / 180, 30, 0, 0, 0, Math.PI);
		const lineas = [];
		for (let i = 0; i < lines.rows; ++i) {
			let rho = lines.data32F[i * 2];
			let theta = lines.data32F[i * 2 + 1];
			let a = Math.cos(theta);
			let b = Math.sin(theta);
			let x0 = a * rho;
			let y0 = b * rho;
			let startPoint = { x: x0 - 1000 * b, y: y0 + 1000 * a };
			let endPoint = { x: x0 + 1000 * b, y: y0 - 1000 * a };
			lineas.push([startPoint.x, startPoint.y, endPoint.x, endPoint.y]);
		}
		onLineFinding(agruparLineas(lineas));
	}
}

const agruparLineas = lineas => {
	const lineasAgrupadas = [];
	let agrupada = false;
	for (let linea of lineas) {
		const [inicioX1, inicioY1, finalX1, finalY1] = linea;
		for (let agrupacion of lineasAgrupadas) {
			const [inicioX2, inicioY2, finalX2, finalY2] = agrupacion;
			if (
				enRango(inicioX1, inicioX2) &&
				enRango(inicioY1, inicioY2) &&
				enRango(finalX1, finalX2) &&
				enRango(finalY1, finalY2)
			) {
				agrupada = true;
				break;
			}
		}
		if (!agrupada) lineasAgrupadas.push(linea);
	}
	return lineasAgrupadas.map(([x1, y1, x2, y2]) => ({
		startPoint: { x: x1, y: y1 },
		endPoint: { x: x2, y: y2 }
	}));
}

const enRango = (numero, numeroBase) => {
    return numero > numeroBase - 100 && numero < numeroBase + 100;
}
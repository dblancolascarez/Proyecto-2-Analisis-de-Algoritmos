/**
 * Devuelve la cantidad de individuos seleccionados por generación que tengan mayor fitness
 * @param {[[{x: number, y: number}]]} poblation
 * @param {OpenCVImage} objetivo
 * @returns
 */
function selection(poblation, objetivo) {
	const cantidadSeleccion = (populationPerGeneration * selectedPercentage) / 100
	const seleccionados = [];
	for (let i = 0; i < poblation.length; i++) {
		seleccionados.push([fitness(poblation[i], objetivo), poblation[i]]);
	}
	const seleccionadosDesordenados = ordenarMatrizDescendente(seleccionados);
	const seleccionadosFinalesConNumero = seleccionadosDesordenados.slice(0, cantidadSeleccion);
	const seleccionadosFinalesListos = seleccionadosFinalesConNumero.map(([_, texto]) => texto);
	return seleccionadosFinalesListos;
}

/**
 * Devuelve la cantidad de puntos que no son negros en un individuo
 * @param {{x: number, y: number}[]} individuo
 * @param {Image} imagenRecibida
 * @returns
 */
function fitness(individuo, imagenRecibida) {
	let total = 0;
	for (let i = 0; i < individuo.length; i++) {
		let punto = individuo[i];
		const pixel = imagenRecibida.ucharPtr(punto.x, punto.y);
		if (pixel[0] != 0 || pixel[1] != 0 || pixel[2] != 0) {
			total += 1;
		}
	}
	return total;
}

/**
 * Ordena una matriz por el primer elemento que es el fitness
 * @param {[]} matriz
*/
function ordenarMatrizDescendente(matriz) {
	matriz.sort((a, b) => b[0] - a[0]);
	return matriz;
}
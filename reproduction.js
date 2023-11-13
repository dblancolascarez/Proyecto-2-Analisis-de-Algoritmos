function reproduction(poblation, seleccion) {
	const arregloSeleccionadosCopias = seleccion.slice();
	for (let i = 0; i < poblation.length; i++) {
		var numeroAleatorio = Math.floor(Math.random() * 100) + 1;
		if (numeroAleatorio <= combinePercentage) {
			// Toma dos individuos aleatorios de los seleccionados
			const arregloPadres = []
			for (let a = 0; a < 2; a++) {
				const indiceAleatorio = Math.floor(Math.random() * arregloSeleccionadosCopias.length);
				const elementoAleatorio = arregloSeleccionadosCopias[indiceAleatorio];
				arregloPadres.push(elementoAleatorio);
			}
			// Cambia un punto de cada individuo por el de los padres de forma intercalada
			let padre1 = false;
			for (let x = 0; x < poblation[i].length; x++) {
				if (padre1) {
					poblation[i][x] = arregloPadres[0][x];
					padre1 = false;
				} else {
					poblation[i][x] = arregloPadres[1][x];
					padre1 = true;
				}
			}
		}
	}
	return poblation;
}
function reproduction(population, selection) {
	const arraySelectedCopy = selection.slice();
	for (let i = 0; i < population.length; i++) {
		var randomNumber = Math.floor(Math.random() * 100) + 1;
		if (randomNumber <= combinePercentage) {
			// Take two random individuals from those selected
			const arrayParents = []
			for (let a = 0; a < 2; a++) {
				const randomIndex = Math.floor(Math.random() * arraySelectedCopy.length);
				const randomElement = arraySelectedCopy[randomIndex];
				arrayParents.push(randomElement);
			}
			// Changes one point from each individual to that of the parents in an interleaved manner.
			let parent1 = false;
			for (let x = 0; x < population[i].length; x++) {
				if (parent1) {
					population[i][x] = arrayParents[0][x];
					parent1 = false;
				} else {
					population[i][x] = arrayParents[1][x];
					parent1 = true;
				}
			}
		}
	}
	return population;
}
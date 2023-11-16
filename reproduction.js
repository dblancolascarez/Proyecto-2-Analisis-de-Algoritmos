/**
 * Performs reproduction on the population based on selection.
 * @param {Array<Array<cv.Point>>} population - The current population.
 * @param {Array<Array<cv.Point>>} selection - The selected individuals for reproduction.
 * @returns {Array<Array<cv.Point>>} - The updated population after reproduction.
 */
function reproduction(population, selection) {
    // Create a copy of the selected individuals
    const arraySelectedCopy = selection.slice();

    for (let i = 0; i < population.length; i++) {
        // Generate a random number to determine if reproduction should occur
        var randomNumber = Math.floor(Math.random() * 100) + 1;

        if (randomNumber <= combinePercentage) {
            // Take two random individuals from those selected
            const arrayParents = [];
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

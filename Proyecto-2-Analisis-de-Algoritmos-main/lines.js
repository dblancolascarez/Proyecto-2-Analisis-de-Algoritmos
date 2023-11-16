/**
 * The second parameter is a callback that receives the coordinates of the lines that were taken from the image.
 * Many of the generated lines are similar.
 * Those with a similarity of about 100 will be grouped together.
 * @param {Element} imgElement
 * @param {(arrayLines: {
 * 		startPoint:{x: number, y: number},
 * 		endPoint:{x: number, y: number}
 * }[]) => void} onLineFinding
 */
const getLines = (imgElement, onLineFinding) => {
	imgElement.onload = function () {
		let src = cv.imread(imgElement);
		let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
		let lines = new cv.Mat();
		cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
		cv.Canny(src, src, 50, 200, 3);
		cv.HoughLines(src, lines, 1, Math.PI / 180, 30, 0, 0, 0, Math.PI);
		const arrayLines = [];
		for (let i = 0; i < lines.rows; ++i) {
			let rho = lines.data32F[i * 2];
			let theta = lines.data32F[i * 2 + 1];
			let a = Math.cos(theta);
			let b = Math.sin(theta);
			let x0 = a * rho;
			let y0 = b * rho;
			let startPoint = { x: x0 - 1000 * b, y: y0 + 1000 * a };
			let endPoint = { x: x0 + 1000 * b, y: y0 - 1000 * a };
			arrayLines.push([startPoint.x, startPoint.y, endPoint.x, endPoint.y]);
		}
		onLineFinding(groupLines(arrayLines));
	}
}
/**
 * Groups the aforementioned lines into an array 
 * formulates the lines with starting and finishing points and
 * groups them if they are in range 
 * @param {*} arrayLines 
 * @returns - a map of grouped lines 
 */
const groupLines = arrayLines => {
	const groupedLines = [];
	let grouped = false;
	for (let line of arrayLines) {
		const [startX1, startY1, finalX1, finalY1] = line;
		for (let group of groupedLines) {
			const [startX2, startY2, finalX2, finalY2] = group;
			if (
				inRange(startX1, startX2) &&
				inRange(startY1, startY2) &&
				inRange(finalX1, finalX2) &&
				inRange(finalY1, finalY2)
			) {
				grouped = true;
				break;
			}
		}
		if (!grouped) groupedLines.push(line);
	}
	return groupedLines.map(([x1, y1, x2, y2]) => ({
		startPoint: { x: x1, y: y1 },
		endPoint: { x: x2, y: y2 }
	}));
}

/**
 * Checks if a number is within a 100 of the number and base number provided
 * @param {number} number 
 * @param {number} baseNumber 
 * @returns {boolean} - boolean, true if the number is within range, false if not
 */
const inRange = (number, baseNumber) => {
    return number > baseNumber - 100 && number < baseNumber + 100;
}
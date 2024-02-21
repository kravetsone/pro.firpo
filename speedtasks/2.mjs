function getDistance(x1, y1, x2, y2) {
	// Формула евклидова расстояния - может округлять??
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

console.log(getDistance(1, 1, 4, 5));

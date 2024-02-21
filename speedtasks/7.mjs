function isPalindrome(s) {
	return s === s.split("").reverse().join("");
}

function longestPalindrome(s) {
	let maxPalindrome = "";

	for (let i = 0; i < s.length; i++) {
		for (let j = i + 1; j <= s.length; j++) {
			const substr = s.substring(i, j);
			if (isPalindrome(substr) && substr.length > maxPalindrome.length) {
				maxPalindrome = substr;
			}
		}
	}

	return maxPalindrome;
}

console.log(longestPalindrome("babad"));

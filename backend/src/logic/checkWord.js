export function checkWord(guessed, right) {
  if (
    typeof guessed !== "string" ||
    typeof right !== "string" ||
    guessed.length !== right.length
  ) {
    throw new Error("Words must be strings of the same length");
  }

  const word = guessed.toLowerCase().split("");
  const rightWord = right.toLowerCase().split("");

  if (word.join("") === rightWord.join("")) {
    return true;
  } else {
    const wordObject = word.map((letter, index) => {
      if (letter === rightWord[index]) {
        return { letter, result: "correct" };
      } else if (rightWord.includes(letter)) {
        return { letter, result: "misplaced" };
      } else {
        return { letter, result: "incorrect" };
      }
    });
    return wordObject;
  }
}

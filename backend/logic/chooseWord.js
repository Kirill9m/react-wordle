export function chooseWord(list, length, uni) {
  if (list.length === 0) {
    throw new Error("The list is empty!");
  }

  const wordRandomiser = (array) => {
    const number = Math.floor(Math.random() * array.length);
    if (array[number] !== undefined) {
      return array[number];
    } else {
      return false;
    }
  };

  const specifiedArray = list.filter((word) => word.length === length);

  if (uni) {
    const uniqueArray = specifiedArray.filter((word) => {
      const chars = new Set();
      for (let i = 0; i < word.length; i++) {
        chars.add(word[i]);
      }
      return chars.size === word.length;
    });
    return wordRandomiser(uniqueArray);
  }
  return wordRandomiser(specifiedArray);
}
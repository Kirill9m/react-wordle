import { checkWord } from "./checkWord";
import { chooseWord } from "./chooseWord";
import { describe, expect, it } from "@jest/globals";
/*
  The plan is(TDD word check):
    Check if the words match(lowercase) & return true
    if not
      Verify if we receive an array that splits into characters
      Verify that the array has characters as objects with correct properties
    Improvements:
      Check if the inputs are valid strings of the same length
  Next step(TDD Random word):
    Check if the function returns a word from the list
    Check if the word is randomly picked
    Check if the word has the chosen length
    Return false if no word is found
    Check if the word is unique based on the indicator
    Improvements:
      Function can handle an empty word list 
*/

describe("checkWord()", () => {
  it("should return true if words are same and lower case", () => {
    const output = checkWord("Worms", "worms");
    expect(output).toEqual(true);
  });

  it("if the words are not the same should return any array", () => {
    const output = checkWord("Worms", "Wormi");
    expect(output).toEqual(expect.any(Array));
  });

  it("if the words are not the same, should split the word into characters and store it in an object as letters and convert it to lowercase", () => {
    const output = checkWord("SwЭrd", "Worms");
    expect(output[2].letter).toEqual("э");
  });

  it("if the words are not the same, should check the char positions and place the correct answer in result", () => {
    const output = checkWord("CYCLA", "HALLÅ");
    expect(output).toEqual([
      { letter: "c", result: "incorrect" },
      { letter: "y", result: "incorrect" },
      { letter: "c", result: "incorrect" },
      { letter: "l", result: "correct" },
      { letter: "a", result: "misplaced" },
    ]);
  });

  it("check if the inputs are valid strings of the same length by throwing error", () => {
    expect(() => checkWord(123, "word")).toThrow("Words must be strings of the same length");
  });
});

describe("chooseWord()", () => {
  it("should return a string from list", () => {
    const list = ["sword", "fish", "axe"];
    const output = chooseWord(list, 4, true);
    expect(list.includes(output)).toBe(true);
  });

  it("check if the function returns different strings", () => {
    const list = ["sword", "fish", "axe", "math"];
    const wordList = new Set();
    for (let i = 0; i < 10; i++) {
      wordList.add(chooseWord(list, 4, true));
    }
    expect(wordList.size).toBeGreaterThan(1);
  });

  it("should return a string from the list with the chosen length", () => {
    const list = ["sword", "fish", "axe"];
    const wordList = new Set();
    for (let i = 0; i < 10; i++) {
      wordList.add(chooseWord(list, 4, true));
    }
    expect(wordList.size).toEqual(1);
  });

  it("should return false if a word is not found", () => {
    const list = ["sword", "fish", "axe"];
    const output = chooseWord(list, 10, true);
    expect(output).toBe(false);
  });

  it("should return an unique word based on the indicator", () => {
    const list = ["fish", "axe", "apple"];
    const output = chooseWord(list, 5, true);
    expect(output).toBe(false);
  });

  it("should return error if list is empty", () => {
    const list = [];
    expect(() => chooseWord(list, 4, true)).toThrow("The list is empty!");
  });
});

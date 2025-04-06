import { chooseWord } from "./chooseWord";
import { describe, expect, it } from "@jest/globals";
/*
  Next step(TDD Random word):
    Check if the function returns a word from the list
    Check if the word is randomly picked
    Check if the word has the chosen length
    Return false if no word is found
    Check if the word is unique based on the indicator
    Improvements:
      Function can handle an empty word list 
*/

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

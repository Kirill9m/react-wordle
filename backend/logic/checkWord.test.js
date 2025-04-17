import { checkWord } from "./checkWord";
import { describe, expect, it } from "@jest/globals";

/*The plan is(TDD word check):
Check if the words match(lowercase) & return true
if not
  Verify if we receive an array that splits into characters
  Verify that the array has characters as objects with correct properties
Improvements:
  Check if the inputs are valid strings of the same length*/

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
    expect(() => checkWord(123, "word")).toThrow(
      "Words must be strings of the same length"
    );
  });
});

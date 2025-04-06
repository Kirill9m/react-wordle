import { currentTime } from "./currentTime";
import { describe, expect, it } from "@jest/globals";


describe('formatTime()', () =>  {
  it('Return 1', () => {
    const output = currentTime();
    expect(output).toEqual(1);
  })

  it('Should return current time', () => {
    const output = currentTime();
    expect(output).toEqual(1);
  })
});
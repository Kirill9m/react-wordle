import { currentTime } from "./currentTime";
import { describe, expect, it } from "@jest/globals";


describe('formatTime()', () =>  {
  it('should return time in format HH:MM:SS where each part has 2 digits', () => {
    const time = currentTime();
    expect(time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  })
});
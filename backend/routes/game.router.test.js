import request from "supertest";
import express from "express";
import gameRouter from "./game.router.js";

const app = express();
app.use(express.json()); // Важно для парсинга req.body
app.use("/api/games", gameRouter);

describe("Api", () => {
  describe("POST /api/games", () => {
    it("should start a new game and return game details", async () => {
      const gameSettings = {
        playerId: "TestPlayer",
        length: 5,
        unique: false,
        lang: "swedish",
      };

      const response = await request(app).post("/api/games").send(gameSettings);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("gameId");
      expect(response.body.status).toContain(`Player ${gameSettings.playerId}`);
      expect(response.body.status).toContain(
        `${gameSettings.length} characters long`
      );
    });
  });

  describe("POST /api/games/:id/guesses", () => {
    let gameId;

    beforeAll(async () => {
      const gameSettings = {
        playerId: "GuessTester",
        length: 5,
        unique: false,
        lang: "english",
      };
      const startResponse = await request(app)
        .post("/api/games")
        .send(gameSettings);
      gameId = startResponse.body.gameId;
      expect(gameId).toBeDefined();
    });

    it("should accept a valid guess and return results", async () => {
      const guessData = {
        guess: "hello",
        highscore: false,
      };

      const response = await request(app)
        .post(`/api/games/${gameId}/guesses`)
        .send(guessData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("result");
      expect(response.body.result.length).toBe(5);
    });

    it("should return 400 for an invalid guess length", async () => {
      const guessData = {
        guess: "hi",
        highscore: false,
      };

      const response = await request(app)
        .post(`/api/games/${gameId}/guesses`)
        .send(guessData);

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Invalid guess");
      expect(response.body.status).toContain("should be 5 characters long");
    });
  });
});

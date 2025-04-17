import { describe, expect, it, jest } from '@jest/globals';
import request from "supertest";
import express from "express";
import gameRouter from "./game.router.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/games", gameRouter);


describe("Api", () => {
  beforeEach(async() => {
      await mongoose.connect(process.env.MONGO);
  });

  afterEach(async() => {
    await mongoose.disconnect();
  });

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
})
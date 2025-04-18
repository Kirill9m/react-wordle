import { describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import gameRouter from './game.router.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/games', gameRouter);

describe('Api & database', () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO);
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  describe('POST /api/games', () => {
    it('should start a new game and return status 200 and object with {status, gameStarted, gameId, language}', async () => {
      const gameSettings = {
        playerId: 'TestPlayer',
        length: 5,
        unique: false,
        lang: 'swedish',
      };

      const response = await request(app).post('/api/games').send(gameSettings);
      console.log(response.body);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toEqual(expect.any(String));
      expect(new Date(response.body.gameStarted).getTime()).toBeGreaterThan(0);
      expect(response.body.gameId).toEqual(expect.any(String));
      expect(response.body.language).toEqual('swedish');
      // expect(response.body.status).toContain(`${gameSettings.length} characters long`);
    });
  });

  describe('POST /api/:id/guesses', () => {
    it('should accept a guess and highscore using the gameId from /api/games', async () => {
      const responseS = await request(app).post('/api/games').send({playerId:'user', length: 4, unique: false, lang: 'swedish'});

      const guess = {
        guess: 'word',
        highscore: false,
      }
      const response = await request(app).post(`/api/games/${responseS.body.gameId}/guesses`).send(guess);
      console.log(responseS.body.gameId);
      expect(response.statusCode).toBe(200);
    });
  });

});

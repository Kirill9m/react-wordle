import { describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import gameRouter from './game.router.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const app = express();
app.use(express.json());
app.use('/api/games', gameRouter);

describe('Api & database', () => {
  let mongo = MongoMemoryServer;
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  });
  
  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
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

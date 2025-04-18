import { describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import gameRouter from './game.router.js';
import usersRouter from './users.router.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/games', gameRouter);
app.use('/api/users', usersRouter);

describe('Api & database', () => {
  let mongo = MongoMemoryServer;
  let token;
  let gameId;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'testsecret';
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }

    // Creating user and logging in
    await request(app).post('/api/users/register').send({
      name: 'testuser',
      email: 'testuser@testuser.com',
      password: 'testpass',
    });

    const loginRes = await request(app).post('/api/users/login').send({
      email: 'testuser@testuser.com',
      password: 'testpass',
    });

    token = loginRes.body.token;

    const gameRes = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${token}`)
      .send({ playerId: 'user', length: 4, unique: false, lang: 'swedish' });
    gameId = gameRes.body.gameId;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  describe('POST /api/games', () => {
    it('should start a new game as guest and return status 200 witn object {status, gameStarted, gameId, language}', async () => {
      const gameSettings = {
        playerId: 'comesFrontEnd',
        length: 5,
        unique: false,
        lang: 'swedish',
      };

      const response = await request(app).post('/api/games').send(gameSettings);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toEqual(expect.any(String));
      expect(new Date(response.body.gameStarted).getTime()).toBeGreaterThan(0);
      expect(response.body.gameId).toEqual(expect.any(String));
      expect(response.body.language).toEqual('swedish');
      expect(response.body.status).toContain('comesFrontEnd');
    });

    it('should start a new game as logged player and return player name}', async () => {
      const gameSettings = {
        playerId: 'should come from server',
        length: 5,
        unique: false,
        lang: 'swedish',
      };

      const response = await request(app)
        .post('/api/games')
        .send(gameSettings)
        .set('Authorization', `Bearer ${token}`);

      expect(response.body.status).toContain('testuser');
    });
  });

  describe('POST /api/games/:id/guesses', () => {
    it('should accept a guess and highscore using the gameId from /api/games and return result as {}|boolean, guess, timeStarted, score, status', async () => {
      const guess = {
        guess: 'word',
        highscore: false,
      };

      const response = await request(app).post(`/api/games/${gameId}/guesses`).send(guess);

      expect(response.statusCode).toBe(200);
      expect(
        typeof response.body.result === 'object' || typeof response.body.result === 'boolean'
      ).toBe(true);
      expect(response.body.guess).toEqual('word');
      expect(new Date(response.body.timeStarted).getTime()).toBeGreaterThan(0);
      expect(response.body.score).toBeGreaterThan(0);
      expect(response.body.status).toEqual(expect.any(String));
    });
  });

  describe('POST /api/games/:id/hint', () => {
    it('should send a hint', async () => {
      const response = await request(app).post(`/api/games/${gameId}/hint`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toEqual(expect.any(String));
    });
  });
});

import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import gameRouter from './game.router.js';
import usersRouter from './users.router.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

describe('User /api login & register & current', () => {
  let mongo = MongoMemoryServer;
  let token;
  let regResponse;

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
    regResponse = await request(app).post('/api/users/register').send({
      name: 'testuser',
      email: 'testuser@testuser.com',
      password: 'testpass',
    });

    const loginRes = await request(app).post('/api/users/login').send({
      email: 'testuser@testuser.com',
      password: 'testpass',
    });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user and return email and name', async () => {
      const response = await request(app).post('/api/users/register').send({
        name: 'testuser',
        email: 'testuser@testuser.com',
        password: 'testpass',
      });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          email: 'testuser@testuser.com',
          name: 'testuser',
          token: expect.any(String),
        })
      );
    });
  });

  describe('POST /api/users/login', () => {
    it('should login and return id, email, name, token', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'testuser@testuser.com',
          password: 'testpass',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          email: 'testuser@testuser.com',
          name: 'testuser',
          token: expect.any(String),
        })
      );
    });
  });

  describe('GET /api/users/current', () => {
    it('should return user data', async () => {
      const response = await request(app)
        .get('/api/users/current')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        _id: expect.any(String),
        name: 'testuser',
        email: 'testuser@testuser.com',
        coins: expect.any(Number),
        games: expect.any(Array),
        __v: expect.any(Number),
      });
    });
  });
});

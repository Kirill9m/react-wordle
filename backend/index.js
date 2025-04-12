import express from 'express'
import fs from 'fs/promises'
import dotenv from "dotenv";
import gameRouter from './routes/game.router.js';
import highScoreRouter from './routes/highscore.router.js'
import usersRouter from './routes/users.router.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/api/games", gameRouter);
app.use("/api/highscore", highScoreRouter);
app.use('/api/users', usersRouter);


app.get('/', async(req, res) => {
  const buf = await fs.readFile('../frontend/dist/index.html')
  const html = buf.toString();
  res.send(html);
});

app.get('/highscore', async(req, res) => {
  const buf = await fs.readFile('./static/highscore.html')
  const html = buf.toString();
  res.send(html);
});

app.get('/about', async(req, res) => {
  const buf = await fs.readFile('./static/about.html')
  const html = buf.toString();
  res.send(html);
});

app.use('/assets', express.static('../frontend/dist/assets'));
app.use('/static', express.static('./static'));

app.listen(5080, () => {
  console.log(`Server running on 5080`);
});
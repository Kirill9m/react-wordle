import express from 'express'
import fs from 'fs/promises'
import gameRoutes from './routes/game.js'
import mongoose from 'mongoose';
import HighScore from './src/models.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/api/game", gameRoutes);


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

app.get('/api/highscore', async (req, res) => {
  await mongoose.connect(process.env.MONGO);

  const highscores = await HighScore.find();
  res.json(highscores);
});

app.use('/assets', express.static('../frontend/dist/assets'));
app.use('/static', express.static('./static'));

app.listen(5080, () => {
  console.log(`Server running on 5080`);
});
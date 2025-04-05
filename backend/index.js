import express from 'express'
import fs from 'fs/promises'

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

app.use('/assets', express.static('../frontend/dist/assets'));

app.listen(5080, () => {
  console.log(`Server running on 5080`);
});
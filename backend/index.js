import express from "express";
import fs from "fs/promises";
import dotenv from "dotenv";
import gameRouter from "./src/routes/game.router.js";
import highScoreRouter from "./src/routes/highscore.router.js";
import usersRouter from "./src/routes/users.router.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 5080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
await mongoose.connect(process.env.MONGO);

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/api/games", gameRouter);
app.use("/api/highscore", highScoreRouter);
app.use("/api/users", usersRouter);

app.get("/", async (req, res) => {
  const buf = await fs.readFile("../frontend/dist/index.html");
  const html = buf.toString();
  res.send(html);
});

app.get("/highscore", async (req, res) => {
  const buf = await fs.readFile("./static/highscore.html");
  const html = buf.toString();
  res.send(html);
});

app.get("/about", async (req, res) => {
  const buf = await fs.readFile("./static/about.html");
  const html = buf.toString();
  res.send(html);
});

app.use("/assets", express.static("../frontend/dist/assets"));
app.use("/static", express.static("./static")); 

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

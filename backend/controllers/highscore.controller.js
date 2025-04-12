import mongoose from "mongoose";
import HighScore from "../src/models.js";

export const getHighscore = async (req, res) => {
  await mongoose.connect(process.env.MONGO);

  const highscores = await HighScore.find();
  res.json(highscores);
};
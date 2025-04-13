import HighScore from "../src/model.highScore.js";

export const getHighscore = async (req, res) => {

  const highscores = await HighScore.find();
  res.json(highscores);
};
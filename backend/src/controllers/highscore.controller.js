import HighScore from "../database/model.highScore.js";

export const getHighscore = async (req, res) => {

  const highscores = await HighScore.find();
  res.json(highscores);
};
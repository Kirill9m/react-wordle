import express from "express";
import { chooseWord } from "../logic/chooseWord.js";
import { checkWord } from "../logic/checkWord.js";
import { wordList } from "../logic/words.js";
import { currentTime } from "../logic/currentTime.js";
import mongoose from "mongoose";
import HighScore from "../src/models.js";

const router = express.Router();
const games = []; //MongoDB

router.post("/start", (req, res) => {
  const playerId = req.body.playerId; //Req from DB in future
  const length = parseInt(req.body.length);
  const unique = req.body.unique === "true";
  const time = currentTime();

  if (!playerId) {
    return res.status(400).json({ error: "Player ID is required." });
  }

  try {
    games[playerId] = {
      id: playerId,
      word: chooseWord(wordList, length, unique),
      gameStarted: time,
      isUnique: unique,
      wordLength: length,
      attemps: 0,
    };
    console.log(games[playerId]);
    res.json({
      status: `Game for playerId ${playerId} is started`,
      length,
      gameStarted: time,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/guess", async (req, res) => {
  await mongoose.connect(process.env.MONGO);

  const playerId = req.body.playerId;
  const guess = req.body.guess;
  const saveHighscore = req.body.highscore 

  if (!playerId || !games[playerId]) {
    return res.status(400).json({ error: "Game is found" });
  }

  const currentGame = games[playerId];
  const timeNow = currentTime();
  const timeStarted = currentGame.gameStarted;
  const gameUnique = currentGame.isUnique;
  const result = checkWord(guess, currentGame.word, playerId);
  currentGame.attemps++;

  if (result === true) {
    delete games[playerId];
    console.log(
      `Game for player: ${playerId} ended ${timeNow} and was removed.`
    );

    const [hours, minutes, seconds] = timeStarted.split(":").map(Number);
    const [hours2, minutes2, seconds2] = timeNow.split(":").map(Number);

    const timeInSec =
      hours2 * 3600 +
      minutes2 * 60 +
      seconds2 -
      (hours * 3600 + minutes * 60 + seconds);

    if (saveHighscore) {
      const newHighScore = new HighScore({
        user: playerId,
        time: timeInSec,
        attemps: currentGame.attemps,
        length: currentGame.wordLength,
        unique: currentGame.isUnique,
      });
      await newHighScore.save();
    }
  }

  res.json({ result, guess, timeNow, timeStarted, gameUnique });
});

export default router;

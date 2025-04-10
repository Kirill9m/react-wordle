import express from "express";
import { chooseWord } from "../logic/chooseWord.js";
import { checkWord } from "../logic/checkWord.js";
import { wordList } from "../logic/words.js";
import mongoose from "mongoose";
import HighScore from "../src/models.js";
import * as uuid from "uuid";

const router = express.Router();
const GAMES = []; //MongoDB

router.post("/", (req, res) => {
  const playerId = req.body.playerId;
  const length = parseInt(req.body.length);
  const unique = req.body.unique === "true";

  console.log(unique);

  if (!playerId || !length) {
    return res.status(400).json({ error: "Player data is required." });
  }

  const game = {
    gameId: uuid.v4(),
    id: playerId,
    word: chooseWord(wordList, length, unique),
    gameStarted: new Date(),
    isUnique: unique,
    wordLength: length,
    guesses: [],
  };
  GAMES.push(game);
  console.log(game);
  res.json({
    status: `Game for playerId ${game.id} is started`,
    length: game.length,
    gameStarted: game.gameStarted,
    gameId: game.gameId,
  });
});

router.post("/:id/guesses", async (req, res) => {
  const game = GAMES.find((savedGame) => savedGame.gameId == req.params.id);
  if (game) {
    const guess = req.body.guess;
    const saveHighscore = req.body.highscore === true || req.body.highscore === 'true';
    game.guesses.push(guess);

    console.log(`Player: ${game.id} guessed: ${guess} ${saveHighscore}`);

    const result = checkWord(guess, game.word);

    let time = Math.round((new Date() - game.gameStarted) / 1000);
    let score = game.wordLength * 100 + (game.isUnique ? 200 : 0) - time * 2 - game.guesses.length * 10;
    
    if (!result || saveHighscore === true) {
      await mongoose.connect(process.env.MONGO);

      const newHighScore = new HighScore({
        user: game.id,
        time: time,
        attemps: game.guesses.length,
        length: game.wordLength,
        unique: game.isUnique,
        score,
      });
      await newHighScore.save();
    }
    res.json({ result, guess, timeStarted: game.timeStarted, guesses: game.guesses, score })
  } else {
    res.status(404).end("Game not found");
  }
});

export default router;

import express from "express";
import { chooseWord } from "../logic/chooseWord.js";
import { checkWord } from "../logic/checkWord.js";
import { wordList } from "../logic/words.js";

const router = express.Router();
const games = []; //MongoDB

router.get("/start", (req, res) => {

  const playerId = req.body.playerId; //Req from DB in future
  const length = parseInt(req.body.length);
  const unique = req.body.unique === 'true';

  if (!playerId) {
    return res.status(400).json({ error: "Player ID is required." });
  }

  try {
    games[playerId] = { word: chooseWord(wordList, length, unique)};
    console.log(games[playerId]);
    res.json({ status: `Game for playerId ${playerId} is started`, length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/guess", (req, res) => {
  const playerId = req.body.playerId;
  const guess = req.body.guess;

  if (!playerId || !games[playerId]) {
    return res.status(400).json({ error: "Game is found" });
  }

  const currentGame = games[playerId];
  const result = checkWord(guess, currentGame.word, playerId);

  res.json({ result, guess, });
});

export default router;
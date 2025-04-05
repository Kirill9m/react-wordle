import express from "express";
import { chooseWord } from "../logic/chooseWord.js";
import { wordList } from "../logic/words.js";

const router = express.Router();

router.get("/start", (req, res) => {
  const length = parseInt(req.query.length);
  const unique = req.query.unique;

  try {
    const currentWord = chooseWord(wordList, length, unique);
    res.json({ word: currentWord, length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/guess", (req, res) => {

});

export default router;
import { chooseWord } from "../logic/chooseWord.js";
import { checkWord } from "../logic/checkWord.js";
import { english, swedish, russian } from "../logic/words.js";
import HighScore from "../src/model.highScore.js";
import * as uuid from "uuid";
import User from '../src/model.user.js'

const GAMES = [];

const startGame = async (req, res) => {
  const playerId = req.user?.name || req.body?.playerId;
  const length = parseInt(req.body.length);
  const unique = req.body.unique === "true";
  const lang = req.body.lang;
  let userId;
  if (req.user?.name) {
    userId = req.user._id;
  }

  if (!playerId || !length) {
    return res.status(400).json({ msg: "Player data is required.", status: "Player data or login is required" });
  }

  const checkIfNameExists = async (name) => {
    const existingUser = await User.findOne({ name: name });
    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  const nameExists = await checkIfNameExists(playerId);

  if (nameExists && !req.user?.name) {
    return res.status(400).json({ msg: "Player exist.", status: "This name is already registered. You can't use it as a guest" });
  }

  const chooseLang = (lang) => {
    if (lang == 'swedish') {
      return swedish;
    } else if (lang == 'russian') {
      return russian;
    } else {
      return english;
    }
  }

  const chosenWord = chooseWord(chooseLang(lang), length, unique);


  if (chosenWord === false) {
    return res.status(400).json({
      msg: "Word not found",
      status: `Sorry, a word with length ${length} was not found in our database!`,
    });
  }

  const game = {
    gameId: uuid.v4(),
    id: playerId,
    word: chosenWord,
    gameStarted: new Date(),
    isUnique: unique,
    wordLength: length,
    guesses: [],
    language: lang,
    userId: userId
  };
  GAMES.push(game);
  console.log(game);
  res.json({
    status: `Player ${game.id}, your word is ${length} characters long.`,
    length: game.length,
    gameStarted: game.gameStarted,
    gameId: game.gameId,
    language: game.language
  });
};

const makeGuess = async (req, res) => {
  const game = GAMES.find((savedGame) => savedGame.gameId == req.params.id);
  if (!game) {
    res.status(404).end("Game not found");
  }
  const guess = req.body.guess;
  const saveHighscore = req.body.highscore === true || req.body.highscore === 'true';

  if (typeof guess !== "string" || guess.length !== game.wordLength) {
    return res.status(400).json({
      msg: "Invalid guess",
      status: `The word should be ${game.wordLength} characters long!`,
    });
  }

  game.guesses.push(guess);

  console.log(`Player: ${game.id} guessed: ${guess} ${saveHighscore}`);

  const result = checkWord(guess, game.word);
  let status = `Player ${game.id}, your word is ${game.wordLength} characters long.`;

  let time = Math.round((new Date() - game.gameStarted) / 1000);
  let score = game.wordLength * 100 + (game.isUnique ? 200 : 0) - time * 2 - game.guesses.length * 10;

  if (result === true && saveHighscore === true) {

    const newHighScore = new HighScore({
      user: game.id,
      time: time,
      attemps: game.guesses.length,
      length: game.wordLength,
      unique: game.isUnique,
      score,
    });
    await newHighScore.save();

    if (game.userId !== undefined) {
      const user = await User.findById(game.userId);
      user.games.push({
        user: user.name,
        time: time,
        attemps: game.guesses.length,
        length: game.wordLength,
        unique: game.isUnique,
        score,
      });
      user.coins += 1;
      await user.save();
    }

    status = `Gratz! Your score is ${score}, and it will be saved to the highscore!`
  } else if (result === true && saveHighscore === false) {
    status = `Gratz! Your score is ${score}, and it will not be saved to the highscore!`
  }
  res.json({ result, guess, timeStarted: game.gameStarted, guesses: game.guesses, score, status: status })
};

const getHint = async (req, res) => {
  const game = GAMES.find((savedGame) => savedGame.gameId == req.params.id);
  if (!game) {
    res.status(404).end("Game not found");
  }

  const currentUser = await User.findById(game.userId);

  if (currentUser.coins > 0) {
      currentUser.coins -= 1;
      await currentUser.save();
  } else {
    return res.status(400).json({ status: 'Not enough coins to get a hint' });
  }

  const showHint = (game) => {
    const letters = game.word.split('');
    const randomIndex = Math.floor(Math.random() * letters.length);
    return { status: `The letter ${randomIndex + 1} has the letter '${letters[randomIndex]}'` }
  }

  res.json(showHint(game))
};


export { startGame, makeGuess, getHint };

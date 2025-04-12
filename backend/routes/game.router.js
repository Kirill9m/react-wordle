import express from "express";
import { startGame, makeGuess } from "../controllers/game.controllers.js";

const router = express.Router();

router.post("/", startGame);
router.post("/:id/guesses", makeGuess)

export default router;

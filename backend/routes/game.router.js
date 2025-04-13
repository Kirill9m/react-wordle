import express from "express";
import { startGame, makeGuess, getHint } from "../controllers/game.controllers.js";
import optionalAuth from "../middleware/optionalAuth.js";

const router = express.Router();

router.post("/", optionalAuth, startGame);
router.post("/:id/guesses", optionalAuth, makeGuess);
router.post("/:id/hint", optionalAuth, getHint);

export default router;

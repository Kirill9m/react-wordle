import express from "express";
import { startGame, makeGuess } from "../controllers/game.controllers.js";
import auth from '../middleware/auth.js';
import optionalAuth from "../middleware/optionalAuth.js";

const router = express.Router();

router.post("/", optionalAuth, startGame);
router.post("/:id/guesses", optionalAuth, makeGuess)

export default router;

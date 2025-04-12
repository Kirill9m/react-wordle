import express from "express";
import { getHighscore } from "../controllers/highscore.controller.js";

const router = express.Router();

router.post("/", getHighscore);

export default router;

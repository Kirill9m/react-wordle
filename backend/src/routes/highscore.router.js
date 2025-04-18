import express from "express";
import { getHighscore } from "../controllers/highscore.controller.js";

const router = express.Router();

router.get("/", getHighscore);

export default router;

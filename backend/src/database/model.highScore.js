import mongoose from "mongoose";

const highScoreSchema = new mongoose.Schema({
  user: String,
  time: Number,
  attemps: Number,
  length: Number,
  unique: Boolean,
  score: Number,
});

const HighScore = mongoose.model("score", highScoreSchema);

export default HighScore;

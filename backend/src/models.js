import mongoose from "mongoose";

const highscoreSchema = new mongoose.Schema({
  user: String,
  time: Number,
  attemps: Number,
  length: Number,
  unique: Boolean,
});

const HighScore = mongoose.model('score', highscoreSchema);

export default HighScore;
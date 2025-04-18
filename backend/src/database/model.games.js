import mongoose from 'mongoose';

const gamesSchema = new mongoose.Schema({
      id: String,
      word: String,
      gameStarted: {
        type: Date,
        required: true,
        default: Date.now
      },
      isUnique: Boolean,
      wordLength: Number,
      guesses: Array,
      language: String,
      userId: String,
});

const Games = mongoose.model('currentGames', gamesSchema);

export default Games;
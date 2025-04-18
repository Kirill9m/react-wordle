import mongoose from 'mongoose';

const gamesSchema = new mongoose.Schema({

});

const Games = mongoose.model('currentGames', gamesSchema);

export default Games;
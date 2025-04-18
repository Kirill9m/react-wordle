import mongoose from "mongoose";

const userShema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  coins: { type: Number, default: 10 },
  games: [
    {
      time: Number,
      attemps: Number,
      length: Number,
      unique: Boolean,
      score: Number,
    },
  ],
});

const Users = mongoose.model("user", userShema);

export default Users;

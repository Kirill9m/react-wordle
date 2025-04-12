import mongoose from "mongoose";

const userShema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String
});

const Users = mongoose.model('user', userShema);

export default Users;
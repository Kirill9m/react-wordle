import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../src/model.user.js'
import mongoose from 'mongoose';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    await mongoose.connect(process.env.MONGO);
    const user = await User.findOne({ email });

    const isPasswordValid = user && (await bcrypt.compare(password, user.password));

    if (user && isPasswordValid && process.env.JWT_SECRET) {
      res.status(200).json({
        id: user._id,
        email: user.email,
        name: user.name,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
      });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in user' });
  }
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    await mongoose.connect(process.env.MONGO);
    const registeredUser = await User.findOne({ email });

    if (registeredUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    if (newUser && process.env.JWT_SECRET) {
      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        token: jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
      });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in user' });
  }
}

const current = async (req, res) => {
  return res.status(200).json(req.user);
}

export { login, register, current };
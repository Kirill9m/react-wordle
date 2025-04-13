import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../src/model.user.js'

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required', status: "Email and password are required" });
    }

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if(validateEmail){
      return res.status(400).json({ message: 'Invalid email format', status: 'Invalid email format' })
    }

    if (password.length < 5) {
      return res.status(400).json({ message: 'Password to short', status: 'Password must be at least 5 characters long' })
    }

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
      return res.status(400).json({ message: 'Invalid credentials', status: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in user', status: "Error logging in user" });
  }
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required', status: "Name, email and password are required" });
    }

    if (password.length < 5) {
      return res.status(400).json({ message: 'Password to short', status: 'Password must be at least 5 characters long' })
    }

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if(!validateEmail(email)){
      return res.status(400).json({ message: 'Invalid email format', status: 'Invalid email format' })
    }

    if (name.length < 3) {
      return res.status(400).json({ message: 'Username to short', status: 'Username should contain at least 3 characters' })
    }

    const registeredUserEmail = await User.findOne({ email });
    const registeredUserName = await User.findOne({ name });

    if (registeredUserEmail) {
      return res.status(400).json({ message: 'Email already exists', status: "Email already exists" });
    }

    if (registeredUserName) {
      return res.status(400).json({ status: "Username already exists", status: "Username already exists" });
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
        token: jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
      });
    } else {
      return res.status(400).json({ message: 'Invalid credentials', status: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in user', status: "Error logging in user" });
  }
}

const current = async (req, res) => {
  return res.status(200).json(req.user);
}

export { login, register, current };
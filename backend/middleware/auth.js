import jwt from 'jsonwebtoken'
import User from '../src/model.user.js'
import mongoose from 'mongoose';

const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Not authorized - No token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Not authorized - Invalid token' });
        }
        
        req.user = user;
        next();

    } catch (error) {
        return res.status(400).json({ msg: "Player data is required.", status: "You are not authorized"});
    };
};

export default auth;
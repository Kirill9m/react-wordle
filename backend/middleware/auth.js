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
        await mongoose.connect(process.env.MONGO);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Not authorized - Invalid token' });
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    };
};

export default auth;
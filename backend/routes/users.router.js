import express from 'express';
import { login, register, current } from '../controllers/users.controllers.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/current', auth, current);

export default router;
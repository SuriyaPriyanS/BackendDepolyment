import express from 'express';
import { register, login, getUserProfile } from '../Controllers/userController.js';
import { authenticateToken } from '../Middlware/auth.js';


const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getUserProfile);


export default router;
import express from 'express';
import { register, login, getUserProfile ,  deleteUser, updateUserProfile } from '../Controllers/userController.js';
import { authenticateToken } from '../Middlware/auth.js';


const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile/:id', authenticateToken, updateUserProfile);
router.delete('/profile/:id', authenticateToken, deleteUser);



export default router;
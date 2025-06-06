import express from 'express';
import { register, login,  deleteUser,getUserProfile, updateUserProfile } from '../Controllers/userController.js';
import { authenticateToken } from '../Middlware/auth.js';


const router = express.Router();


router.post('/register', register);
router.post('/login', login);
// router.get('/users',authenticateToken , getAllUsers)
router.get('/profile',  getUserProfile);
// router.get('/profile/:id', authenticateToken, getUserbyId);
router.put('/profile/:id', authenticateToken, updateUserProfile);
router.delete('/profile/:id', authenticateToken, deleteUser);



export default router;
import express from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '../Controllers/notesController.js';

import { authenticateToken} from '../Middlware/auth.js';

const router = express.Router();

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/',authenticateToken , createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
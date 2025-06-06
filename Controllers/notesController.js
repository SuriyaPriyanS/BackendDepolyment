import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new note
export const createNote = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// Get all notes
export const getAllNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
};

// Get a single note by ID
export const getNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await prisma.note.findUnique({
      where: { id: Number(id) },
    });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve note' });
  }
};

// Update a note by ID
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const updatedNote = await prisma.note.update({
      where: { id: Number(id) },
      data: { title, content },
    });
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

// Delete a note by ID
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.note.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
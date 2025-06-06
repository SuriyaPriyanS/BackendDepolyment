import express from 'express';
import dotenv from 'dotenv';
import notesRouter from './Routers/notesRouter.js';
import userRouter from './Routers/userRouter.js';
import { PrismaClient } from '@prisma/client';
import cors from 'cors'

// import { authMiddleware } from './middleware/auth.js';

dotenv.config();
const prisma = new PrismaClient(); // Instantiate PrismaClient

const app = express();

app.use(express.json());
app.use(cors(
    {
        origin: '*', // Allow all origins, you can specify a specific origin if needed
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true // Allow credentials if needed
    }
)); // Enable CORS for all routes

// app.use(authMiddleware);


app.use('/api/notes', notesRouter);
app.use('/api/users', userRouter)

const PORT = process.env.PORT || 5000;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not defined in .env file');
  process.exit(1);
}
prisma.$connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });
    
    
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


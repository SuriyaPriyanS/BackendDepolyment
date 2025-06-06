import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log("Token:", token); // Log the token for debugging
  if (!token) return res.sendStatus(401);
  console.log("user", user);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = { id: decoded.userId }; // Attach userId from token to req.user
    next();
  });
};


export const checkUserExists = async (req, res, next) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.sendStatus(404);
  next();
};
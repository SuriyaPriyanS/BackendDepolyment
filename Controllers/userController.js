import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Registration error:', error); // Log the real error
    res.status(500).json({ error: 'User registration failed' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token ,
        user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// export const getAllUsers = async (req, res) => {
//   try {
//     // Get pagination parameters from query string
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Get total count for pagination info
//     const totalUsers = await prisma.user.count();

//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         createdAt: true,
//         updatedAt: true,
//         _count: {
//           notes: true
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       },
//       skip: skip,
//       take: limit
//     });

//     const totalPages = Math.ceil(totalUsers / limit);

//     res.status(200).json({
//       message: 'Users retrieved successfully',
//       pagination: {
//         currentPage: page,
//         totalPages: totalPages,
//         totalUsers: totalUsers,
//         usersPerPage: limit,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1
//       },
//       users
//     });
//   } catch (error) {
//     console.error('Get all users error:', error);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// };

export const getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          notes: true
        }
      }
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, password } = req.body;
  const data = {};
  if (username) {
    data.username = username;
  }
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });
    res.json({ message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.user.id;
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

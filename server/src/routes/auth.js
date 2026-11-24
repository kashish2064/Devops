import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }
  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({ token, user });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = signToken(user._id);
  res.json({ token, user });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, async (req, res) => {
  const { name, avatarUrl } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  await user.save();
  res.json({ user });
});

export default router;

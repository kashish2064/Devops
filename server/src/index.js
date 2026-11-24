import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import templateRoutes from './routes/templates.js';
import invitationRoutes from './routes/invitations.js';
import rsvpRoutes from './routes/rsvps.js';

const app = express();

// CORS — allow the Vite dev server and any configured origin
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/rsvps', rsvpRoutes);

// 404 handler for unknown API routes
app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

import { Router } from 'express';
import Template from '../models/Template.js';

const router = Router();

// GET /api/templates — list active templates, optionally filter by category
router.get('/', async (req, res) => {
  const filter = { active: true };
  if (req.query.category && req.query.category !== 'All') {
    filter.category = req.query.category;
  }
  const templates = await Template.find(filter).sort({ createdAt: 1 });
  res.json({ templates });
});

// GET /api/templates/:id — single template by string slug
router.get('/:id', async (req, res) => {
  const template = await Template.findOne({ id: req.params.id, active: true });
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json({ template });
});

export default router;

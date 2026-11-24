import { Router } from 'express';
import { nanoid } from 'nanoid';
import Invitation from '../models/Invitation.js';
import RSVP from '../models/RSVP.js';
import Favorite from '../models/Favorite.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/invitations — list the current user's invitations
router.get('/', requireAuth, async (req, res) => {
  const invitations = await Invitation.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  res.json({ invitations });
});

// POST /api/invitations — create a new invitation
router.post('/', requireAuth, async (req, res) => {
  const { name, templateId, content, published } = req.body;
  let slug;
  let attempts = 0;
  do {
    slug = nanoid(10);
    attempts++;
  } while (await Invitation.exists({ slug }) && attempts < 5);

  const invitation = await Invitation.create({
    userId: req.user._id,
    name: name || 'Untitled invitation',
    slug,
    templateId: templateId || 'timeless',
    content: content || {},
    published: published || false,
  });
  res.status(201).json({ invitation });
});

// GET /api/invitations/:id — get one invitation (owner only)
router.get('/:id', requireAuth, async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
  if (invitation.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json({ invitation });
});

// PUT /api/invitations/:id — update invitation (owner only)
router.put('/:id', requireAuth, async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
  if (invitation.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { name, content, published, coverUrl, ogImageUrl, templateId } = req.body;
  if (name !== undefined) invitation.name = name;
  if (content !== undefined) invitation.content = content;
  if (published !== undefined) invitation.published = published;
  if (coverUrl !== undefined) invitation.coverUrl = coverUrl;
  if (ogImageUrl !== undefined) invitation.ogImageUrl = ogImageUrl;
  if (templateId !== undefined) invitation.templateId = templateId;
  await invitation.save();
  res.json({ invitation });
});

// DELETE /api/invitations/:id (owner only)
router.delete('/:id', requireAuth, async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
  if (invitation.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await RSVP.deleteMany({ invitationId: invitation._id });
  await invitation.deleteOne();
  res.json({ success: true });
});

// GET /api/invitations/slug/:slug — public published invitation
router.get('/slug/:slug', async (req, res) => {
  const invitation = await Invitation.findOne({
    slug: req.params.slug,
    published: true,
  });
  if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
  res.json({ invitation });
});

// GET /api/invitations/:id/rsvps — list RSVPs for an invitation (owner only)
router.get('/:id/rsvps', requireAuth, async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
  if (invitation.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  const rsvps = await RSVP.find({ invitationId: invitation._id }).sort({ createdAt: -1 });
  res.json({ rsvps });
});

// --- Favorites ---

// GET /api/invitations/favorites — list current user's favorites
router.get('/favorites/all', requireAuth, async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user._id }).select('templateId -_id');
  res.json({ favorites: favorites.map((f) => f.templateId) });
});

// POST /api/invitations/favorites/:templateId — add a favorite
router.post('/favorites/:templateId', requireAuth, async (req, res) => {
  const { templateId } = req.params;
  await Favorite.findOneAndUpdate(
    { userId: req.user._id, templateId },
    { userId: req.user._id, templateId },
    { upsert: true },
  );
  res.json({ success: true });
});

// DELETE /api/invitations/favorites/:templateId — remove a favorite
router.delete('/favorites/:templateId', requireAuth, async (req, res) => {
  await Favorite.deleteOne({ userId: req.user._id, templateId: req.params.templateId });
  res.json({ success: true });
});

export default router;

import { Router } from 'express';
import RSVP from '../models/RSVP.js';
import Invitation from '../models/Invitation.js';

const router = Router();

// POST /api/rsvps — public RSVP submission by invitation slug
router.post('/', async (req, res) => {
  const { slug, guestName, email, attending, guests, message } = req.body;

  if (!slug || !guestName) {
    return res.status(400).json({ message: 'Slug and guest name are required' });
  }

  const invitation = await Invitation.findOne({ slug, published: true });
  if (!invitation) {
    return res.status(404).json({ message: 'This invitation is unavailable' });
  }

  const rsvp = await RSVP.create({
    invitationId: invitation._id,
    guestName: String(guestName).slice(0, 100),
    email: email ? String(email).slice(0, 200) : '',
    attending: attending !== undefined ? Boolean(attending) : true,
    guests: Math.min(Math.max(Number(guests) || 1, 1), 10),
    message: message ? String(message).slice(0, 1000) : '',
  });

  res.status(201).json({ success: true, rsvp });
});

export default router;

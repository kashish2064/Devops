import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema(
  {
    invitationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invitation', required: true },
    guestName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, default: '', trim: true, lowercase: true },
    attending: { type: Boolean, default: true },
    guests: { type: Number, default: 1, min: 1, max: 10 },
    message: { type: String, default: '', maxlength: 1000 },
  },
  { timestamps: true },
);

rsvpSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

export default mongoose.model('RSVP', rsvpSchema);

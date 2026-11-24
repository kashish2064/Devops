import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: 'Untitled invitation', trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    templateId: { type: String, default: 'timeless' },
    // The full Design object from the editor: names, date, venue, events, background, elements, etc.
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    published: { type: Boolean, default: false },
    coverUrl: { type: String, default: '' },
    ogImageUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

invitationSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

export default mongoose.model('Invitation', invitationSchema);

import mongoose from 'mongoose';

/**
 * Templates are seeded from the same 15 designs that live in the frontend
 * src/lib/studio/templates.ts. The `id` field is the string slug the
 * frontend uses to look up a design (e.g. "timeless", "garden").
 */
const templateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    style: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

templateSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret.id || ret._id;
    return ret;
  },
});

export default mongoose.model('Template', templateSchema);

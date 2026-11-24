import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: String, required: true },
  },
  { timestamps: true },
);

// One favorite per user-template pair
favoriteSchema.index({ userId: 1, templateId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);

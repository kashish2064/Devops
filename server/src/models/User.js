import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatarUrl: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare a plaintext password against the stored hash
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Strip the password from any JSON response
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    ret.id = ret._id;
    return ret;
  },
});

export default mongoose.model('User', userSchema);

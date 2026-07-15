import mongoose from 'mongoose';

const extraIngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAm: { type: String, default: '' },
    price: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('ExtraIngredient', extraIngredientSchema);

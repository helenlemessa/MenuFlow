import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAm: { type: String, default: '' },
    price: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
    isRemovable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Ingredient', ingredientSchema);

import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAm: { type: String, default: '' },
    description: { type: String, default: '' },
    descriptionAm: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
    extraIngredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExtraIngredient' }],
    preparationTime: { type: Number, default: 15 },
    calories: { type: Number, default: null },
    allergens: [{ type: String }],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    orderCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

foodSchema.index({ name: 'text', nameAm: 'text' });

export default mongoose.model('Food', foodSchema);

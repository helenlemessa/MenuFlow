import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  removedIngredients: [{ type: String }],
  addedIngredients: [
    {
      name: String,
      price: Number,
    },
  ],
  specialInstructions: { type: String, default: '' },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    tableNumber: { type: Number, required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    serviceCharge: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    isPaid: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'telebirr', 'bank_transfer', ''],
      default: '',
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);

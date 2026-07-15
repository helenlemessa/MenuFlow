import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    tableNumber: { type: Number, required: true },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    subtotal: { type: Number, required: true },
    serviceCharge: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'telebirr', 'bank_transfer', ''],
      default: '',
    },
    paidAt: { type: Date, default: null },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Bill', billSchema);

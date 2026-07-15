import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true },
    name: { type: String, default: '' },
    capacity: { type: Number, default: 4 },
    qrCode: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isOccupied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Table', tableSchema);

import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, default: 'MenuFlow Restaurant' },
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    description: { type: String, default: '' },
    themeColor: { type: String, default: '#d97706' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    googleMapsUrl: { type: String, default: '' },
    openingHours: {
      monday: { type: String, default: '9:00 AM - 10:00 PM' },
      tuesday: { type: String, default: '9:00 AM - 10:00 PM' },
      wednesday: { type: String, default: '9:00 AM - 10:00 PM' },
      thursday: { type: String, default: '9:00 AM - 10:00 PM' },
      friday: { type: String, default: '9:00 AM - 11:00 PM' },
      saturday: { type: String, default: '10:00 AM - 11:00 PM' },
      sunday: { type: String, default: '10:00 AM - 9:00 PM' },
    },
    currency: { type: String, default: 'ETB' },
    vatPercentage: { type: Number, default: 15 },
    serviceChargePercentage: { type: Number, default: 10 },
    languages: [{ type: String, default: ['en', 'am'] }],
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);

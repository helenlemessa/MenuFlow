import Settings from '../models/Settings.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    const parseJson = (val) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return val; }
      }
      return val;
    };

    const fields = [
      'restaurantName', 'description', 'themeColor', 'phone', 'email',
      'address', 'googleMapsUrl', 'currency',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) settings[field] = req.body[field];
    });

    if (req.body.vatPercentage !== undefined) settings.vatPercentage = Number(req.body.vatPercentage);
    if (req.body.serviceChargePercentage !== undefined) settings.serviceChargePercentage = Number(req.body.serviceChargePercentage);
    if (req.body.openingHours !== undefined) settings.openingHours = parseJson(req.body.openingHours);
    if (req.body.socialLinks !== undefined) settings.socialLinks = parseJson(req.body.socialLinks);
    if (req.body.languages !== undefined) settings.languages = parseJson(req.body.languages);

    if (req.files?.logo) {
      const result = await uploadToCloudinary(req.files.logo[0].buffer, 'menuflow/logo');
      settings.logo = result.secure_url;
    }
    if (req.files?.coverImage) {
      const result = await uploadToCloudinary(req.files.coverImage[0].buffer, 'menuflow/cover');
      settings.coverImage = result.secure_url;
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

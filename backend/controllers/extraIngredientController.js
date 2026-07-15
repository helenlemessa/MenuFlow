import ExtraIngredient from '../models/ExtraIngredient.js';

export const getExtraIngredients = async (req, res) => {
  try {
    const filter = req.user ? {} : { isActive: true };
    const extras = await ExtraIngredient.find(filter).sort({ name: 1 });
    res.json(extras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createExtraIngredient = async (req, res) => {
  try {
    const extra = await ExtraIngredient.create(req.body);
    res.status(201).json(extra);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExtraIngredient = async (req, res) => {
  try {
    const extra = await ExtraIngredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!extra) return res.status(404).json({ message: 'Extra ingredient not found' });
    res.json(extra);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExtraIngredient = async (req, res) => {
  try {
    const extra = await ExtraIngredient.findByIdAndDelete(req.params.id);
    if (!extra) return res.status(404).json({ message: 'Extra ingredient not found' });
    res.json({ message: 'Extra ingredient deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

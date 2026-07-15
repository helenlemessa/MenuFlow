import Category from '../models/Category.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const getCategories = async (req, res) => {
  try {
    const filter = req.user ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.isActive !== undefined) data.isActive = data.isActive === 'true' || data.isActive === true;
    if (data.order !== undefined) data.order = Number(data.order);
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'menuflow/categories');
      data.image = result.secure_url;
    }
    const category = await Category.create(data);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    Object.assign(category, req.body);
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    if (req.body.order !== undefined) category.order = Number(req.body.order);
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'menuflow/categories');
      category.image = result.secure_url;
    }
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    await Promise.all(
      categories.map(({ id, order }) =>
        Category.findByIdAndUpdate(id, { order })
      )
    );
    const updated = await Category.find().sort({ order: 1 });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

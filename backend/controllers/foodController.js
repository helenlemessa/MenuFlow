import Food from '../models/Food.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import { paginate } from '../utils/helpers.js';

const parseBool = (val) => val === true || val === 'true';
const parseNum = (val) => (val === '' || val === undefined || val === null ? undefined : Number(val));

const normalizeFoodData = (data) => {
  ['isVegetarian', 'isVegan', 'isSpicy', 'isBestSeller', 'isNew', 'isAvailable'].forEach((field) => {
    if (data[field] !== undefined) data[field] = parseBool(data[field]);
  });
  ['price', 'preparationTime', 'calories', 'rating'].forEach((field) => {
    if (data[field] !== undefined) data[field] = parseNum(data[field]);
  });
  return data;
};

export const getFoods = async (req, res) => {
  try {
    const {
      search, category, vegetarian, vegan, spicy, bestSeller, isNew, available,
      page = 1, limit = 12,
    } = req.query;

    const filter = {};
    if (!req.user) filter.isAvailable = true;
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (vegetarian === 'true') filter.isVegetarian = true;
    if (vegan === 'true') filter.isVegan = true;
    if (spicy === 'true') filter.isSpicy = true;
    if (bestSeller === 'true') filter.isBestSeller = true;
    if (isNew === 'true') filter.isNew = true;
    if (available === 'true') filter.isAvailable = true;

    const query = Food.find(filter)
      .populate('category', 'name nameAm')
      .populate('ingredients')
      .populate('extraIngredients')
      .sort({ createdAt: -1 });

    const total = await Food.countDocuments(filter);
    const foods = await paginate(query, parseInt(page), parseInt(limit));

    res.json({
      foods,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('category', 'name nameAm')
      .populate('ingredients')
      .populate('extraIngredients');
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPopularFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true })
      .sort({ orderCount: -1 })
      .limit(8)
      .populate('category', 'name nameAm');
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true, isBestSeller: true })
      .limit(6)
      .populate('category', 'name nameAm');
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFood = async (req, res) => {
  try {
    const data = normalizeFoodData({ ...req.body });
    if (typeof data.ingredients === 'string') data.ingredients = JSON.parse(data.ingredients);
    if (typeof data.extraIngredients === 'string') data.extraIngredients = JSON.parse(data.extraIngredients);
    if (typeof data.allergens === 'string') data.allergens = JSON.parse(data.allergens);

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'menuflow/foods');
      data.image = result.secure_url;
    }

    const food = await Food.create(data);
    const populated = await Food.findById(food._id)
      .populate('category')
      .populate('ingredients')
      .populate('extraIngredients');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    const data = normalizeFoodData({ ...req.body });
    if (typeof data.ingredients === 'string') data.ingredients = JSON.parse(data.ingredients);
    if (typeof data.extraIngredients === 'string') data.extraIngredients = JSON.parse(data.extraIngredients);
    if (typeof data.allergens === 'string') data.allergens = JSON.parse(data.allergens);

    Object.assign(food, data);
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'menuflow/foods');
      food.image = result.secure_url;
    }
    await food.save();

    const populated = await Food.findById(food._id)
      .populate('category')
      .populate('ingredients')
      .populate('extraIngredients');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

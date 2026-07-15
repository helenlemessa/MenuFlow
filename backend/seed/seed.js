import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import Category from '../models/Category.js';
import Ingredient from '../models/Ingredient.js';
import ExtraIngredient from '../models/ExtraIngredient.js';
import Food from '../models/Food.js';
import Table from '../models/Table.js';
import QRCode from 'qrcode';

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(), Settings.deleteMany(), Category.deleteMany(),
    Ingredient.deleteMany(), ExtraIngredient.deleteMany(), Food.deleteMany(), Table.deleteMany(),
  ]);

  console.log('Database cleared');

  await User.create([
    { name: 'Admin', email: 'admin@menuflow.com', password: 'admin123', role: 'admin' },
    { name: 'Waiter', email: 'waiter@menuflow.com', password: 'waiter123', role: 'waiter' },
    { name: 'Kitchen', email: 'kitchen@menuflow.com', password: 'kitchen123', role: 'kitchen' },
  ]);

  await Settings.create({
    restaurantName: 'MenuFlow Restaurant',
    description: 'Experience the finest Ethiopian and international cuisine in an elegant atmosphere. Our chefs craft every dish with passion using the freshest local ingredients.',
    themeColor: '#d97706',
    phone: '+251 911 234 567',
    email: 'info@menuflow.com',
    address: 'Bole Road, Addis Ababa, Ethiopia',
    googleMapsUrl: 'https://maps.google.com/?q=Bole+Road+Addis+Ababa',
    currency: 'ETB',
    vatPercentage: 15,
    serviceChargePercentage: 10,
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200',
    socialLinks: {
      facebook: 'https://facebook.com/menuflow',
      instagram: 'https://instagram.com/menuflow',
      twitter: 'https://twitter.com/menuflow',
    },
  });

  const categories = await Category.insertMany([
    { name: 'Breakfast', nameAm: 'ቁርስ', order: 1 },
    { name: 'Lunch', nameAm: 'ምሳ', order: 2 },
    { name: 'Dinner', nameAm: 'እራት', order: 3 },
    { name: 'Traditional Food', nameAm: 'ባህላዊ ምግብ', order: 4 },
    { name: 'Fast Food', nameAm: 'ፈጣን ምግብ', order: 5 },
    { name: 'Pizza', nameAm: 'ፒዛ', order: 6 },
    { name: 'Burger', nameAm: 'በርገር', order: 7 },
    { name: 'Pasta', nameAm: 'ፓስታ', order: 8 },
    { name: 'Coffee', nameAm: 'ቡና', order: 9 },
    { name: 'Desserts', nameAm: 'ጣፋጭ', order: 10 },
    { name: 'Drinks', nameAm: 'መጠጦች', order: 11 },
  ]);

  const ingredients = await Ingredient.insertMany([
    { name: 'Cheese', nameAm: 'አይብ', isDefault: true, isRemovable: true },
    { name: 'Tomato', nameAm: 'ቲማቲም', isDefault: true, isRemovable: true },
    { name: 'Onion', nameAm: 'ሽንኩርት', isDefault: true, isRemovable: true },
    { name: 'Broccoli', nameAm: 'ብሮኮሊ', isDefault: false, isRemovable: true },
    { name: 'Pepperoni', nameAm: 'ፔፕሮኒ', isDefault: false, isRemovable: true },
    { name: 'Mushroom', nameAm: 'እንጉዳይ', isDefault: false, isRemovable: true },
    { name: 'Lettuce', nameAm: 'ሰላጣ', isDefault: true, isRemovable: true },
    { name: 'Beef Patty', nameAm: 'የበሬ ስጋ', isDefault: true, isRemovable: false },
  ]);

  const extras = await ExtraIngredient.insertMany([
    { name: 'Extra Cheese', nameAm: 'ተጨማሪ አይብ', price: 50 },
    { name: 'Extra Sauce', nameAm: 'ተጨማሪ ሶስ', price: 30 },
    { name: 'Extra Meat', nameAm: 'ተጨማሪ ስጋ', price: 100 },
    { name: 'Extra Mushroom', nameAm: 'ተጨማሪ እንጉዳይ', price: 40 },
  ]);

  const foodImages = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600',
  ];

  const foods = [
    { name: 'Margherita Pizza', nameAm: 'ማርጋሪታ ፒዛ', price: 350, category: categories[5]._id, isVegetarian: true, isBestSeller: true, preparationTime: 20, rating: 4.8, image: foodImages[6] },
    { name: 'Pepperoni Pizza', nameAm: 'ፔፕሮኒ ፒዛ', price: 420, category: categories[5]._id, isSpicy: true, isBestSeller: true, preparationTime: 20, rating: 4.7, image: foodImages[6] },
    { name: 'Classic Burger', nameAm: 'ክላሲክ በርገር', price: 280, category: categories[6]._id, isBestSeller: true, preparationTime: 15, rating: 4.6, image: foodImages[4] },
    { name: 'Cheese Burger', nameAm: 'ቺዝ በርገር', price: 320, category: categories[6]._id, preparationTime: 15, rating: 4.5, image: foodImages[4] },
    { name: 'Spaghetti Bolognese', nameAm: 'ስፓጌቲ ቦሎኔዝ', price: 300, category: categories[7]._id, preparationTime: 18, rating: 4.4, image: foodImages[1] },
    { name: 'Carbonara Pasta', nameAm: 'ካርቦናራ ፓስታ', price: 340, category: categories[7]._id, isNew: true, preparationTime: 18, rating: 4.5, image: foodImages[1] },
    { name: 'Injera with Doro Wat', nameAm: 'ዶሮ ወጥ', price: 450, category: categories[3]._id, isSpicy: true, isBestSeller: true, preparationTime: 30, rating: 4.9, image: foodImages[2] },
    { name: 'Tibs', nameAm: 'ጥብስ', price: 380, category: categories[3]._id, isSpicy: true, preparationTime: 25, rating: 4.7, image: foodImages[3] },
    { name: 'Ful Medames', nameAm: 'ፉል', price: 150, category: categories[0]._id, isVegetarian: true, isVegan: true, preparationTime: 10, rating: 4.6, image: foodImages[2] },
    { name: 'Scrambled Eggs', nameAm: 'እንቁላል', price: 120, category: categories[0]._id, isVegetarian: true, preparationTime: 8, rating: 4.3, image: foodImages[2] },
    { name: 'Ethiopian Coffee', nameAm: 'የኢትዮጵያ ቡና', price: 80, category: categories[8]._id, isBestSeller: true, preparationTime: 5, rating: 4.9, image: foodImages[8] },
    { name: 'Cappuccino', nameAm: 'ካፑቺኖ', price: 90, category: categories[8]._id, preparationTime: 5, rating: 4.5, image: foodImages[8] },
    { name: 'Chocolate Cake', nameAm: 'ቸኮሌት ኬክ', price: 180, category: categories[9]._id, isNew: true, preparationTime: 5, rating: 4.7, image: foodImages[9] },
    { name: 'Tiramisu', nameAm: 'ቲራሚሱ', price: 200, category: categories[9]._id, preparationTime: 5, rating: 4.8, image: foodImages[9] },
    { name: 'Fresh Juice', nameAm: 'ትኩስ ጭማቂ', price: 100, category: categories[10]._id, isVegetarian: true, isVegan: true, preparationTime: 5, rating: 4.4, image: foodImages[10] },
    { name: 'Mango Smoothie', nameAm: 'ማንጎ ስሙዚ', price: 120, category: categories[10]._id, isNew: true, isVegetarian: true, preparationTime: 5, rating: 4.6, image: foodImages[10] },
  ];

  for (const food of foods) {
    food.shortDescription = food.name;
    food.description = `Delicious ${food.name} prepared fresh with premium ingredients.`;
    food.ingredients = [ingredients[0]._id, ingredients[1]._id, ingredients[2]._id];
    food.extraIngredients = [extras[0]._id, extras[1]._id, extras[2]._id];
    food.allergens = ['gluten', 'dairy'];
    food.calories = Math.floor(Math.random() * 400) + 200;
  }

  await Food.insertMany(foods);

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  for (let i = 1; i <= 10; i++) {
    const menuUrl = `${clientUrl}/menu?table=${i}`;
    const qrCode = await QRCode.toDataURL(menuUrl, { width: 400, margin: 2 });
    await Table.create({ number: i, name: `Table ${i}`, capacity: 4, qrCode });
  }

  console.log('Seed data created successfully!');
  console.log('\nDefault accounts:');
  console.log('  Admin:   admin@menuflow.com / admin123');
  console.log('  Waiter:  waiter@menuflow.com / waiter123');
  console.log('  Kitchen: kitchen@menuflow.com / kitchen123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

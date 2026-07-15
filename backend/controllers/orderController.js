import Order from '../models/Order.js';
import Food from '../models/Food.js';
import Table from '../models/Table.js';
import Settings from '../models/Settings.js';
import { calculateBill } from '../utils/helpers.js';

export const createOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    const table = await Table.findOne({ number: tableNumber });
    if (!table) return res.status(404).json({ message: 'Table not found' });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food || !food.isAvailable) {
        return res.status(400).json({ message: `${item.foodName || 'Food'} is not available` });
      }

      const extrasTotal = (item.addedIngredients || []).reduce((sum, e) => sum + (e.price || 0), 0);
      const itemSubtotal = (food.price + extrasTotal) * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        food: food._id,
        foodName: food.name,
        quantity: item.quantity,
        unitPrice: food.price,
        removedIngredients: item.removedIngredients || [],
        addedIngredients: item.addedIngredients || [],
        specialInstructions: item.specialInstructions || '',
        subtotal: itemSubtotal,
      });

      food.orderCount += item.quantity;
      await food.save();
    }

    const settings = await Settings.findOne() || {};
    const bill = calculateBill(subtotal, settings);

    const order = await Order.create({
      table: table._id,
      tableNumber,
      items: orderItems,
      ...bill,
    });

    table.isOccupied = true;
    await table.save();

    const populated = await Order.findById(order._id)
      .populate('table')
      .populate('items.food');

    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', populated);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'active' })
      .populate('table')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrdersByTable = async (req, res) => {
  try {
    const orders = await Order.find({
      tableNumber: parseInt(req.params.tableNumber),
      status: 'active',
      isPaid: false,
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'completed';
    order.completedAt = new Date();
    await order.save();

    const io = req.app.get('io');
    if (io) io.emit('orderCompleted', order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('table');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayOrders = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({ createdAt: { $gte: startOfDay } });
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);

    res.json({ count: orders.length, revenue, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markOrderPaid = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { isPaid: true, paymentMethod },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

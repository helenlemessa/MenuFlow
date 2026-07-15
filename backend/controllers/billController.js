import Bill from '../models/Bill.js';
import Order from '../models/Order.js';
import Table from '../models/Table.js';
import Settings from '../models/Settings.js';
import { calculateBill } from '../utils/helpers.js';

export const getTableBill = async (req, res) => {
  try {
    const tableNumber = parseInt(req.params.tableNumber);
    const orders = await Order.find({
      tableNumber,
      isPaid: false,
    }).populate('items.food');

    if (orders.length === 0) {
      return res.json({ tableNumber, orders: [], subtotal: 0, serviceCharge: 0, vat: 0, discount: 0, total: 0 });
    }

    const subtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
    const settings = await Settings.findOne() || {};
    const billCalc = calculateBill(subtotal, settings);

    res.json({
      tableNumber,
      orders,
      ...billCalc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingBills = async (req, res) => {
  try {
    const bills = await Bill.find({ status: 'pending' })
      .populate('table')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBillFromRequest = async (req, res) => {
  try {
    const { tableNumber } = req.body;
    const orders = await Order.find({ tableNumber, isPaid: false });

    if (orders.length === 0) {
      return res.status(400).json({ message: 'No unpaid orders for this table' });
    }

    const subtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
    const settings = await Settings.findOne() || {};
    const billCalc = calculateBill(subtotal, settings);

    const existingBill = await Bill.findOne({ tableNumber, status: 'pending' });
    if (existingBill) {
      Object.assign(existingBill, { orders: orders.map((o) => o._id), ...billCalc });
      await existingBill.save();
      return res.json(existingBill);
    }

    const table = await Table.findOne({ number: tableNumber });
    const bill = await Bill.create({
      table: table._id,
      tableNumber,
      orders: orders.map((o) => o._id),
      ...billCalc,
    });

    const io = req.app.get('io');
    if (io) io.emit('newBill', bill);

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markBillPaid = async (req, res) => {
  try {
    const { paymentMethod, tableNumber } = req.body;

    const orders = await Order.find({ tableNumber, isPaid: false });
    await Order.updateMany(
      { tableNumber, isPaid: false },
      { isPaid: true, paymentMethod, status: 'completed', completedAt: new Date() }
    );

    let bill = await Bill.findOne({ tableNumber, status: 'pending' });
    if (bill) {
      bill.status = 'paid';
      bill.paymentMethod = paymentMethod;
      bill.paidAt = new Date();
      bill.paidBy = req.user._id;
      await bill.save();
    } else if (orders.length > 0) {
      const subtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
      const settings = await Settings.findOne() || {};
      const billCalc = calculateBill(subtotal, settings);
      const table = await Table.findOne({ number: tableNumber });
      bill = await Bill.create({
        table: table._id,
        tableNumber,
        orders: orders.map((o) => o._id),
        ...billCalc,
        status: 'paid',
        paymentMethod,
        paidAt: new Date(),
        paidBy: req.user._id,
      });
    }

    const table = await Table.findOne({ number: tableNumber });
    if (table) {
      table.isOccupied = false;
      await table.save();
    }

    const io = req.app.get('io');
    if (io) io.emit('billPaid', { tableNumber, paymentMethod });

    res.json({ message: 'Bill marked as paid', bill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayRevenue = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const bills = await Bill.find({ status: 'paid', paidAt: { $gte: startOfDay } });
    const revenue = bills.reduce((sum, b) => sum + b.total, 0);
    res.json({ revenue, count: bills.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

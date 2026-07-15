import Order from '../models/Order.js';
import Food from '../models/Food.js';
import Bill from '../models/Bill.js';

export const getDashboardStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({ createdAt: { $gte: startOfDay } });
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

    const monthBills = await Bill.find({ status: 'paid', paidAt: { $gte: startOfMonth } });
    const monthlyRevenue = monthBills.reduce((sum, b) => sum + b.total, 0);

    const popularFoods = await Food.find().sort({ orderCount: -1 }).limit(5);
    const leastOrdered = await Food.find({ orderCount: { $gt: 0 } }).sort({ orderCount: 1 }).limit(5);

    const avgOrderValue = todayOrders.length
      ? todayRevenue / todayOrders.length
      : 0;

    res.json({
      todayOrders: todayOrders.length,
      todayRevenue,
      monthlyRevenue,
      popularFoods,
      leastOrdered,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRevenueChart = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const bills = await Bill.find({
      status: 'paid',
      paidAt: { $gte: startDate },
    });

    const dailyRevenue = {};
    bills.forEach((bill) => {
      const date = bill.paidAt.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + bill.total;
    });

    const chartData = Object.entries(dailyRevenue)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrdersPerDay = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await Order.find({ createdAt: { $gte: startDate } });
    const dailyOrders = {};

    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      dailyOrders[date] = (dailyOrders[date] || 0) + 1;
    });

    const chartData = Object.entries(dailyOrders)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

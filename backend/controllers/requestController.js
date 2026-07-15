import CustomerRequest from '../models/CustomerRequest.js';
import Table from '../models/Table.js';

export const createRequest = async (req, res) => {
  try {
    const { tableNumber, type } = req.body;

    const table = await Table.findOne({ number: tableNumber });
    if (!table) return res.status(404).json({ message: 'Table not found' });

    const request = await CustomerRequest.create({
      table: table._id,
      tableNumber,
      type,
    });

    const io = req.app.get('io');
    if (io) io.emit('newRequest', request);

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await CustomerRequest.find({ status: 'pending' })
      .populate('table')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeRequest = async (req, res) => {
  try {
    const request = await CustomerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'completed';
    request.completedAt = new Date();
    request.completedBy = req.user._id;
    await request.save();

    const io = req.app.get('io');
    if (io) io.emit('requestCompleted', request);

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayRequests = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const requests = await CustomerRequest.find({ createdAt: { $gte: startOfDay } });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

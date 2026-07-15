import Table from '../models/Table.js';
import QRCode from 'qrcode';

export const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTable = async (req, res) => {
  try {
    const table = await Table.findOne({ number: req.params.number });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTable = async (req, res) => {
  try {
    const { number, name, capacity } = req.body;
    const exists = await Table.findOne({ number });
    if (exists) return res.status(400).json({ message: 'Table number already exists' });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const menuUrl = `${clientUrl}/menu?table=${number}`;
    const qrCode = await QRCode.toDataURL(menuUrl, { width: 400, margin: 2 });

    const table = await Table.create({ number, name, capacity, qrCode });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json({ message: 'Table deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const regenerateQR = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const menuUrl = `${clientUrl}/menu?table=${table.number}`;
    table.qrCode = await QRCode.toDataURL(menuUrl, { width: 400, margin: 2 });
    await table.save();
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTableStatus = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

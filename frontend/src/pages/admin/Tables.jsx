import { useEffect, useState } from 'react';
import { Plus, Trash2, Download, RefreshCw, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTables, createTable, deleteTable, regenerateQR } from '../../services/api';
import { downloadQR } from '../../utils/helpers';
import Modal from '../../components/Modal';
import { TableSkeleton } from '../../components/LoadingSkeleton';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ number: '', name: '', capacity: 4 });
  const [saving, setSaving] = useState(false);
  const [qrPreview, setQrPreview] = useState(null);

  const fetchTables = async () => {
    try {
      const res = await getTables();
      setTables(res.data);
    } catch {
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTables(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createTable({
        number: parseInt(form.number),
        name: form.name || `Table ${form.number}`,
        capacity: parseInt(form.capacity) || 4,
      });
      toast.success('Table created');
      setModalOpen(false);
      setForm({ number: '', name: '', capacity: 4 });
      fetchTables();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this table?')) return;
    try {
      await deleteTable(id);
      toast.success('Table deleted');
      fetchTables();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleRegenerate = async (id) => {
    try {
      const res = await regenerateQR(id);
      setTables((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      toast.success('QR code regenerated');
    } catch {
      toast.error('Failed to regenerate');
    }
  };

  if (loading) return <TableSkeleton rows={6} />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Restaurant Tables</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table._id} className="card p-6 text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Table {table.number}</h3>
              <span className={`badge ${table.isOccupied ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                {table.isOccupied ? 'Occupied' : 'Available'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{table.name} · {table.capacity} seats</p>

            {table.qrCode && (
              <button onClick={() => setQrPreview(table)} className="mx-auto block mb-4 group">
                <img src={table.qrCode} alt={`QR Table ${table.number}`} className="w-32 h-32 mx-auto rounded-lg group-hover:opacity-80 transition-opacity" />
              </button>
            )}

            <div className="flex justify-center gap-2">
              <button
                onClick={() => downloadQR(table.qrCode, table.number)}
                className="btn-secondary !px-3 !py-2 text-sm"
                title="Download QR"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRegenerate(table._id)}
                className="btn-secondary !px-3 !py-2 text-sm"
                title="Regenerate QR"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(table._id)}
                className="btn-danger !px-3 !py-2 text-sm"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No tables yet. Create your first table to generate QR codes.</p>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Table">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Table Number</label>
            <input type="number" className="input-field" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} required min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Table 1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input type="number" className="input-field" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} min="1" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!qrPreview} onClose={() => setQrPreview(null)} title={`Table ${qrPreview?.number} QR Code`}>
        {qrPreview && (
          <div className="text-center">
            <img src={qrPreview.qrCode} alt="QR Code" className="w-64 h-64 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-4">Scan to open menu for Table {qrPreview.number}</p>
            <button onClick={() => downloadQR(qrPreview.qrCode, qrPreview.number)} className="btn-primary">
              <Download className="w-5 h-5" /> Download PNG
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Tables;

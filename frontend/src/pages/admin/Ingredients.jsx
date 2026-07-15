import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getIngredients, createIngredient, updateIngredient, deleteIngredient,
  getExtraIngredients, createExtraIngredient, updateExtraIngredient, deleteExtraIngredient,
} from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import { formatCurrency } from '../../utils/helpers';
import Modal from '../../components/Modal';
import { TableSkeleton } from '../../components/LoadingSkeleton';

const Ingredients = () => {
  const { settings } = useSettings();
  const [tab, setTab] = useState('ingredients');
  const [ingredients, setIngredients] = useState([]);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [ingRes, extRes] = await Promise.all([getIngredients(), getExtraIngredients()]);
      setIngredients(ingRes.data);
      setExtras(extRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(tab === 'ingredients'
      ? { name: '', nameAm: '', price: 0, isDefault: false, isRemovable: true, isActive: true }
      : { name: '', nameAm: '', price: 0, isActive: true });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      if (tab === 'ingredients') await deleteIngredient(id);
      else await deleteExtraIngredient(id);
      toast.success('Deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (tab === 'ingredients') {
        if (editing) await updateIngredient(editing._id, form);
        else await createIngredient(form);
      } else {
        if (editing) await updateExtraIngredient(editing._id, form);
        else await createExtraIngredient(form);
      }
      toast.success(editing ? 'Updated' : 'Created');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const items = tab === 'ingredients' ? ingredients : extras;

  if (loading) return <TableSkeleton rows={6} />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Ingredient Management</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-5 h-5" /> Add {tab === 'ingredients' ? 'Ingredient' : 'Extra'}
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['ingredients', 'extras'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === t ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            {t === 'ingredients' ? 'Base Ingredients' : 'Extra Ingredients'}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Amharic</th>
                {tab === 'extras' && <th className="text-left p-4">Price</th>}
                {tab === 'ingredients' && <th className="text-left p-4">Removable</th>}
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No items</td></tr>
              ) : items.map((item) => (
                <tr key={item._id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4 text-gray-500">{item.nameAm || '-'}</td>
                  {tab === 'extras' && (
                    <td className="p-4">{formatCurrency(item.price, settings?.currency)}</td>
                  )}
                  {tab === 'ingredients' && (
                    <td className="p-4">
                      <span className={`badge ${item.isRemovable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.isRemovable ? 'Yes' : 'No'}
                      </span>
                    </td>
                  )}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit' : 'Add'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name (English)</label>
            <input className="input-field" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name (Amharic)</label>
            <input className="input-field" value={form.nameAm || ''} onChange={(e) => setForm({ ...form, nameAm: e.target.value })} />
          </div>
          {tab === 'extras' && (
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input type="number" className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
          )}
          {tab === 'ingredients' && (
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isRemovable} onChange={(e) => setForm({ ...form, isRemovable: e.target.checked })} />
              <span className="text-sm">Customer can remove</span>
            </label>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Ingredients;

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getFoods, createFood, updateFood, deleteFood, getCategories, getIngredients, getExtraIngredients,
} from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import { formatCurrency } from '../../utils/helpers';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import { FoodCardSkeleton } from '../../components/LoadingSkeleton';

const defaultForm = {
  name: '', nameAm: '', description: '', shortDescription: '', price: '',
  category: '', preparationTime: 15, calories: '', rating: 4.5,
  isVegetarian: false, isVegan: false, isSpicy: false, isBestSeller: false,
  isNew: false, isAvailable: true, ingredients: [], extraIngredients: [], allergens: [],
};

const Foods = () => {
  const { settings } = useSettings();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFoods({ page, limit: 10, search: search || undefined });
      setFoods(res.data.foods);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load foods');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    Promise.all([getCategories(), getIngredients(), getExtraIngredients()])
      .then(([catRes, ingRes, extRes]) => {
        setCategories(catRes.data);
        setIngredients(ingRes.data);
        setExtras(extRes.data);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchFoods, 300);
    return () => clearTimeout(timer);
  }, [fetchFoods]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (food) => {
    setEditing(food);
    setForm({
      name: food.name,
      nameAm: food.nameAm || '',
      description: food.description || '',
      shortDescription: food.shortDescription || '',
      price: food.price,
      category: food.category?._id || food.category,
      preparationTime: food.preparationTime,
      calories: food.calories || '',
      rating: food.rating,
      isVegetarian: food.isVegetarian,
      isVegan: food.isVegan,
      isSpicy: food.isSpicy,
      isBestSeller: food.isBestSeller,
      isNew: food.isNew,
      isAvailable: food.isAvailable,
      ingredients: food.ingredients?.map((i) => i._id || i) || [],
      extraIngredients: food.extraIngredients?.map((e) => e._id || e) || [],
      allergens: food.allergens || [],
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this food item?')) return;
    try {
      await deleteFood(id);
      toast.success('Food deleted');
      fetchFoods();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (['ingredients', 'extraIngredients', 'allergens'].includes(key)) {
          data.append(key, JSON.stringify(val));
        } else if (typeof val === 'boolean') {
          data.append(key, val);
        } else if (val !== '' && val !== null) {
          data.append(key, val);
        }
      });
      if (imageFile) data.append('image', imageFile);

      if (editing) {
        await updateFood(editing._id, data);
        toast.success('Food updated');
      } else {
        await createFood(data);
        toast.success('Food created');
      }
      setModalOpen(false);
      fetchFoods();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (key, id) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id],
    }));
  };

  const toggleBool = (key) => setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Food Management</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-5 h-5" /> Add Food
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-12"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <FoodCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-4">Food</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No foods found</td></tr>
                ) : foods.map((food) => (
                  <tr key={food._id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={food.image || ''} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-xs text-gray-500">{food.orderCount} orders</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{food.category?.name || '-'}</td>
                    <td className="p-4">{formatCurrency(food.price, settings?.currency)}</td>
                    <td className="p-4">
                      <span className={`badge ${food.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {food.isAvailable ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(food)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(food._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
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
      )}

      <Pagination page={page} pages={pagination.pages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Food' : 'Add Food'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name (English)</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name (Amharic)</label>
              <input className="input-field" value={form.nameAm} onChange={(e) => setForm({ ...form, nameAm: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input type="number" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prep Time (min)</label>
              <input type="number" className="input-field" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <input type="number" step="0.1" min="0" max="5" className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <input className="input-field" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="input-field h-20 resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="input-field" />
            {editing?.image && !imageFile && (
              <img src={editing.image} alt="" className="mt-2 w-20 h-20 rounded-lg object-cover" />
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {['isVegetarian', 'isVegan', 'isSpicy', 'isBestSeller', 'isNew', 'isAvailable'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleBool(key)}
                className={`px-3 py-1.5 rounded-full text-sm border ${form[key] ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 dark:border-gray-700'}`}
              >
                {key.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ingredients</label>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing) => (
                <button
                  key={ing._id}
                  type="button"
                  onClick={() => toggleArrayItem('ingredients', ing._id)}
                  className={`px-3 py-1 rounded-full text-sm ${form.ingredients.includes(ing._id) ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                  {ing.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Extra Ingredients</label>
            <div className="flex flex-wrap gap-2">
              {extras.map((ext) => (
                <button
                  key={ext._id}
                  type="button"
                  onClick={() => toggleArrayItem('extraIngredients', ext._id)}
                  className={`px-3 py-1 rounded-full text-sm ${form.extraIngredients.includes(ext._id) ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                  {ext.name} (+{ext.price})
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Foods;

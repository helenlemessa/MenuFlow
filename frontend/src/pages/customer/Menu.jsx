import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getFoods, getCategories } from '../../services/api';
import { useTable } from '../../hooks/useTable';
import FoodCard from '../../components/FoodCard';
import Pagination from '../../components/Pagination';
import CustomerRequests from '../../components/CustomerRequests';
import { FoodCardSkeleton } from '../../components/LoadingSkeleton';
import { getCategoryName } from '../../utils/helpers';

const Menu = () => {
  const { t, i18n } = useTranslation();
  useTable();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filters, setFilters] = useState({
    vegetarian: false, vegan: false, spicy: false, bestSeller: false, isNew: false, available: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, search: search || undefined, category: selectedCategory || undefined };
      Object.entries(filters).forEach(([key, val]) => { if (val) params[key] = 'true'; });
      const res = await getFoods(params);
      setFoods(res.data.foods);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, filters]);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const debounce = setTimeout(fetchFoods, 300);
    return () => clearTimeout(debounce);
  }, [fetchFoods]);

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    setPage(1);
  };

  const filterLabels = {
    vegetarian: t('menu.vegetarian'),
    vegan: t('menu.vegan'),
    spicy: t('menu.spicy'),
    bestSeller: t('menu.bestSeller'),
    isNew: t('menu.new'),
    available: t('menu.available'),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{t('menu.title')}</h1>
        <p className="text-gray-500 mb-6">Discover our delicious offerings</p>
      </motion.div>

      <div className="mb-6">
        <CustomerRequests compact />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('menu.search')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-12"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary !px-4"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {t('menu.filters')}
        </button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {Object.entries(filterLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters[key]
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>
      )}

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-2">
        <button
          onClick={() => { setSelectedCategory(''); setPage(1); }}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            !selectedCategory ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat._id ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            {getCategoryName(cat, i18n.language)}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <FoodCardSkeleton key={i} />)}
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">{t('menu.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food, i) => <FoodCard key={food._id} food={food} index={i} />)}
        </div>
      )}

      <Pagination page={page} pages={pagination.pages} onPageChange={setPage} />
    </div>
  );
};

export default Menu;

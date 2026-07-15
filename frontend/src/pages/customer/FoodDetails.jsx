import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Star, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { getFood, getFoods } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useSettings } from '../../contexts/SettingsContext';
import { formatCurrency, getFoodName } from '../../utils/helpers';
import FoodBadges from '../../components/FoodBadges';
import FoodCard from '../../components/FoodCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const FoodDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const { settings } = useSettings();

  const [food, setFood] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [addedIngredients, setAddedIngredients] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    getFood(id)
      .then((res) => {
        setFood(res.data);
        if (res.data.category) {
          getFoods({ category: res.data.category._id || res.data.category, limit: 4 })
            .then((r) => setRecommended(r.data.foods.filter((f) => f._id !== id).slice(0, 3)));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleRemove = (ingredient) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredient.name)
        ? prev.filter((n) => n !== ingredient.name)
        : [...prev, ingredient.name]
    );
  };

  const toggleExtra = (extra) => {
    setAddedIngredients((prev) => {
      const exists = prev.find((e) => e.name === extra.name);
      if (exists) return prev.filter((e) => e.name !== extra.name);
      return [...prev, { name: extra.name, price: extra.price }];
    });
  };

  const extrasTotal = addedIngredients.reduce((sum, e) => sum + e.price, 0);
  const itemTotal = food ? (food.price + extrasTotal) * quantity : 0;

  const handleAddToCart = () => {
    if (!food?.isAvailable) return;
    addItem(food, { quantity, removedIngredients, addedIngredients, specialInstructions });
    toast.success('Added to cart!');
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!food) return <div className="text-center py-20">Food not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/menu" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('common.back')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative rounded-2xl overflow-hidden aspect-square">
            <img
              src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <FoodBadges food={food} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            {getFoodName(food, i18n.language)}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {food.rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {food.preparationTime} {t('food.minutes')}
            </span>
            {food.calories && <span>{food.calories} {t('food.calories')}</span>}
          </div>

          <p className="text-3xl font-bold text-primary-600 mb-6">
            {formatCurrency(food.price, settings?.currency)}
          </p>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{food.description}</p>

          {food.allergens?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">{t('food.allergens')}</h3>
              <div className="flex flex-wrap gap-2">
                {food.allergens.map((a) => (
                  <span key={a} className="badge bg-red-50 text-red-600 dark:bg-red-900/20">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {food.ingredients?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('food.ingredients')} ({t('food.remove')})</h3>
              <div className="flex flex-wrap gap-2">
                {food.ingredients.filter((i) => i.isRemovable).map((ing) => (
                  <button
                    key={ing._id}
                    onClick={() => toggleRemove(ing)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      removedIngredients.includes(ing.name)
                        ? 'bg-red-100 border-red-300 text-red-700 line-through dark:bg-red-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-400'
                    }`}
                  >
                    {ing.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          {food.extraIngredients?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t('food.extras')}</h3>
              <div className="space-y-2">
                {food.extraIngredients.map((extra) => (
                  <button
                    key={extra._id}
                    onClick={() => toggleExtra(extra)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-colors ${
                      addedIngredients.find((e) => e.name === extra.name)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <span>{extra.name}</span>
                    <span className="text-primary-600 font-medium">+{formatCurrency(extra.price, settings?.currency)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">{t('food.specialInstructions')}</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="No salt, extra spicy, cut into 8 slices..."
              className="input-field resize-none h-20"
            />
          </div>

          {/* Quantity & Add */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!food.isAvailable}
              className="btn-primary flex-1"
            >
              <ShoppingCart className="w-5 h-5" />
              {food.isAvailable ? `${t('food.addToCart')} - ${formatCurrency(itemTotal, settings?.currency)}` : t('food.outOfStock')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">{t('food.recommended')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((f, i) => <FoodCard key={f._id} food={f} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default FoodDetails;

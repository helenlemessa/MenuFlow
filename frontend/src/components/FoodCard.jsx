import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Star, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { formatCurrency, getFoodName } from '../utils/helpers';
import FoodBadges from './FoodBadges';

const FoodCard = ({ food, index = 0 }) => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/food/${food._id}`} className="block relative">
        <div className="relative h-48 overflow-hidden">
          <img
            src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <FoodBadges food={food} />
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/food/${food._id}`}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 transition-colors">
            {getFoodName(food, i18n.language)}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {food.shortDescription || food.description}
        </p>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            {food.rating}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {food.preparationTime} {t('food.minutes')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(food.price, settings?.currency)}
          </span>
          {food.isAvailable && (
            <Link
              to={`/food/${food._id}`}
              className="btn-primary !px-4 !py-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              {t('food.addToCart')}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;

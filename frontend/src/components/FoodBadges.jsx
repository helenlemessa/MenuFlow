import { Flame, Leaf, Star, Sparkles } from 'lucide-react';

const FoodBadges = ({ food, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {food.isBestSeller && (
        <span className="badge bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          <Star className="w-3 h-3 mr-1" /> Best Seller
        </span>
      )}
      {food.isNew && (
        <span className="badge bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <Sparkles className="w-3 h-3 mr-1" /> New
        </span>
      )}
      {food.isSpicy && (
        <span className="badge bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <Flame className="w-3 h-3 mr-1" /> Spicy
        </span>
      )}
      {food.isVegetarian && (
        <span className="badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <Leaf className="w-3 h-3 mr-1" /> Veg
        </span>
      )}
      {!food.isAvailable && (
        <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          Out of Stock
        </span>
      )}
    </div>
  );
};

export default FoodBadges;

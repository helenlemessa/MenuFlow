import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Phone, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getPopularFoods, getFeaturedFoods } from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import FoodCard from '../../components/FoodCard';
import CustomerRequests from '../../components/CustomerRequests';
import { FoodCardSkeleton } from '../../components/LoadingSkeleton';

const Home = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [popular, setPopular] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPopularFoods(), getFeaturedFoods()])
      .then(([popRes, featRes]) => {
        setPopular(popRes.data);
        setFeatured(featRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={settings?.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-primary-400 font-medium mb-2">{t('hero.welcome')}</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {settings?.restaurantName || 'MenuFlow Restaurant'}
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {settings?.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn-primary">
                {t('hero.orderNow')} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-gray-900">
                {t('hero.viewMenu')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Clock, label: 'Opening Hours', value: settings?.openingHours?.monday || '9 AM - 10 PM' },
              { icon: MapPin, label: 'Location', value: settings?.address || 'Addis Ababa' },
              { icon: Phone, label: 'Contact', value: settings?.phone || '+251 911 234 567' },
            ].map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <Icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{label}</h3>
                <p className="text-sm text-gray-500">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Requests */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">Need Assistance?</h2>
          <CustomerRequests />
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold">Featured Dishes</h2>
            <Link to="/menu" className="text-primary-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <FoodCardSkeleton key={i} />)
              : featured.map((food, i) => <FoodCard key={food._id} food={food} index={i} />)}
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            <h2 className="font-display text-3xl font-bold">Popular Dishes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <FoodCardSkeleton key={i} />)
              : popular.slice(0, 4).map((food, i) => <FoodCard key={food._id} food={food} index={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

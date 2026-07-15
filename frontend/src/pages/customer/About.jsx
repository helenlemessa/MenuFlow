import { motion } from 'framer-motion';
import { useSettings } from '../../contexts/SettingsContext';

const About = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold mb-6">About Us</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {settings?.description || 'Welcome to our restaurant. We serve the finest cuisine with passion and dedication.'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            At {settings?.restaurantName || 'MenuFlow'}, we believe in creating memorable dining experiences. 
            Our team of skilled chefs combines traditional recipes with modern techniques to bring you dishes 
            that delight the senses.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Scan the QR code on your table to browse our menu, customize your order, and enjoy a seamless 
            dining experience without waiting for a waiter.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import { useSettings } from '../../contexts/SettingsContext';
import { formatCurrency } from '../../utils/helpers';
import BillSummary from '../../components/BillSummary';
import CustomerRequests from '../../components/CustomerRequests';
import { createOrder } from '../../services/api';
import { useTable } from '../../hooks/useTable';

const Cart = () => {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { settings } = useSettings();
  const tableNumber = useTable();
  const [submitting, setSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (!tableNumber) {
      toast.error('Please scan the QR code on your table first');
      return;
    }
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      await createOrder({
        tableNumber: parseInt(tableNumber),
        items: items.map((item) => ({
          foodId: item.foodId,
          foodName: item.foodName,
          quantity: item.quantity,
          removedIngredients: item.removedIngredients,
          addedIngredients: item.addedIngredients,
          specialInstructions: item.specialInstructions,
        })),
      });
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('cart.empty')}</h2>
        <Link to="/menu" className="btn-primary mt-6">{t('cart.continueShopping')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold mb-6">{t('cart.title')}</h1>

      <div className="mb-8">
        <CustomerRequests compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 flex gap-4"
            >
              {item.foodImage && (
                <img src={item.foodImage} alt={item.foodName} className="w-20 h-20 rounded-xl object-cover" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{item.foodName}</h3>
                {item.removedIngredients?.length > 0 && (
                  <p className="text-xs text-red-500 mt-1">No: {item.removedIngredients.join(', ')}</p>
                )}
                {item.addedIngredients?.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">Extra: {item.addedIngredients.map((e) => e.name).join(', ')}</p>
                )}
                {item.specialInstructions && (
                  <p className="text-xs text-gray-500 mt-1 italic">"{item.specialInstructions}"</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(index, item.quantity - 1)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, item.quantity + 1)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary-600">
                      {formatCurrency(item.subtotal, settings?.currency)}
                    </span>
                    <button onClick={() => removeItem(index)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <button onClick={clearCart} className="text-sm text-red-500 hover:underline">
            {t('cart.clearCart')}
          </button>
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <BillSummary subtotal={subtotal} />
          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="btn-primary w-full mt-6"
          >
            {submitting ? t('common.loading') : t('cart.placeOrder')}
          </button>
          {tableNumber && (
            <p className="text-center text-sm text-gray-500 mt-3">
              {t('table.sittingAt')} {tableNumber}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

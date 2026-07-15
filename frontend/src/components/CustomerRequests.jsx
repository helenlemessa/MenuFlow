import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bell, Droplets, FileText, Hand, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import { createRequest } from '../services/api';
import { useCart } from '../contexts/CartContext';

const requestTypes = [
  { type: 'waiter', icon: Hand, label: 'requests.needWaiter', color: 'bg-blue-500' },
  { type: 'water', icon: Droplets, label: 'requests.needWater', color: 'bg-cyan-500' },
  { type: 'napkins', icon: UtensilsCrossed, label: 'requests.needNapkins', color: 'bg-purple-500' },
  { type: 'sauce', icon: Bell, label: 'requests.needSauce', color: 'bg-orange-500' },
  { type: 'bill', icon: FileText, label: 'requests.requestBill', color: 'bg-green-500' },
];

const CustomerRequests = ({ compact = false }) => {
  const { t } = useTranslation();
  const { tableNumber } = useCart();

  const handleRequest = async (type) => {
    if (!tableNumber) {
      toast.error('Please scan the QR code on your table first');
      return;
    }
    try {
      await createRequest({ tableNumber: parseInt(tableNumber), type });
      toast.success(t('requests.sent'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {requestTypes.map(({ type, icon: Icon, label, color }) => (
          <button
            key={type}
            onClick={() => handleRequest(type)}
            className={`flex items-center gap-2 px-4 py-2 ${color} text-white rounded-full text-sm font-medium whitespace-nowrap hover:opacity-90 transition-opacity`}
          >
            <Icon className="w-4 h-4" />
            {t(label)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {requestTypes.map(({ type, icon: Icon, label, color }, i) => (
        <motion.button
          key={type}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => handleRequest(type)}
          className={`flex flex-col items-center gap-2 p-4 ${color} text-white rounded-2xl hover:opacity-90 transition-all hover:-translate-y-1 shadow-lg`}
        >
          <Icon className="w-6 h-6" />
          <span className="text-sm font-medium text-center">{t(label)}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CustomerRequests;

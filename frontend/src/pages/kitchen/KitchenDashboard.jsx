import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';
import { getActiveOrders, completeOrder } from '../../services/api';
import { useSocket } from '../../contexts/SocketContext';
import { formatCurrency } from '../../utils/helpers';
import { useSettings } from '../../contexts/SettingsContext';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const { settings } = useSettings();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getActiveOrders();
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    if (!socket) return;
    socket.on('newOrder', (order) => {
      setOrders((prev) => [order, ...prev]);
      toast.success(`New order from Table ${order.tableNumber}!`, { icon: '🔔' });
    });
    socket.on('orderCompleted', (order) => {
      setOrders((prev) => prev.filter((o) => o._id !== order._id));
    });
    return () => {
      socket.off('newOrder');
      socket.off('orderCompleted');
    };
  }, [socket]);

  const handleComplete = async (id) => {
    try {
      await completeOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      toast.success('Order completed!');
    } catch (error) {
      toast.error('Failed to complete order');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <ChefHat className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold">Kitchen Orders</h1>
          <p className="text-gray-500">{orders.length} active orders</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No active orders</p>
          <p className="text-sm text-gray-400">New orders will appear here automatically</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {orders.map((order) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card p-6 border-l-4 border-l-primary-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold">Table {order.tableNumber}</span>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-primary-600">
                    {formatCurrency(order.total, settings?.currency)}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  {order.items.map((item, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                      <div className="flex justify-between font-medium">
                        <span>{item.quantity}x {item.foodName}</span>
                      </div>
                      {item.removedIngredients?.length > 0 && (
                        <p className="text-xs text-red-500 mt-1">No: {item.removedIngredients.join(', ')}</p>
                      )}
                      {item.addedIngredients?.length > 0 && (
                        <p className="text-xs text-green-600 mt-1">Extra: {item.addedIngredients.map((e) => e.name).join(', ')}</p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-500 mt-1 italic">"{item.specialInstructions}"</p>
                      )}
                    </div>
                  ))}
                </div>

                <button onClick={() => handleComplete(order._id)} className="btn-primary w-full">
                  <CheckCircle className="w-5 h-5" /> Complete Order
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard;

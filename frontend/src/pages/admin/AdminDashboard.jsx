import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, TrendingUp, Users, Bell, FileText } from 'lucide-react';
import {
  getDashboardStats, getPendingRequests, getPendingBills, getRecentOrders,
} from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import { formatCurrency } from '../../utils/helpers';
import { TableSkeleton } from '../../components/LoadingSkeleton';

const AdminDashboard = () => {
  const { settings } = useSettings();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [bills, setBills] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getPendingRequests(),
      getPendingBills(),
      getRecentOrders(8),
    ])
      .then(([statsRes, reqRes, billRes, orderRes]) => {
        setStats(statsRes.data);
        setRequests(reqRes.data);
        setBills(billRes.data);
        setOrders(orderRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Today's Orders", value: stats.todayOrders, icon: ShoppingBag, color: 'text-blue-600' },
    { label: "Today's Revenue", value: formatCurrency(stats.todayRevenue, settings?.currency), icon: DollarSign, color: 'text-green-600' },
    { label: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue, settings?.currency), icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Avg Order Value', value: formatCurrency(stats.avgOrderValue, settings?.currency), icon: Users, color: 'text-amber-600' },
  ] : [];

  if (loading) return <TableSkeleton rows={8} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left p-4">Table</th>
                    <th className="text-left p-4">Items</th>
                    <th className="text-left p-4">Total</th>
                    <th className="text-left p-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">No orders yet</td></tr>
                  ) : orders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="p-4 font-medium">Table {order.tableNumber}</td>
                      <td className="p-4">{order.items?.length} items</td>
                      <td className="p-4 text-primary-600 font-medium">{formatCurrency(order.total, settings?.currency)}</td>
                      <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" /> Requests ({requests.length})
            </h2>
            {requests.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending requests</p>
            ) : (
              <div className="space-y-2">
                {requests.slice(0, 5).map((req) => (
                  <div key={req._id} className="card p-3 text-sm flex justify-between">
                    <span>Table {req.tableNumber}</span>
                    <span className="text-gray-500 capitalize">{req.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Pending Bills ({bills.length})
            </h2>
            {bills.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending bills</p>
            ) : (
              <div className="space-y-2">
                {bills.slice(0, 5).map((bill) => (
                  <div key={bill._id} className="card p-3 text-sm flex justify-between">
                    <span>Table {bill.tableNumber}</span>
                    <span className="font-medium">{formatCurrency(bill.total, settings?.currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {stats?.popularFoods?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Popular Foods</h2>
              <div className="space-y-2">
                {stats.popularFoods.map((food) => (
                  <div key={food._id} className="card p-3 text-sm flex justify-between">
                    <span>{food.name}</span>
                    <span className="text-gray-500">{food.orderCount} orders</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

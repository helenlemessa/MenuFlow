import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { getDashboardStats, getRevenueChart, getOrdersPerDay } from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import { formatCurrency } from '../../utils/helpers';
import { TableSkeleton } from '../../components/LoadingSkeleton';

const Analytics = () => {
  const { settings } = useSettings();
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDashboardStats(),
      getRevenueChart(days),
      getOrdersPerDay(days),
    ])
      .then(([statsRes, revRes, ordRes]) => {
        setStats(statsRes.data);
        setRevenue(revRes.data);
        setOrders(ordRes.data);
      })
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) return <TableSkeleton rows={8} />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <select className="input-field w-auto" value={days} onChange={(e) => setDays(Number(e.target.value))}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Revenue", value: formatCurrency(stats?.todayRevenue || 0, settings?.currency) },
          { label: 'Monthly Revenue', value: formatCurrency(stats?.monthlyRevenue || 0, settings?.currency) },
          { label: "Today's Orders", value: stats?.todayOrders || 0 },
          { label: 'Avg Order Value', value: formatCurrency(stats?.avgOrderValue || 0, settings?.currency) },
        ].map((item) => (
          <div key={item.label} className="card p-5">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Daily Revenue</h2>
          {revenue.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">No revenue data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(v, settings?.currency)} />
                <Line type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Orders Per Day</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">No order data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={orders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Popular Foods</h2>
          <div className="space-y-3">
            {stats?.popularFoods?.length === 0 ? (
              <p className="text-gray-500 text-sm">No data yet</p>
            ) : stats?.popularFoods?.map((food, i) => (
              <div key={food._id} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="flex-1">{food.name}</span>
                <span className="text-sm text-gray-500">{food.orderCount} orders</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Least Ordered Foods</h2>
          <div className="space-y-3">
            {stats?.leastOrdered?.length === 0 ? (
              <p className="text-gray-500 text-sm">No data yet</p>
            ) : stats?.leastOrdered?.map((food) => (
              <div key={food._id} className="flex justify-between text-sm">
                <span>{food.name}</span>
                <span className="text-gray-500">{food.orderCount} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Droplets, FileText, Hand, UtensilsCrossed, CheckCircle,
  CreditCard, Banknote, Smartphone, Building,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getPendingRequests, completeRequest, getTables, getTableBill, markBillPaid, getRecentOrders,
} from '../../services/api';
import { useSocket } from '../../contexts/SocketContext';
import { useSettings } from '../../contexts/SettingsContext';
import { formatCurrency } from '../../utils/helpers';
import Modal from '../../components/Modal';
import BillSummary from '../../components/BillSummary';

const requestIcons = {
  waiter: Hand, water: Droplets, napkins: UtensilsCrossed, sauce: Bell, bill: FileText,
};

const requestLabels = {
  waiter: 'Need Waiter', water: 'Need Water', napkins: 'Need Napkins', sauce: 'Need Sauce', bill: 'Request Bill',
};

const paymentMethods = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'telebirr', label: 'Telebirr', icon: Smartphone },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Building },
];

const WaiterDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [tables, setTables] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableBill, setTableBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const { settings } = useSettings();

  const fetchData = useCallback(async () => {
    try {
      const [reqRes, tableRes, orderRes] = await Promise.all([
        getPendingRequests(), getTables(), getRecentOrders(5),
      ]);
      setRequests(reqRes.data);
      setTables(tableRes.data);
      setRecentOrders(orderRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!socket) return;
    socket.on('newRequest', (req) => {
      setRequests((prev) => [req, ...prev]);
      toast(`Table ${req.tableNumber}: ${requestLabels[req.type]}`, { icon: '🔔' });
    });
    socket.on('requestCompleted', (req) => {
      setRequests((prev) => prev.filter((r) => r._id !== req._id));
    });
    socket.on('newOrder', () => fetchData());
    socket.on('billPaid', () => fetchData());
    return () => {
      socket.off('newRequest');
      socket.off('requestCompleted');
      socket.off('newOrder');
      socket.off('billPaid');
    };
  }, [socket, fetchData]);

  const handleCompleteRequest = async (id) => {
    try {
      await completeRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      toast.success('Request completed');
    } catch (error) {
      toast.error('Failed to complete request');
    }
  };

  const openTableBill = async (tableNumber) => {
    try {
      const res = await getTableBill(tableNumber);
      setTableBill(res.data);
      setSelectedTable(tableNumber);
      setShowBillModal(true);
    } catch (error) {
      toast.error('No orders for this table');
    }
  };

  const handleMarkPaid = async (paymentMethod) => {
    try {
      await markBillPaid({ tableNumber: selectedTable, paymentMethod });
      setShowBillModal(false);
      setTableBill(null);
      fetchData();
      toast.success('Bill marked as paid!');
    } catch (error) {
      toast.error('Failed to mark as paid');
    }
  };

  const billRequests = requests.filter((r) => r.type === 'bill');
  const otherRequests = requests.filter((r) => r.type !== 'bill');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Waiter Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending Requests', value: requests.length, color: 'text-blue-600' },
          { label: 'Bill Requests', value: billRequests.length, color: 'text-green-600' },
          { label: 'Occupied Tables', value: tables.filter((t) => t.isOccupied).length, color: 'text-amber-600' },
          { label: 'Total Tables', value: tables.length, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Requests */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Customer Requests</h2>
          {otherRequests.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {otherRequests.map((req) => {
                const Icon = requestIcons[req.type];
                return (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium">Table {req.tableNumber}</p>
                        <p className="text-sm text-gray-500">{requestLabels[req.type]}</p>
                      </div>
                    </div>
                    <button onClick={() => handleCompleteRequest(req._id)} className="btn-primary !px-3 !py-2 text-sm">
                      <CheckCircle className="w-4 h-4" /> Done
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {billRequests.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3 text-green-600">Bill Requests</h3>
              <div className="space-y-3">
                {billRequests.map((req) => (
                  <div key={req._id} className="card p-4 flex items-center justify-between border-l-4 border-l-green-500">
                    <div>
                      <p className="font-medium">Table {req.tableNumber}</p>
                      <p className="text-sm text-gray-500">Requesting bill</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openTableBill(req.tableNumber)} className="btn-secondary !px-3 !py-2 text-sm">
                        View Bill
                      </button>
                      <button onClick={() => handleCompleteRequest(req._id)} className="btn-primary !px-3 !py-2 text-sm">
                        Done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tables */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Tables</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {tables.map((table) => (
              <button
                key={table._id}
                onClick={() => openTableBill(table.number)}
                className={`card p-4 text-center transition-all hover:shadow-lg ${
                  table.isOccupied ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/10' : ''
                }`}
              >
                <p className="text-xl font-bold">{table.number}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {table.isOccupied ? 'Occupied' : 'Available'}
                </p>
              </button>
            ))}
          </div>

          {/* Recent Orders */}
          <h2 className="text-lg font-semibold mt-8 mb-4">Recent Orders</h2>
          <div className="space-y-2">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order._id} className="card p-3 flex justify-between text-sm">
                <span>Table {order.tableNumber} - {order.items?.length} items</span>
                <span className="font-medium">{formatCurrency(order.total, settings?.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bill Modal */}
      <Modal isOpen={showBillModal} onClose={() => setShowBillModal(false)} title={`Table ${selectedTable} Bill`} size="lg">
        {tableBill && (
          <div>
            {tableBill.orders?.map((order) => (
              <div key={order._id} className="mb-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-sm">
                    <span>{item.quantity}x {item.foodName}</span>
                    <span>{formatCurrency(item.subtotal, settings?.currency)}</span>
                  </div>
                ))}
              </div>
            ))}
            <BillSummary subtotal={tableBill.subtotal} />
            <div className="grid grid-cols-2 gap-3 mt-6">
              {paymentMethods.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleMarkPaid(id)}
                  className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WaiterDashboard;

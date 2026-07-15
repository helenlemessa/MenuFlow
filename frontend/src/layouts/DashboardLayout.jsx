import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, UtensilsCrossed, FolderOpen, Leaf, Table2,
  Settings, Users, BarChart3, LogOut, Menu, X, ChefHat, Bell,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/foods', icon: UtensilsCrossed, label: 'Foods' },
  { to: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { to: '/admin/ingredients', icon: Leaf, label: 'Ingredients' },
  { to: '/admin/tables', icon: Table2, label: 'Tables' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const waiterLinks = [
  { to: '/waiter', icon: LayoutDashboard, label: 'Dashboard' },
];

const kitchenLinks = [
  { to: '/kitchen', icon: ChefHat, label: 'Orders' },
];

const DashboardLayout = ({ type = 'admin' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = type === 'admin' ? adminLinks : type === 'waiter' ? waiterLinks : kitchenLinks;
  const title = type === 'admin' ? 'Admin Panel' : type === 'waiter' ? 'Waiter Dashboard' : 'Kitchen Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="font-display text-xl font-bold text-gradient">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.name} ({user?.role})</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === to
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
        {type === 'admin' && (
          <>
            <Link to="/waiter" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell className="w-5 h-5" /> Waiter View
            </Link>
            <Link to="/kitchen" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
              <ChefHat className="w-5 h-5" /> Kitchen View
            </Link>
          </>
        )}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed h-full">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <Link to="/" className="text-sm text-primary-600 hover:underline">View Site</Link>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

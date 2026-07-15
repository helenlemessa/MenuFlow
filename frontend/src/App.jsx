import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerLayout from './layouts/CustomerLayout';
import DashboardLayout from './layouts/DashboardLayout';

const Home = lazy(() => import('./pages/customer/Home'));
const Menu = lazy(() => import('./pages/customer/Menu'));
const FoodDetails = lazy(() => import('./pages/customer/FoodDetails'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const About = lazy(() => import('./pages/customer/About'));
const Contact = lazy(() => import('./pages/customer/Contact'));
const Privacy = lazy(() => import('./pages/customer/Privacy'));
const Terms = lazy(() => import('./pages/customer/Terms'));
const NotFound = lazy(() => import('./pages/customer/NotFound'));
const Login = lazy(() => import('./pages/auth/Login'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Foods = lazy(() => import('./pages/admin/Foods'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Ingredients = lazy(() => import('./pages/admin/Ingredients'));
const Tables = lazy(() => import('./pages/admin/Tables'));
const Users = lazy(() => import('./pages/admin/Users'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const Settings = lazy(() => import('./pages/admin/Settings'));

const KitchenDashboard = lazy(() => import('./pages/kitchen/KitchenDashboard'));
const WaiterDashboard = lazy(() => import('./pages/waiter/WaiterDashboard'));

const App = () => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="food/:id" element={<FoodDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
      </Route>

      <Route path="login" element={<Login />} />

      <Route
        path="admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout type="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="foods" element={<Foods />} />
        <Route path="categories" element={<Categories />} />
        <Route path="ingredients" element={<Ingredients />} />
        <Route path="tables" element={<Tables />} />
        <Route path="users" element={<Users />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="kitchen"
        element={
          <ProtectedRoute roles={['kitchen', 'admin']}>
            <DashboardLayout type="kitchen" />
          </ProtectedRoute>
        }
      >
        <Route index element={<KitchenDashboard />} />
      </Route>

      <Route
        path="waiter"
        element={
          <ProtectedRoute roles={['waiter', 'admin']}>
            <DashboardLayout type="waiter" />
          </ProtectedRoute>
        }
      >
        <Route index element={<WaiterDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default App;

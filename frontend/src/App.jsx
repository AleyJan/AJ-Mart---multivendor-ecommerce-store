import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ActivationPage from "./pages/ActivationPage";
import ProfilePage from "./pages/ProfilePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BestSellingPage from "./pages/BestSellingPage";
import EventsPage from "./pages/EventsPage";
import FAQPage from "./pages/FAQPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ShopCreate from "./components/Shop/ShopCreate";
import ShopLogin from "./components/Shop/ShopLogin";
import ShopActivationPage from "./pages/ShopActivationPage";
import ShopPreviewPage from "./pages/ShopPreviewPage";
import ShopHomePage from "./pages/ShopHomePage";
import ShopDashboardLayout from "./pages/ShopDashboardLayout";
import DashboardHero from "./components/Shop/DashboardHero";
import DashboardComingSoon from "./components/Shop/DashboardComingSoon";
import CreateProduct from "./components/Shop/CreateProduct";
import AllProducts from "./components/Shop/AllProducts";
import AllOrders from "./components/Shop/AllOrders";
import CouponCodes from "./components/Shop/CouponCodes";
import ShopSettings from "./components/Shop/ShopSettings";
import DashboardMessages from "./components/Shop/DashboardMessages";
import WithdrawMoney from "./components/Shop/WithdrawMoney";
import DashboardRefunds from "./components/Shop/DashboardRefunds";
import UserInbox from "./pages/UserInbox";
import OrderDetails from "./pages/OrderDetails";
import TrackOrder from "./pages/TrackOrder";
import AdminDashboardLayout from "./pages/AdminDashboardLayout";
import AdminDashboardMain from "./components/Admin/AdminDashboardMain";
import AdminAllUsers from "./components/Admin/AdminAllUsers";
import AdminAllSellers from "./components/Admin/AdminAllSellers";
import AdminAllOrders from "./components/Admin/AdminAllOrders";
import AdminAllProducts from "./components/Admin/AdminAllProducts";
import AdminWithdraw from "./components/Admin/AdminWithdraw";
import CreateEvent from "./components/Shop/CreateEvent";
import AllEvents from "./components/Shop/AllEvents";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/activation/:activation_token" element={<ActivationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/inbox" element={<UserInbox />} />
        <Route path="/user/order/:id" element={<OrderDetails />} />
        <Route path="/user/track/order/:id" element={<TrackOrder />} />

        {/* Admin panel */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboardLayout active={1}>
              <AdminDashboardMain />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="/admin-orders"
          element={
            <AdminDashboardLayout active={2}>
              <AdminAllOrders />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="/admin-sellers"
          element={
            <AdminDashboardLayout active={3}>
              <AdminAllSellers />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="/admin-users"
          element={
            <AdminDashboardLayout active={4}>
              <AdminAllUsers />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="/admin-products"
          element={
            <AdminDashboardLayout active={5}>
              <AdminAllProducts />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="/admin-withdraw-request"
          element={
            <AdminDashboardLayout active={6}>
              <AdminWithdraw />
            </AdminDashboardLayout>
          }
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order/success" element={<OrderSuccessPage />} />
        <Route path="/shop-create" element={<ShopCreate />} />
        <Route path="/shop-login" element={<ShopLogin />} />
        <Route
          path="/shop/activation/:activation_token"
          element={<ShopActivationPage />}
        />
        <Route path="/shop/preview/:name" element={<ShopPreviewPage />} />
        <Route path="/shop/me" element={<ShopHomePage />} />

        {/* Seller dashboard (frontend mockup) */}
        <Route
          path="/dashboard"
          element={
            <ShopDashboardLayout active={1}>
              <DashboardHero />
            </ShopDashboardLayout>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <ShopDashboardLayout active={2}>
              <AllOrders />
            </ShopDashboardLayout>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <ShopDashboardLayout active={3}>
              <AllProducts />
            </ShopDashboardLayout>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <ShopDashboardLayout active={4}>
              <CreateProduct />
            </ShopDashboardLayout>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <ShopDashboardLayout active={5}>
              <AllEvents />
            </ShopDashboardLayout>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <ShopDashboardLayout active={6}>
              <CreateEvent />
            </ShopDashboardLayout>
          }
        />
        <Route
          path="/dashboard-withdraw-money"
          element={
            <ShopDashboardLayout active={7}>
              <WithdrawMoney />
            </ShopDashboardLayout>
          }
        />
        <Route
          path="/dashboard-messages"
          element={
            <ShopDashboardLayout active={8}>
              <DashboardMessages />
            </ShopDashboardLayout>
          }
        />
        <Route
          path="/dashboard-coupouns"
          element={
            <ShopDashboardLayout active={9}>
              <CouponCodes />
            </ShopDashboardLayout>
          }
        />
        <Route
          path="/dashboard-refunds"
          element={
            <ShopDashboardLayout active={10}>
              <DashboardRefunds />
            </ShopDashboardLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <ShopDashboardLayout active={11}>
              <ShopSettings />
            </ShopDashboardLayout>
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;

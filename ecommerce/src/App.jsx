import React from "react";
import { ThemeProvider } from "./theme/ThemeContext";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


// ======================================================
// CUSTOMER PAGES
// ======================================================

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Cart from "./Cart";
import Billing from "./Billing";
import Wishlist from "./Wishlist";


// ======================================================
// ADMIN PAGES
// ======================================================

import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";

// ========================================================
// SUOER ADMIN
// ==================================================================

import SuperAdminLogin from "./superadmin/SuperAdminLogin";
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";
import ManageAdmins from "./superadmin/ManageAdmins";
import AddAdmin from "./superadmin/AddAdmin";
import EditAdmin from "./superadmin/EditAdmin";
import AllProducts from "./superadmin/AllProducts";
import  SuperAdminEditProduct from "./superadmin/EditProduct";
import SuperAdminOrders from "./superadmin/SuperAdminOrders";
import SuperAdminCustomers from "./superadmin/SuperAdminCustomers";
import SuperAdminReports from "./superadmin/SuperAdminReports";
// ======================================================
// NEW ADMIN PAGES
// ======================================================

import AdminOrders from "./admin/AdminOrders";
import AdminCustomers from "./admin/AdminCustomers";


function App() {

  return (
     <ThemeProvider>

    <BrowserRouter>

      <Routes>


        {/* ==================================================
            CUSTOMER ROUTES
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/billing"
          element={<Billing />}
        />


        {/* ==================================================
            ADMIN ROUTES
        ================================================== */}

        {/* ADMIN SIGNUP */}

        <Route
          path="/admin/signup"
          element={<AdminSignup />}
        />


        {/* ADMIN LOGIN */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />


        {/* ADMIN PRODUCTS */}

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />


        {/* ADD PRODUCT */}

        <Route
          path="/admin/products/add"
          element={<AddProduct />}
        />


        {/* EDIT PRODUCT */}

        <Route
          path="/admin/products/edit/:id"
          element={<EditProduct />}
        />


        {/* ==================================================
            ADMIN ORDERS
        ================================================== */}

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />


        {/* ==================================================
            ADMIN CUSTOMERS
        ================================================== */}

        <Route
          path="/admin/users"
          element={<AdminCustomers />}
        />

        <Route
  path="/superadmin/login"
  element={<SuperAdminLogin />}
/>
<Route
  path="/superadmin"
  element={<SuperAdminDashboard />}
/>
<Route
  path="/superadmin/admins"
  element={<ManageAdmins />}
/>
<Route
  path="/superadmin/admins/add"
  element={<AddAdmin />}
/>
<Route
  path="/superadmin/admins/edit"
  element={<EditAdmin />}
/>
<Route
  path="/superadmin/products"
  element={<AllProducts />}
/>
<Route
  path="/superadmin/products/edit/:id"
  element={<EditProduct />}
/>
<Route
  path="/superadmin/orders"
  element={<SuperAdminOrders />}
/>
<Route
  path="/superadmin/users"
  element={<SuperAdminCustomers />}
/>
<Route
  path="/superadmin/reports"
  element={<SuperAdminReports />}
/>
      </Routes>

    </BrowserRouter>
</ThemeProvider>
  );

}

export default App;
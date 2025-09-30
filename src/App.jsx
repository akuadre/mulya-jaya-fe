import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Orders from "./pages/Orders.jsx";
import Users from "./pages/Users.jsx";
import Products from "./pages/Products.jsx";
import Reports from "./pages/Reports.jsx";
import About from "./pages/About.jsx";

import AppLayout from "./layouts/AppLayout.jsx";

import { GuestRoute, ProtectedRoute } from "./routes/AuthRoutes.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth / Login */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/about" element={<About />} /> {/* Tambahin ini */}
          </Route>
        </Route>

        {/* Kalau route tidak ada → Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

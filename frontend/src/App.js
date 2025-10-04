import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected route */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardRouter />
                </RequireAuth>
              }
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>

      {/* Global Style Block */}
      <style jsx global>{`
        /* Global Reset and Typography */
        html, body, #root, .app-main-content {
          margin: 0;
          padding: 0;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }

        /* Application Background Gradient */
        body {
          background: linear-gradient(135deg, #f7f9fc 0%, #e0e6ed 100%);
        }

        /* Loading/Status Message Styling */
        .status-message-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
            font-size: 1.2em;
            color: #555;
            background: linear-gradient(135deg, #f7f9fc 0%, #e0e6ed 100%);
        }
      `}</style>
    </AuthProvider>
  );
}

// Route guard
const RequireAuth = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="status-message-container">
        <p>Loading application data...</p>
    </div>
  ); // wait until auth loads
  if (!user) return <Navigate to="/login" />; // redirect if not logged in

  return children;
};

// Choose dashboard based on role
const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "manager":
      return <ManagerDashboard />;
    default:
      return <UserDashboard />;
  }
};

export default App;
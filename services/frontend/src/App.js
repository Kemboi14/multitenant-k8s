import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import TenantSettings from './components/TenantSettings';
import Analytics from './components/Analytics';
import Products from './components/Products';
import Payments from './components/Payments';
import EnterpriseFeatures from './components/EnterpriseFeatures';
import CRM from './components/CRM';
import HR from './components/HR';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/users" 
            element={user ? <Users user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/settings" 
            element={user ? <TenantSettings user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/analytics" 
            element={user ? <Analytics user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/products" 
            element={user ? <Products user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/payments" 
            element={user ? <Payments user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/crm" 
            element={user ? <CRM user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/hr" 
            element={user ? <HR user={user} /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

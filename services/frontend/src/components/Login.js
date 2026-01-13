import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tenant_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, formData);
      const { access_token, tenant_id, user_id, role } = response.data;
      
      onLogin(access_token, {
        email: formData.email,
        tenant_id,
        user_id,
        role
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <div className="login-logo">M</div>
          <h1 className="login-title">MultiTenant Platform</h1>
          <p className="login-subtitle">Enterprise SaaS Solution</p>
          <div className="enterprise-badge">
            🏢 Enterprise Grade
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tenant_id" className="form-label">Tenant ID</label>
            <input
              type="text"
              id="tenant_id"
              name="tenant_id"
              value={formData.tenant_id}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your tenant ID"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Signing in...
              </>
            ) : (
              <>
                Sign In
              </>
            )}
          </button>
          
          <div className="security-info">
            Secure login with enterprise-grade encryption
          </div>
        </form>

        <div className="footer-links">
          <a href="#help">Help</a>
          <span>•</span>
          <a href="#privacy">Privacy</a>
          <span>•</span>
          <a href="#terms">Terms</a>
        </div>
      </div>
    </div>
  );
}

export default Login;

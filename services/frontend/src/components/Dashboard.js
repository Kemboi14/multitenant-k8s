import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Users from './Users';
import TenantSettings from './TenantSettings';
import Analytics from './Analytics';
import Products from './Products';
import Payments from './Payments';
import EnterpriseFeatures from './EnterpriseFeatures';
import CRM from './CRM';
import HR from './HR';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleModuleClick = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">M</div>
          <h1 className="dashboard-title">MultiTenant Platform</h1>
        </div>
        
        <div className="user-info">
          <button 
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="user-avatar">👤</div>
            <span className="user-name">{user?.email?.split('@')[0]}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="user-info">
                    <div className="user-avatar-large">👤</div>
                    <div>
                      <div className="user-name-large">{user?.email}</div>
                      <div className="user-role">Administrator</div>
                    </div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                
                <div className="menu-section">
                  <h4 className="menu-title">🏢 Core Management</h4>
                  <div className="menu-items">
                    <button className="menu-item" onClick={() => handleModuleClick('/users')}>
                      <span className="menu-icon">👥</span>
                      <span className="menu-text">User Management</span>
                    </button>
                    <button className="menu-item" onClick={() => handleModuleClick('/settings')}>
                      <span className="menu-icon">⚙️</span>
                      <span className="menu-text">Tenant Settings</span>
                    </button>
                  </div>
                </div>
                
                <div className="menu-section">
                  <h4 className="menu-title">📊 Business Operations</h4>
                  <div className="menu-items">
                    <button className="menu-item" onClick={() => handleModuleClick('/analytics')}>
                      <span className="menu-icon">📈</span>
                      <span className="menu-text">Analytics & Reports</span>
                    </button>
                    <button className="menu-item" onClick={() => handleModuleClick('/products')}>
                      <span className="menu-icon">🛍️</span>
                      <span className="menu-text">Product Management</span>
                    </button>
                    <button className="menu-item" onClick={() => handleModuleClick('/payments')}>
                      <span className="menu-icon">💳</span>
                      <span className="menu-text">Payment Methods</span>
                    </button>
                  </div>
                </div>
                
                <div className="menu-section">
                  <h4 className="menu-title">💼 Enterprise Tools</h4>
                  <div className="menu-items">
                    <button className="menu-item" onClick={() => handleModuleClick('/crm')}>
                      <span className="menu-icon">💼</span>
                      <span className="menu-text">CRM Management</span>
                    </button>
                    <button className="menu-item" onClick={() => handleModuleClick('/hr')}>
                      <span className="menu-icon">👥</span>
                      <span className="menu-text">HR Management</span>
                    </button>
                    <button className="menu-item" onClick={() => handleModuleClick('/enterprise')}>
                      <span className="menu-icon">🚀</span>
                      <span className="menu-text">Enterprise Features</span>
                    </button>
                  </div>
                </div>
                
                <div className="menu-section">
                  <h4 className="menu-title">🔧 System</h4>
                  <div className="menu-items">
                    <button className="menu-item" onClick={() => handleModuleClick('/logs')}>
                      <span className="menu-icon">📋</span>
                      <span className="menu-text">System Logs</span>
                    </button>
                    <button className="menu-item" onClick={() => handleModuleClick('/backups')}>
                      <span className="menu-icon">💾</span>
                      <span className="menu-text">Backups</span>
                    </button>
                    <button className="menu-item" onClick={() => handleModuleClick('/api')}>
                      <span className="menu-icon">🔑</span>
                      <span className="menu-text">API Keys</span>
                    </button>
                    <button className="menu-item" onClick={() => handleModuleClick('/integrations')}>
                      <span className="menu-icon">🔗</span>
                      <span className="menu-text">Integrations</span>
                    </button>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="menu-actions">
                  <button className="menu-item logout" onClick={handleLogoutClick}>
                    <span className="logout-icon">🚪</span>
                    <span className="menu-text">Logout</span>
                  </button>
                </div>
              </div>
            )}
        </div>
      </header>

      <nav className="dashboard-nav">
        <div className="nav-section">
          <h3 className="nav-title">🏢 Core Management</h3>
          <div className="nav-grid">
            <button 
              className="nav-card"
              onClick={() => handleModuleClick('/users')}
            >
              <div className="nav-icon">👥</div>
              <div className="nav-content">
                <h4>User Management</h4>
                <p>Manage users with role-based access control</p>
              </div>
            </button>
            
            <button 
              className="nav-card"
              onClick={() => handleModuleClick('/settings')}
            >
              <div className="nav-icon">⚙️</div>
              <div className="nav-content">
                <h4>Tenant Settings</h4>
                <p>Configure tenant settings and branding</p>
              </div>
            </button>
          </div>
        </div>

        <div className="nav-section">
          <h3 className="nav-title">📊 Business Operations</h3>
          <div className="nav-grid">
            <button 
              className="nav-card"
              onClick={() => handleModuleClick('/analytics')}
            >
              <div className="nav-icon">📈</div>
              <div className="nav-content">
                <h4>Analytics & Reports</h4>
                <p>View comprehensive analytics and insights</p>
              </div>
            </button>
            
            <button 
              className="nav-card"
              onClick={() => handleModuleClick('/products')}
            >
              <div className="nav-icon">🛍️</div>
              <div className="nav-content">
                <h4>Product Management</h4>
                <p>Manage inventory and product catalog</p>
              </div>
            </button>
            
            <button 
              className="nav-card"
              onClick={() => handleModuleClick('/payments')}
            >
              <div className="nav-icon">💳</div>
              <div className="nav-content">
                <h4>Payment Methods</h4>
                <p>Configure payment processing options</p>
              </div>
            </button>
          </div>
        </div>

        <div className="nav-section">
          <h3 className="nav-title">💼 Enterprise Tools</h3>
          <div className="nav-grid">
            <button 
              className="nav-card"
              onClick={() => handleModuleClick('/crm')}
            >
              <div className="nav-icon">💼</div>
              <div className="nav-content">
                <h4>CRM Management</h4>
                <p>Customer relationships and sales pipeline</p>
              </div>
            </button>
            
            <button 
              className="nav-card"
              onClick={() => handleModuleClick('/hr')}
            >
              <div className="nav-icon">👥</div>
              <div className="nav-content">
                <h4>HR Management</h4>
                <p>Employee, payroll, and leave management</p>
              </div>
            </button>
            
            <button 
              className="nav-card"
              onClick={() => handleModuleClick('/enterprise')}
            >
              <div className="nav-icon">🚀</div>
              <div className="nav-content">
                <h4>Enterprise Features</h4>
                <p>Advanced capabilities and pricing</p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome back, {user?.email?.split('@')[0]}!</h2>
          <p className="welcome-subtitle">Manage your enterprise SaaS platform with powerful tools</p>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-number">8</div>
              <div className="stat-label">Total Modules</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-info">
              <div className="stat-number">Enterprise</div>
              <div className="stat-label">Plan Level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

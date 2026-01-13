import React, { useState } from 'react';
import './TenantSettings.css';

function TenantSettings({ user }) {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    tenantName: 'Demo Company',
    domain: 'demo.com',
    description: 'Enterprise SaaS solution for modern businesses',
    timezone: 'UTC',
    language: 'en',
    
    // Branding Settings
    primaryColor: '#34a853',
    logoUrl: '',
    companyName: 'Demo Company',
    supportEmail: 'support@demo.com',
    
    // Enterprise Features
    twoFactorAuth: true,
    ssoEnabled: false,
    apiAccess: true,
    auditLogs: true,
    advancedSecurity: true,
    customDomains: false,
    prioritySupport: true,
    
    // Notification Settings
    emailNotifications: true,
    securityAlerts: true,
    weeklyReports: false,
    maintenanceAlerts: true,
  });
  
  const [saveStatus, setSaveStatus] = useState('');

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSwitchToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = () => {
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '🏢' },
    { id: 'branding', label: 'Branding', icon: '🎨' },
    { id: 'enterprise', label: 'Enterprise', icon: '🚀' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div className="tenant-settings-container">
      <div className="settings-header">
        <h1 className="settings-title">
          Tenant Settings
          <span className="enterprise-badge">Enterprise</span>
        </h1>
        <button className="save-settings-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      {saveStatus === 'success' && (
        <div className="success-message">
          Settings saved successfully!
        </div>
      )}

      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ marginRight: '8px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="settings-content">
        {activeTab === 'general' && (
          <div className="settings-section">
            <h2 className="section-title">
              🏢 General Settings
            </h2>
            <p className="section-description">
              Configure your tenant's basic information and preferences
            </p>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  🏢 Company Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.tenantName}
                  onChange={(e) => handleInputChange('tenantName', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  🌐 Domain
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.domain}
                  onChange={(e) => handleInputChange('domain', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  📝 Description
                </label>
                <textarea
                  className="form-input form-textarea"
                  value={settings.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  🌍 Timezone
                </label>
                <select
                  className="form-input"
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  🌐 Language
                </label>
                <select
                  className="form-input"
                  value={settings.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="settings-section">
            <h2 className="section-title">
              🎨 Branding Settings
            </h2>
            <p className="section-description">
              Customize the appearance and branding of your tenant
            </p>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  🎨 Primary Color
                </label>
                <div className="color-picker-group">
                  <div 
                    className="color-preview" 
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <input
                    type="text"
                    className="form-input color-input"
                    value={settings.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  🖼️ Company Logo
                </label>
                <div className="upload-area">
                  <div className="logo-preview">
                    {settings.logoUrl ? '📷' : '🏢'}
                  </div>
                  <div className="upload-text">Click to upload logo</div>
                  <div className="upload-hint">PNG, JPG up to 2MB</div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  📧 Support Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={settings.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'enterprise' && (
          <div className="settings-section">
            <h2 className="section-title">
              🚀 Enterprise Features
            </h2>
            <p className="section-description">
              Manage advanced enterprise features and security settings
            </p>
            
            <div className="form-grid">
              <div className="switch-group">
                <label className="switch-label">
                  🔐 Two-Factor Authentication
                </label>
                <div 
                  className={`switch ${settings.twoFactorAuth ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('twoFactorAuth')}
                />
              </div>
              
              <div className="switch-group">
                <label className="switch-label">
                  🔑 Single Sign-On (SSO)
                </label>
                <div 
                  className={`switch ${settings.ssoEnabled ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('ssoEnabled')}
                />
              </div>
              
              <div className="switch-group">
                <label className="switch-label">
                  🔌 API Access
                </label>
                <div 
                  className={`switch ${settings.apiAccess ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('apiAccess')}
                />
              </div>
              
              <div className="switch-group">
                <label className="switch-label">
                  📋 Audit Logs
                </label>
                <div 
                  className={`switch ${settings.auditLogs ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('auditLogs')}
                />
              </div>
              
              <div className="switch-group">
                <label className="switch-label">
                  🛡️ Advanced Security
                </label>
                <div 
                  className={`switch ${settings.advancedSecurity ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('advancedSecurity')}
                />
              </div>
              
              <div className="switch-group">
                <label className="switch-label">
                  🌐 Custom Domains
                </label>
                <div 
                  className={`switch ${settings.customDomains ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('customDomains')}
                />
              </div>
              
              <div className="switch-group">
                <label className="switch-label">
                  ⭐ Priority Support
                </label>
                <div 
                  className={`switch ${settings.prioritySupport ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('prioritySupport')}
                />
              </div>
            </div>
            
            <div className="feature-preview">
              <div className="feature-card">
                <div className="feature-icon">🔐</div>
                <div className="feature-name">2FA Protection</div>
                <div className="feature-description">Enhanced security</div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <div className="feature-name">Analytics</div>
                <div className="feature-description">Business insights</div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <div className="feature-name">Performance</div>
                <div className="feature-description">Optimized speed</div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛡️</div>
                <div className="feature-name">Security</div>
                <div className="feature-description">Enterprise grade</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h2 className="section-title">
              🔔 Notification Settings
            </h2>
            <p className="section-description">
              Configure how and when you receive notifications
            </p>
            
            <div className="form-grid">
              <div className="switch-group">
                <label className="switch-label">
                  📧 Email Notifications
                </label>
                <div 
                  className={`switch ${settings.emailNotifications ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('emailNotifications')}
                />
              </div>
              
              <div className="switch-group">
                <label className="switch-label">
                  🚨 Security Alerts
                </label>
                <div 
                  className={`switch ${settings.securityAlerts ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('securityAlerts')}
                />
              </div>
              
              <div className="switch-group">
                <label className="switch-label">
                  📊 Weekly Reports
                </label>
                <div 
                  className={`switch ${settings.weeklyReports ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('weeklyReports')}
                />
              </div>
              
              <div className="switch-group">
                <label className="switch-label">
                  🔧 Maintenance Alerts
                </label>
                <div 
                  className={`switch ${settings.maintenanceAlerts ? 'active' : ''}`}
                  onClick={() => handleSwitchToggle('maintenanceAlerts')}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TenantSettings;

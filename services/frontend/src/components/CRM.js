import React, { useState, useEffect } from 'react';
import './CRM.css';

function CRM({ user }) {
  const [activeTab, setActiveTab] = useState('customers');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'prospect',
    value: '',
    lastContact: ''
  });
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    status: 'new'
  });
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockCustomers = [
      {
        id: 1,
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-0101',
        status: 'active',
        value: '$125,000',
        lastContact: '2024-01-12'
      },
      {
        id: 2,
        name: 'Tech Startup Inc',
        email: 'info@techstartup.io',
        phone: '+1-555-0102',
        status: 'prospect',
        value: '$45,000',
        lastContact: '2024-01-11'
      },
      {
        id: 3,
        name: 'Global Solutions Ltd',
        email: 'sales@globalsolutions.co',
        phone: '+1-555-0103',
        status: 'active',
        value: '$89,000',
        lastContact: '2024-01-10'
      }
    ];

    const mockDeals = [
      {
        id: 1,
        title: 'Enterprise License - Q1',
        customer: 'Acme Corporation',
        value: 75000,
        status: 'won',
        probability: 85,
        closeDate: '2024-01-15',
        description: 'Multi-year enterprise agreement with premium support'
      },
      {
        id: 2,
        title: 'Professional Services - Tech Startup',
        customer: 'Tech Startup Inc',
        value: 25000,
        status: 'in-progress',
        probability: 60,
        closeDate: '2024-01-20',
        description: 'Professional services and consulting package'
      },
      {
        id: 3,
        title: 'Cloud Migration - Global Solutions',
        customer: 'Global Solutions Ltd',
        value: 45000,
        status: 'lost',
        probability: 25,
        closeDate: '2024-01-08',
        description: 'Lost to competitor due to pricing concerns'
      }
    ];

    setCustomers(mockCustomers);
    setDeals(mockDeals);
    setLoading(false);
  }, []);

  const handleAddCustomer = () => {
    const customerWithId = {
      ...newCustomer,
      id: Date.now(),
      lastContact: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [...prev, customerWithId]);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      status: 'prospect',
      value: '',
      lastContact: ''
    });
    setShowAddCustomer(false);
  };

  const handleAddLead = () => {
    const leadWithId = {
      ...newLead,
      id: Date.now()
    };
    setCustomers(prev => [...prev, leadWithId]);
    setNewLead({
      name: '',
      email: '',
      phone: '',
      company: '',
      source: '',
      status: 'new'
    });
    setShowAddLead(false);
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    }
  };

  const handleUpdateDealStatus = (dealId, newStatus) => {
    setDeals(prev => prev.map(deal => 
      deal.id === dealId ? { ...deal, status: newStatus } : deal
    ));
  };

  const handleCustomerChange = (field, value) => {
    setNewCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLeadChange = (field, value) => {
    setNewLead(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'inactive': return 'inactive';
      case 'prospect': return 'prospect';
      default: return 'inactive';
    }
  };

  const getDealStatusClass = (status) => {
    switch (status) {
      case 'won': return 'won';
      case 'lost': return 'lost';
      case 'in-progress': return 'in-progress';
      default: return 'in-progress';
    }
  };

  const crmStats = [
    { label: 'Total Customers', value: customers.length },
    { label: 'Active Deals', value: deals.filter(d => d.status === 'in-progress').length },
    { label: 'Won Deals', value: deals.filter(d => d.status === 'won').length },
    { label: 'Pipeline Value', value: `$${deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}` }
  ];

  if (loading) return <div className="loading"><div className="loading-spinner"></div></div>;

  return (
    <div className="crm-container">
      <div className="crm-header">
        <h1 className="crm-title">
          💼 CRM Management
        </h1>
      </div>

      <div className="crm-stats">
        {crmStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="crm-tabs">
        <button
          className={`tab-button ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          👥 Customers
        </button>
        <button
          className={`tab-button ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          🎯 Leads
        </button>
        <button
          className={`tab-button ${activeTab === 'deals' ? 'active' : ''}`}
          onClick={() => setActiveTab('deals')}
        >
          🤝 Deals Pipeline
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      <div className="crm-content">
        {activeTab === 'customers' && (
          <div className="customers-section">
            <div className="section-header">
              <h2 className="section-title">
                👥 Customer Management
              </h2>
              <button 
                className="add-customer-btn"
                onClick={() => setShowAddCustomer(!showAddCustomer)}
              >
                {showAddCustomer ? '✕ Cancel' : '➕ Add Customer'}
              </button>
              <button 
                className="add-customer-btn"
                onClick={() => setShowAddLead(!showAddLead)}
              >
                {showAddLead ? '✕ Cancel' : '🎯 Add Lead'}
              </button>
            </div>

            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Last Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-name">
                        {customer.name}
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${customer.email}`} className="customer-email">
                        {customer.email}
                      </a>
                    </td>
                    <td>{customer.phone}</td>
                    <td>
                      <span className={`customer-status ${getStatusClass(customer.status)}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td>{customer.value}</td>
                    <td>{customer.lastContact}</td>
                    <td className="customer-actions">
                      <button className="action-btn edit">
                        ✏️ Edit
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="customers-section">
            <div className="section-header">
              <h2 className="section-title">
                🎯 Lead Management
              </h2>
              <button 
                className="add-customer-btn"
                onClick={() => setShowAddLead(!showAddLead)}
              >
                {showAddLead ? '✕ Cancel' : '🎯 Add Lead'}
              </button>
            </div>

            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.filter(c => c.status === 'prospect' || c.status === 'new').map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <div className="customer-name">
                        {lead.name}
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${lead.email}`} className="customer-email">
                        {lead.email}
                      </a>
                    </td>
                    <td>{lead.phone}</td>
                    <td>{lead.company || '-'}</td>
                    <td>{lead.source || '-'}</td>
                    <td>
                      <span className={`customer-status ${getStatusClass(lead.status)}`}>
                        {lead.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="customer-actions">
                      <button className="action-btn edit">
                        ✏️ Convert to Customer
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteCustomer(lead.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="deals-section">
            <div className="section-header">
              <h2 className="section-title">
                🤝 Deals Pipeline
              </h2>
              <button className="add-customer-btn">
                ➕ Add Deal
              </button>
            </div>

            <div className="deals-grid">
              {deals.map(deal => (
                <div key={deal.id} className="deal-card">
                  <div className="deal-header">
                    <div>
                      <div className="deal-title">{deal.title}</div>
                      <div className="deal-value">${deal.value.toLocaleString()}</div>
                    </div>
                    <span className={`deal-status ${getDealStatusClass(deal.status)}`}>
                      {deal.status === 'won' && '✅ Won'}
                      {deal.status === 'lost' && '❌ Lost'}
                      {deal.status === 'in-progress' && '⏳ In Progress'}
                    </span>
                  </div>
                  <div className="deal-meta">
                    <span>Customer: {deal.customer}</span>
                    <span>Probability: {deal.probability}%</span>
                  </div>
                  <div className="deal-description">{deal.description}</div>
                  <div className="deal-meta">
                    <span>Close Date: {deal.closeDate}</span>
                  </div>
                  <div className="deal-actions">
                    <select 
                      className="action-btn"
                      value={deal.status}
                      onChange={(e) => handleUpdateDealStatus(deal.id, e.target.value)}
                    >
                      <option value="in-progress">In Progress</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="customers-section">
            <div className="section-header">
              <h2 className="section-title">
                CRM Analytics
              </h2>
            </div>
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
              <h3>CRM Analytics Dashboard</h3>
              <p style={{ color: 'var(--neutral-gray)', marginBottom: '20px' }}>
                Comprehensive CRM analytics including customer acquisition, deal conversion rates, 
                sales performance, and revenue tracking.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '20px', background: 'var(--primary-green-light)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}></div>
                  <div style={{ fontWeight: '500' }}>Customer Growth</div>
                  <div style={{ fontSize: '20px', color: 'var(--primary-green)' }}>+23%</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--accent-yellow)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}></div>
                  <div style={{ fontWeight: '500' }}>Deal Conversion</div>
                  <div style={{ fontSize: '20px', color: 'var(--accent-red)' }}>67%</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--secondary-blue)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}></div>
                  <div style={{ fontWeight: '500' }}>Revenue</div>
                  <div style={{ fontSize: '20px', color: 'var(--primary-green)' }}>$458K</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CRM;

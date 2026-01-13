import React, { useState, useEffect } from 'react';
import './Payments.css';

function Payments({ user }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock payment methods
    const mockPaymentMethods = [
      {
        id: 1,
        name: 'M-Pesa',
        type: 'mpesa',
        status: 'active',
        description: 'Mobile money transfer service for East Africa',
        icon: '📱',
        totalTransactions: 1247,
        totalRevenue: 45678.90,
        accountNumber: '+254700123456'
      },
      {
        id: 2,
        name: 'Bank Transfer',
        type: 'bank',
        status: 'active',
        description: 'Direct bank transfers and wire payments',
        icon: '🏦',
        totalTransactions: 856,
        totalRevenue: 78945.50,
        accountNumber: '****1234'
      },
      {
        id: 3,
        name: 'PayPal',
        type: 'paypal',
        status: 'pending',
        description: 'Global online payment platform',
        icon: '💳',
        totalTransactions: 0,
        totalRevenue: 0,
        accountNumber: 'business@example.com'
      },
      {
        id: 4,
        name: 'Stripe',
        type: 'stripe',
        status: 'inactive',
        description: 'Credit card processing platform',
        icon: '💳',
        totalTransactions: 0,
        totalRevenue: 0,
        accountNumber: 'acct_1A2B3C4D5E'
      }
    ];
    setPaymentMethods(mockPaymentMethods);

    // Mock transactions
    const mockTransactions = [
      {
        id: 'txn_001',
        date: '2024-01-12 14:23:45',
        amount: 299.99,
        method: 'mpesa',
        status: 'completed',
        description: 'Premium Enterprise License',
        customerId: 'CUST_001'
      },
      {
        id: 'txn_002',
        date: '2024-01-12 13:15:22',
        amount: 149.99,
        method: 'bank',
        status: 'completed',
        description: 'Professional Dashboard',
        customerId: 'CUST_002'
      },
      {
        id: 'txn_003',
        date: '2024-01-12 12:45:10',
        amount: 79.99,
        method: 'paypal',
        status: 'pending',
        description: 'Cloud Storage Plus',
        customerId: 'CUST_003'
      },
      {
        id: 'txn_004',
        date: '2024-01-12 11:30:55',
        amount: 199.99,
        method: 'mpesa',
        status: 'failed',
        description: 'Security Suite Pro',
        customerId: 'CUST_004'
      }
    ];
    setTransactions(mockTransactions);
  }, []);

  const handleConfigureMethod = (method) => {
    setSelectedMethod(method);
    setShowModal(true);
  };

  const handleSaveConfiguration = () => {
    // Simulate saving configuration
    setPaymentMethods(prev => prev.map(method => 
      method.id === selectedMethod.id 
        ? { ...method, status: 'active' }
        : method
    ));
    setShowModal(false);
    setSelectedMethod(null);
  };

  const handleToggleMethod = (methodId, enable) => {
    setPaymentMethods(prev => prev.map(method => 
      method.id === methodId 
        ? { ...method, status: enable ? 'active' : 'inactive' }
        : method
    ));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'inactive': return 'inactive';
      case 'pending': return 'pending';
      default: return 'inactive';
    }
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'mpesa': return '📱';
      case 'bank': return '🏦';
      case 'paypal': return '💳';
      case 'stripe': return '💳';
      default: return '💳';
    }
  };

  const getTransactionStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'failed': return 'failed';
      default: return 'pending';
    }
  };

  const exportTransactions = () => {
    const data = {
      tenant: user?.tenant_id,
      exportDate: new Date().toISOString(),
      paymentMethods: paymentMethods,
      transactions: transactions
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-transactions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h1 className="payments-title">Payment Methods</h1>
        <button className="add-payment-btn">
          Add Method
        </button>
      </div>

      <div className="payment-methods-grid">
        {paymentMethods.map(method => (
          <div key={method.id} className="payment-method-card">
            <div className="payment-method-header">
              <div className={`payment-icon ${method.type}`}>
                {method.icon}
              </div>
              <div className="payment-method-info">
                <h3 className="payment-method-name">{method.name}</h3>
                <div className={`payment-method-status ${getStatusClass(method.status)}`}>
                  <span className={`status-dot ${method.status}`}></span>
                  {method.status.charAt(0).toUpperCase() + method.status.slice(1)}
                </div>
              </div>
            </div>
            
            <p className="payment-method-description">{method.description}</p>
            
            <div className="payment-stats">
              <div className="payment-stat">
                <div className="payment-stat-label">Total Transactions</div>
                <div className="payment-stat-value">{method.totalTransactions.toLocaleString()}</div>
              </div>
              <div className="payment-stat">
                <div className="payment-stat-label">Total Revenue</div>
                <div className="payment-stat-value">${method.totalRevenue.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="payment-actions">
              <button 
                className="payment-btn configure"
                onClick={() => handleConfigureMethod(method)}
              >
                ⚙️ Configure
              </button>
              {method.status === 'active' ? (
                <button 
                  className="payment-btn disable"
                  onClick={() => handleToggleMethod(method.id, false)}
                >
                  🔴 Disable
                </button>
              ) : (
                <button 
                  className="payment-btn enable"
                  onClick={() => handleToggleMethod(method.id, true)}
                >
                  🟢 Enable
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="transactions-section">
        <div className="transactions-header">
          <h2 className="transactions-title">Recent Transactions</h2>
          <button className="export-transactions-btn" onClick={exportTransactions}>
            Export
          </button>
        </div>
        
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Description</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td className="transaction-id">{transaction.id}</td>
                <td>{transaction.date}</td>
                <td className={`transaction-amount ${getTransactionStatusClass(transaction.status)}`}>
                  ${transaction.amount}
                </td>
                <td>
                  <span className={`transaction-method ${transaction.method}`}>
                    {getMethodIcon(transaction.method)} {transaction.method.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={`transaction-status ${getTransactionStatusClass(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
                <td>{transaction.description}</td>
                <td>{transaction.customerId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedMethod && (
        <div className="setup-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {getMethodIcon(selectedMethod.type)} Configure {selectedMethod.name}
              </h2>
              <button 
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Account Number / Email</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={selectedMethod.accountNumber}
                  placeholder="Enter account details"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">API Key (if applicable)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter API key"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Webhook URL</label>
                <input
                  type="url"
                  className="form-input"
                  defaultValue={`https://yourdomain.com/webhooks/${selectedMethod.type}`}
                  placeholder="Enter webhook URL"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Add configuration notes..."
                ></textarea>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSaveConfiguration}
              >
                💾 Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;

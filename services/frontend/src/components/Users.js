import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Users.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002';

function Users({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // Mock data if API is not available
      const mockUsers = [
        {
          id: 1,
          email: 'admin@demo.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          email: 'user@demo.com',
          first_name: 'Regular',
          last_name: 'User',
          role: 'user',
          created_at: new Date().toISOString()
        }
      ];
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newUser = {
        ...formData,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      
      // Add to local state
      setUsers(prev => [...prev, newUser]);
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'user'
      });
      setShowAddForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add user');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  if (loading) return <div className="loading"><div className="loading-spinner"></div></div>;

  return (
    <div className="users-container">
      <div className="users-header">
        <h1 className="users-title">
          👥 User Management
          <span className="user-count">{users.length}</span>
        </h1>
        <button 
          className="add-user-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Cancel' : '➕ Add User'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <div className="add-user-form">
          <h3>👤 Add New User</h3>
          <form onSubmit={handleAddUser}>
            <div className="form-row">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="form-input"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                <option value="user">👤 User</option>
                <option value="admin">👑 Admin</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">
              ✅ Add User
            </button>
          </form>
        </div>
      )}

      <div className="users-table-container">
        <div className="users-table-header">
          <h3 className="users-table-title">📋 User Directory</h3>
        </div>
        
        {users.length === 0 ? (
          <div className="no-users">
            <div className="no-users-icon">👥</div>
            <div className="no-users-title">No users found</div>
            <div className="no-users-text">Start by adding your first user to the tenant</div>
            <button 
              className="create-first-user-btn"
              onClick={() => setShowAddForm(true)}
            >
              👤 Create First User
            </button>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <a href={`mailto:${user.email}`} className="user-email">
                      {user.email}
                    </a>
                  </td>
                  <td className="user-name">
                    {user.first_name} {user.last_name}
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? '👑' : '👤'} {user.role}
                    </span>
                  </td>
                  <td className="user-date">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="user-actions">
                    <button className="action-btn edit">
                      ✏️ Edit
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Users;

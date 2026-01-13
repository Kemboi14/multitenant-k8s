import React, { useState, useEffect } from 'react';
import './HR.css';

function HR({ user }) {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockEmployees = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@company.com',
        department: 'engineering',
        position: 'Senior Developer',
        status: 'active',
        salary: 95000,
        startDate: '2022-01-15'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        department: 'sales',
        position: 'Sales Manager',
        status: 'active',
        salary: 85000,
        startDate: '2021-06-01'
      },
      {
        id: 3,
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        department: 'hr',
        position: 'HR Specialist',
        status: 'on-leave',
        salary: 75000,
        startDate: '2020-03-10'
      }
    ];

    const mockPayroll = [
      {
        id: 1,
        employee: 'John Smith',
        salary: 95000,
        bonus: 10000,
        deductions: 12000,
        netPay: 93000,
        payDate: '2024-01-31'
      },
      {
        id: 2,
        employee: 'Sarah Johnson',
        salary: 85000,
        bonus: 8000,
        deductions: 10500,
        netPay: 82500,
        payDate: '2024-01-31'
      }
    ];

    const mockLeaveRequests = [
      {
        id: 1,
        employee: 'Michael Chen',
        type: 'vacation',
        startDate: '2024-01-20',
        endDate: '2024-01-24',
        days: 4,
        status: 'approved'
      },
      {
        id: 2,
        employee: 'Emily Davis',
        type: 'sick',
        startDate: '2024-01-10',
        endDate: '2024-01-12',
        days: 2,
        status: 'pending'
      },
      {
        id: 3,
        employee: 'David Wilson',
        type: 'personal',
        startDate: '2024-02-05',
        endDate: '2024-02-05',
        days: 1,
        status: 'rejected'
      }
    ];

    setEmployees(mockEmployees);
    setPayroll(mockPayroll);
    setLeaveRequests(mockLeaveRequests);
    setLoading(false);
  }, []);

  const handleAddEmployee = () => {
    const employeeWithId = {
      ...newEmployee,
      id: Date.now(),
      startDate: new Date().toISOString().split('T')[0]
    };
    setEmployees(prev => [...prev, employeeWithId]);
    setNewEmployee({
      name: '',
      email: '',
      department: 'engineering',
      position: '',
      salary: '',
      startDate: ''
    });
    setShowAddEmployee(false);
  };

  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();
    handleAddEmployee();
  };

  const handleAddLeave = () => {
    const leaveWithId = {
      ...newLeave,
      id: Date.now()
    };
    setLeaveRequests(prev => [...prev, leaveWithId]);
    setNewLeave({
      employee: '',
      type: 'vacation',
      startDate: '',
      endDate: '',
      days: 1,
      reason: ''
    });
    setShowAddLeave(false);
  };

  const handleAddLeaveSubmit = (e) => {
    e.preventDefault();
    handleAddLeave();
  };

  const getDepartmentClass = (department) => {
    switch (department) {
      case 'engineering': return 'engineering';
      case 'sales': return 'sales';
      case 'hr': return 'hr';
      case 'marketing': return 'marketing';
      default: return 'engineering';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'on-leave': return 'on-leave';
      case 'inactive': return 'inactive';
      default: return 'inactive';
    }
  };

  const getLeaveTypeClass = (type) => {
    switch (type) {
      case 'vacation': return 'vacation';
      case 'sick': return 'sick';
      case 'personal': return 'personal';
      default: return 'personal';
    }
  };

  const getLeaveStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'approved';
      case 'pending': return 'pending';
      case 'rejected': return 'rejected';
      default: return 'pending';
    }
  };

  const hrStats = [
    { label: 'Total Employees', value: employees.length },
    { label: 'Active', value: employees.filter(e => e.status === 'active').length },
    { label: 'On Leave', value: employees.filter(e => e.status === 'on-leave').length },
    { label: 'Payroll Total', value: `$${payroll.reduce((sum, p) => sum + p.netPay, 0).toLocaleString()}` }
  ];

  if (loading) return <div className="loading"><div className="loading-spinner"></div></div>;

  return (
    <div className="hr-container">
      <div className="hr-header">
        <h1 className="hr-title">
          👥 HR Management
        </h1>
      </div>

      <div className="hr-stats">
        {hrStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="hr-tabs">
        <button
          className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          👥 Employees
        </button>
        <button
          className={`tab-button ${activeTab === 'payroll' ? 'active' : ''}`}
          onClick={() => setActiveTab('payroll')}
        >
          💰 Payroll
        </button>
        <button
          className={`tab-button ${activeTab === 'leave' ? 'active' : ''}`}
          onClick={() => setActiveTab('leave')}
        >
          📅 Leave Management
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 HR Analytics
        </button>
      </div>

      <div className="hr-content">
        {activeTab === 'employees' && (
          <div className="employees-section">
            <div className="section-header">
              <h2 className="section-title">
                👥 Employee Management
              </h2>
              <button className="add-employee-btn" onClick={() => setShowAddEmployee(!showAddEmployee)}>
                {showAddEmployee ? '✕ Cancel' : '➕ Add Employee'}
              </button>
            </div>

            <table className="employees-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Salary</th>
                  <th>Start Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-name">
                        {employee.name}
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${employee.email}`} className="employee-email">
                        {employee.email}
                      </a>
                    </td>
                    <td>
                      <span className={`employee-department ${getDepartmentClass(employee.department)}`}>
                        {employee.department.toUpperCase()}
                      </span>
                    </td>
                    <td>{employee.position}</td>
                    <td>
                      <span className={`employee-status ${getStatusClass(employee.status)}`}>
                        {employee.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>${employee.salary.toLocaleString()}</td>
                    <td>{employee.startDate}</td>
                    <td className="employee-actions">
                      <button className="action-btn edit">
                        ✏️ Edit
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteEmployee(employee.id)}
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

        {showAddEmployee && (
          <div className="add-employee-form">
            <h3>➕ Add New Employee</h3>
            <form onSubmit={handleAddEmployeeSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={newEmployee.name}
                  onChange={handleEmployeeChange}
                  className="form-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={newEmployee.email}
                  onChange={handleEmployeeChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-row">
                <select name="department" value={newEmployee.department} onChange={handleEmployeeChange} className="form-select">
                  <option value="engineering">Engineering</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="management">Management</option>
                  <option value="marketing">Marketing</option>
                </select>
                <input
                  type="text"
                  name="position"
                  placeholder="Job Position"
                  value={newEmployee.position}
                  onChange={handleEmployeeChange}
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  name="salary"
                  placeholder="Annual Salary"
                  value={newEmployee.salary}
                  onChange={handleEmployeeChange}
                  className="form-input"
                  required
                />
                <input
                  type="date"
                  name="startDate"
                  placeholder="Start Date"
                  value={newEmployee.startDate}
                  onChange={handleEmployeeChange}
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="add-employee-btn">
                ✅ Add Employee
              </button>
            </form>
          </div>
        )}

        {showAddEmployee && (
          <div className="add-employee-form">
            <h3>➕ Add New Employee</h3>
            <form onSubmit={handleAddEmployeeSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={newEmployee.name}
                  onChange={handleEmployeeChange}
                  className="form-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={newEmployee.email}
                  onChange={handleEmployeeChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-row">
                <select name="department" value={newEmployee.department} onChange={handleEmployeeChange} className="form-select">
                  <option value="engineering">Engineering</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="management">Management</option>
                  <option value="marketing">Marketing</option>
                </select>
                <input
                  type="text"
                  name="position"
                  placeholder="Job Position"
                  value={newEmployee.position}
                  onChange={handleEmployeeChange}
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  name="salary"
                  placeholder="Annual Salary"
                  value={newEmployee.salary}
                  onChange={handleEmployeeChange}
                  className="form-input"
                  required
                />
                <input
                  type="date"
                  name="startDate"
                  value={newEmployee.startDate}
                  onChange={handleEmployeeChange}
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="add-employee-btn">
                ✅ Add Employee
              </button>
            </form>
          </div>
        )}

        {showAddLeave && (
          <div className="add-employee-form">
            <h3>📅 Request Leave</h3>
            <form onSubmit={handleAddLeaveSubmit}>
              <div className="form-row">
                <select name="employee" value={newLeave.employee} onChange={handleLeaveChange} className="form-select">
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
                <select name="type" value={newLeave.type} onChange={handleLeaveChange} className="form-select">
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div className="form-row">
                <input
                  type="date"
                  name="startDate"
                  value={newLeave.startDate}
                  onChange={handleLeaveChange}
                  className="form-input"
                  required
                />
                <input
                  type="date"
                  name="endDate"
                  value={newLeave.endDate}
                  onChange={handleLeaveChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  name="days"
                  placeholder="Number of Days"
                  value={newLeave.days}
                  onChange={handleLeaveChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="reason"
                  placeholder="Reason for Leave"
                  value={newLeave.reason}
                  onChange={handleLeaveChange}
                  className="form-input"
                />
              </div>
              <button type="submit" className="add-employee-btn">
                📅 Submit Request
              </button>
            </form>
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="payroll-section">
            <div className="section-header">
              <h2 className="section-title">
                💰 Payroll Management
              </h2>
              <button className="add-employee-btn">
                📊 Process Payroll
              </button>
            </div>

            <div className="payroll-grid">
              {payroll.map(pay => (
                <div key={pay.id} className="payroll-card">
                  <div className="payroll-header">
                    <div className="payroll-employee">{pay.employee}</div>
                    <div className="payroll-salary">${pay.salary.toLocaleString()}</div>
                  </div>
                  <div className="payroll-details">
                    <div className="payroll-detail">
                      <span>Base Salary</span>
                      <span>${pay.salary.toLocaleString()}</span>
                    </div>
                    <div className="payroll-detail">
                      <span>Bonus</span>
                      <span>${pay.bonus.toLocaleString()}</span>
                    </div>
                    <div className="payroll-detail">
                      <span>Deductions</span>
                      <span>-${pay.deductions.toLocaleString()}</span>
                    </div>
                    <div className="payroll-detail">
                      <span>Net Pay</span>
                      <span>${pay.netPay.toLocaleString()}</span>
                    </div>
                    <div className="payroll-detail">
                      <span>Pay Date</span>
                      <span>{pay.payDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="leave-section">
            <div className="section-header">
              <h2 className="section-title">
                📅 Leave Management
              </h2>
              <button className="add-employee-btn">
                ➕ Request Leave
              </button>
            </div>

            <div className="leave-requests">
              {leaveRequests.map(leave => (
                <div key={leave.id} className="leave-request">
                  <div className="leave-employee">{leave.employee}</div>
                  <span className={`leave-type ${getLeaveTypeClass(leave.type)}`}>
                    {leave.type.toUpperCase()}
                  </span>
                  <div className="leave-dates">
                    {leave.startDate} to {leave.endDate} ({leave.days} days)
                  </div>
                  <span className={`leave-status ${getLeaveStatusClass(leave.status)}`}>
                    {leave.status.toUpperCase()}
                  </span>
                  <div className="leave-actions">
                    <button 
                      className="action-btn"
                      onClick={() => handleApproveLeave(leave.id)}
                      disabled={leave.status !== 'pending'}
                    >
                      {leave.status === 'pending' ? '✅ Approve' : 'View'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="employees-section">
            <div className="section-header">
              <h2 className="section-title">
                📊 HR Analytics Dashboard
              </h2>
            </div>
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
              <h3>HR Analytics & Insights</h3>
              <p style={{ color: 'var(--neutral-gray)', marginBottom: '20px' }}>
                Comprehensive HR analytics including employee performance, turnover rates, 
                payroll analysis, leave patterns, and workforce planning.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '20px', background: 'var(--secondary-blue)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
                  <div style={{ fontWeight: '500' }}>Employee Satisfaction</div>
                  <div style={{ fontSize: '20px', color: 'var(--primary-green)' }}>87%</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--accent-yellow)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📅</div>
                  <div style={{ fontWeight: '500' }}>Leave Utilization</div>
                  <div style={{ fontSize: '20px', color: 'var(--primary-green)' }}>73%</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--primary-green)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
                  <div style={{ fontWeight: '500' }}>Payroll Efficiency</div>
                  <div style={{ fontSize: '20px', color: 'var(--primary-green)' }}>94%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HR;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Analytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Analytics({ user }) {
  const [dateRange, setDateRange] = useState('7d');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chartData, setChartData] = useState({
    userGrowth: [],
    revenue: [],
    geographic: [],
    deviceBreakdown: []
  });

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      positive: true,
      icon: 'users'
    },
    {
      title: 'Active Sessions',
      value: '456',
      change: '+8%',
      positive: true,
      icon: 'sessions'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-2%',
      positive: false,
      icon: 'conversion'
    },
    {
      title: 'Revenue MRR',
      value: '$12.4K',
      change: '+18%',
      positive: true,
      icon: 'revenue'
    }
  ];

  const reports = [
    {
      name: 'User Activity Report',
      description: 'Detailed user engagement and activity metrics',
      status: 'ready',
      lastGenerated: '2 hours ago'
    },
    {
      name: 'Security Audit Report',
      description: 'Security events and authentication logs',
      status: 'ready',
      lastGenerated: '1 day ago'
    },
    {
      name: 'Performance Metrics',
      description: 'System performance and response times',
      status: 'generating',
      lastGenerated: 'Generating...'
    },
    {
      name: 'Usage Analytics',
      description: 'Feature usage and adoption rates',
      status: 'ready',
      lastGenerated: '3 days ago'
    }
  ];

  useEffect(() => {
    // Generate chart data based on date range
    const generateChartData = () => {
      const days = dateRange === '24h' ? 24 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      
      // User Growth Data
      const userGrowthData = Array.from({ length: days }, (_, i) => ({
        label: dateRange === '24h' ? `${i}:00` : `Day ${i + 1}`,
        value: Math.floor(Math.random() * 50) + 100 + (i * 2)
      }));

      // Revenue Data
      const revenueData = Array.from({ length: days }, (_, i) => ({
        label: dateRange === '24h' ? `${i}:00` : `Day ${i + 1}`,
        value: Math.floor(Math.random() * 1000) + 500 + (i * 50)
      }));

      // Geographic Data
      const geographicData = [
        { name: 'United States', value: 35, color: '#34a853' },
        { name: 'United Kingdom', value: 25, color: '#4285f4' },
        { name: 'Germany', value: 20, color: '#fbbc04' },
        { name: 'France', value: 15, color: '#ea4335' },
        { name: 'Other', value: 5, color: '#5f6368' }
      ];

      // Device Breakdown Data
      const deviceData = [
        { name: 'Desktop', value: 45, color: '#34a853' },
        { name: 'Mobile', value: 35, color: '#4285f4' },
        { name: 'Tablet', value: 15, color: '#fbbc04' },
        { name: 'Other', value: 5, color: '#ea4335' }
      ];

      setChartData({
        userGrowth: userGrowthData,
        revenue: revenueData,
        geographic: geographicData,
        deviceBreakdown: deviceData
      });
    };

    generateChartData();
  }, [dateRange]);

  const handleGenerateReport = (reportName) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleExport = () => {
    const data = {
      tenant: user?.tenant_id,
      dateRange: dateRange,
      stats: stats,
      reports: reports,
      chartData: chartData,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const dateRanges = [
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: '1y', label: 'Last Year' }
  ];

  // Chart configurations
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Growth Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Analytics'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Geographic Distribution'
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Device Analytics'
      }
    }
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics & Reports</h1>
        <button className="export-btn" onClick={handleExport}>
          Export Data
        </button>
      </div>

      <div className="insights-banner">
        <div className="insights-content">
          <div className="insights-icon">🎯</div>
          <div className="insights-text">
            <h3>AI-Powered Insights Available</h3>
            <p>Get predictive analytics and business recommendations</p>
          </div>
        </div>
        <Link to="/enterprise" className="insights-action">
          Learn More
        </Link>
      </div>

      <div className="date-range-selector">
        {dateRanges.map(range => (
          <button
            key={range.id}
            className={`date-range-btn ${dateRange === range.id ? 'active' : ''}`}
            onClick={() => setDateRange(range.id)}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              {stat.icon === 'users' && '👥'}
              {stat.icon === 'sessions' && '💻'}
              {stat.icon === 'conversion' && '🎯'}
              {stat.icon === 'revenue' && '💰'}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.title}</div>
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">
            📈 User Growth Trend
          </h3>
          <div style={{ height: '300px' }}>
            <Line
              data={{
                labels: chartData.userGrowth.map(d => d.label),
                datasets: [{
                  label: 'Active Users',
                  data: chartData.userGrowth.map(d => d.value),
                  borderColor: '#34a853',
                  backgroundColor: 'rgba(52, 168, 83, 0.1)',
                  tension: 0.4,
                  fill: true
                }]
              }}
              options={lineChartOptions}
            />
          </div>
        </div>
        
        <div className="chart-card">
          <h3 className="chart-title">
            💰 Revenue Analytics
          </h3>
          <div style={{ height: '300px' }}>
            <Bar
              data={{
                labels: chartData.revenue.map(d => d.label),
                datasets: [{
                  label: 'Revenue ($)',
                  data: chartData.revenue.map(d => d.value),
                  backgroundColor: '#fbbc04',
                  borderColor: '#f59e0b',
                  borderWidth: 1
                }]
              }}
              options={barChartOptions}
            />
          </div>
        </div>
        
        <div className="chart-card">
          <h3 className="chart-title">
            🌍 Geographic Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <Pie
              data={{
                labels: chartData.geographic.map(d => d.name),
                datasets: [{
                  data: chartData.geographic.map(d => d.value),
                  backgroundColor: chartData.geographic.map(d => d.color),
                  borderWidth: 2,
                  borderColor: '#fff'
                }]
              }}
              options={pieChartOptions}
            />
          </div>
        </div>
        
        <div className="chart-card">
          <h3 className="chart-title">
            📱 Device Analytics
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut
              data={{
                labels: chartData.deviceBreakdown.map(d => d.name),
                datasets: [{
                  data: chartData.deviceBreakdown.map(d => d.value),
                  backgroundColor: chartData.deviceBreakdown.map(d => d.color),
                  borderWidth: 2,
                  borderColor: '#fff'
                }]
              }}
              options={doughnutOptions}
            />
          </div>
        </div>
      </div>

      <div className="reports-section">
        <div className="reports-header">
          <h2 className="reports-title">Automated Reports</h2>
          <button className="generate-report-btn" onClick={() => handleGenerateReport('all')}>
            Generate All
          </button>
        </div>
        
        <div className="reports-grid">
          {reports.map((report, index) => (
            <div key={index} className="report-item">
              <div className="report-header">
                <div className="report-name">
                  {report.name.includes('User') && '👥'}
                  {report.name.includes('Security') && '🔒'}
                  {report.name.includes('Performance') && '⚡'}
                  {report.name.includes('Usage') && '📊'}
                  {report.name}
                </div>
                <div className={`report-status ${report.status}`}>
                  {report.status === 'ready' ? '✅ Ready' : '⏳ Generating'}
                </div>
              </div>
              <div className="report-description">
                {report.description}
              </div>
              <div className="report-actions">
                <button 
                  className="download-btn"
                  onClick={() => handleGenerateReport(report.name)}
                  disabled={report.status === 'generating'}
                >
                  {report.status === 'generating' ? '⏳' : '⬇️'} Download
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {isGenerating && (
          <div className="loading-spinner"></div>
        )}
      </div>
    </div>
  );
}

export default Analytics;

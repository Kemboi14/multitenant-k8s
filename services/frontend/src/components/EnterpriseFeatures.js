import React from 'react';
import { Link } from 'react-router-dom';
import './EnterpriseFeatures.css';

function EnterpriseFeatures({ user }) {
  const features = [
    {
      icon: 'premium',
      title: 'Advanced Security',
      description: 'Enterprise-grade security with 2FA, SSO, and audit logs',
      benefits: [
        'Two-factor authentication (2FA)',
        'Single Sign-On (SSO) integration',
        'Advanced threat detection',
        'Comprehensive audit logs',
        'Role-based access control'
      ],
      action: 'Configure Security'
    },
    {
      icon: 'analytics',
      title: 'AI-Powered Analytics',
      description: 'Predictive analytics and business intelligence with machine learning',
      benefits: [
        'Real-time data processing',
        'Predictive user behavior analysis',
        'Advanced reporting dashboards',
        'Custom KPI tracking',
        'Automated insights generation'
      ],
      action: 'View Analytics'
    },
    {
      icon: 'security',
      title: 'Compliance & Governance',
      description: 'Full compliance with GDPR, SOC 2, and industry standards',
      benefits: [
        'GDPR compliance tools',
        'SOC 2 Type II certified',
        'Data encryption at rest and in transit',
        'Automated compliance reporting',
        'Data retention policies'
      ],
      action: 'View Compliance'
    },
    {
      icon: 'ai',
      title: 'AI Assistant',
      description: 'Intelligent AI assistant for business process automation',
      benefits: [
        'Natural language processing',
        'Automated workflow optimization',
        'Smart recommendations',
        '24/7 AI support',
        'Multi-language support'
      ],
      action: 'Try AI Assistant'
    }
  ];

  const pricingPlans = [
    {
      tier: 'Professional',
      price: '$299',
      period: '/month',
      features: [
        'Up to 100 users',
        'Advanced analytics',
        'Priority support',
        '99.9% uptime SLA',
        'Monthly security reports'
      ],
      recommended: false
    },
    {
      tier: 'Enterprise',
      price: '$799',
      period: '/month',
      features: [
        'Unlimited users',
        'AI-powered analytics',
        'Advanced security suite',
        'Dedicated account manager',
        '99.99% uptime SLA',
        'Custom integrations'
      ],
      recommended: true
    },
    {
      tier: 'Custom',
      price: 'Contact',
      period: 'for pricing',
      features: [
        'Tailored solutions',
        'On-premise deployment',
        'Custom AI models',
        'White-label options',
        'SLA customization',
        'Dedicated infrastructure'
      ],
      recommended: false
    }
  ];

  return (
    <div className="enterprise-container">
      <div className="enterprise-header">
        <h1 className="enterprise-title">
          🚀 Enterprise Features
        </h1>
        <p className="enterprise-subtitle">
          Unlock the full potential of your multi-tenant SaaS platform with advanced enterprise capabilities, 
          AI-powered insights, and enterprise-grade security.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className={`feature-icon ${feature.icon}`}>
              {feature.icon === 'premium' && '👑'}
              {feature.icon === 'analytics' && '📊'}
              {feature.icon === 'security' && '🛡️'}
              {feature.icon === 'ai' && '🤖'}
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <ul className="feature-list">
              {feature.benefits.map((benefit, benefitIndex) => (
                <li key={benefitIndex}>{benefit}</li>
              ))}
            </ul>
            <button className="feature-action">
              {feature.action}
            </button>
          </div>
        ))}
      </div>

      <div className="pricing-section">
        <div className="pricing-header">
          <h2 className="pricing-title">Enterprise Pricing Plans</h2>
          <p className="pricing-subtitle">
            Choose the perfect plan for your business needs
          </p>
        </div>
        
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}>
              <div className="pricing-tier">{plan.tier}</div>
              <div className="pricing-price">{plan.price}</div>
              <div className="pricing-period">{plan.period}</div>
              <ul className="pricing-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
              <button className={`pricing-button ${plan.recommended ? '' : 'secondary'}`}>
                {plan.tier === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h2 className="cta-title">Ready to Transform Your Business?</h2>
        <p className="cta-description">
          Join thousands of enterprises already leveraging our advanced features to drive growth, 
          enhance security, and gain valuable insights.
        </p>
        <button className="cta-button">
          Start Enterprise Trial
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <Link to="/analytics" className="feature-action secondary">
          ← Back to Analytics
        </Link>
      </div>
    </div>
  );
}

export default EnterpriseFeatures;

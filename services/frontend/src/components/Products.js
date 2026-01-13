import React, { useState, useEffect } from 'react';
import './Products.css';

function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock real-time updates
  useEffect(() => {
    // Simulate initial products
    const mockProducts = [
      {
        id: 1,
        name: 'Premium Enterprise License',
        description: 'Full-featured enterprise solution with advanced security and analytics',
        price: 299.99,
        stock: 50,
        rating: 4.8,
        image: '🏢',
        badge: 'hot',
        category: 'Software'
      },
      {
        id: 2,
        name: 'Professional Dashboard',
        description: 'Advanced analytics dashboard with real-time insights and reporting',
        price: 149.99,
        stock: 25,
        rating: 4.6,
        image: '📊',
        badge: 'new',
        category: 'Analytics'
      },
      {
        id: 3,
        name: 'Security Suite Pro',
        description: 'Enterprise-grade security with 2FA and audit logs',
        price: 199.99,
        stock: 100,
        rating: 4.9,
        image: '🔒',
        badge: 'hot',
        category: 'Security'
      },
      {
        id: 4,
        name: 'Cloud Storage Plus',
        description: 'Unlimited cloud storage with automatic backup and sync',
        price: 79.99,
        stock: 5,
        rating: 4.5,
        image: '☁️',
        badge: 'sale',
        category: 'Storage'
      }
    ];
    setProducts(mockProducts);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setProducts(prev => prev.map(product => ({
        ...product,
        stock: Math.max(0, product.stock + Math.floor(Math.random() * 3) - 1)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'Software',
      image: ''
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleSaveProduct = () => {
    if (editingProduct.id) {
      // Update existing product
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id ? { ...editingProduct, price: parseFloat(editingProduct.price) } : p
      ));
    } else {
      // Add new product
      const newProduct = {
        ...editingProduct,
        id: Date.now(),
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock),
        rating: 0,
        image: editingProduct.image || '📦'
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { class: 'out-of-stock', text: 'Out of Stock' };
    if (stock < 10) return { class: 'low-stock', text: 'Low Stock' };
    return { class: 'in-stock', text: 'In Stock' };
  };

  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'hot': return 'hot';
      case 'new': return 'new';
      case 'sale': return 'sale';
      default: return '';
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-title">
          Product Management
          <span className="real-time-indicator">Live</span>
        </h1>
        <button className="add-product-btn" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '24px' }}
        />
      </div>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image}
                </div>
                {product.badge && (
                  <div className={`product-badge ${getBadgeClass(product.badge)}`}>
                    {product.badge.toUpperCase()}
                  </div>
                )}
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">${product.price}</div>
                  <div className="product-meta">
                    <span className={`product-stock ${stockStatus.class}`}>
                      {stockStatus.text}
                    </span>
                    <div className="product-rating">
                      ⭐ {product.rating}
                    </div>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="product-btn edit"
                      onClick={() => handleEditProduct(product)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="product-btn delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="product-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProduct?.id ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>
              <button 
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">📦 Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Enter product name"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">💰 Price</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      price: e.target.value
                    }))}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">📊 Stock Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingProduct?.stock || ''}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      stock: e.target.value
                    }))}
                    placeholder="0"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">🏷️ Category</label>
                  <select
                    className="form-input"
                    value={editingProduct?.category || 'Software'}
                    onChange={(e) => setEditingProduct(prev => ({
                      ...prev,
                      category: e.target.value
                    }))}
                  >
                    <option value="Software">Software</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Security">Security</option>
                    <option value="Storage">Storage</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">📝 Description</label>
                <textarea
                  className="form-input form-textarea"
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Enter product description"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">🖼️ Product Image</label>
                <div className="image-upload">
                  <div className="image-preview">
                    {editingProduct?.image || '📦'}
                  </div>
                  <div className="upload-text">Click to upload image</div>
                  <div className="upload-hint">PNG, JPG up to 2MB</div>
                </div>
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
                onClick={handleSaveProduct}
              >
                {editingProduct?.id ? '💾 Update Product' : '➕ Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;

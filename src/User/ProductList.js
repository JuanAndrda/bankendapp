import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import '../firebase';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Search state (not functional yet)
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore();
      const productsCol = collection(db, 'products');
      const productSnapshot = await getDocs(productsCol);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filtered products (search not implemented yet)
  const filteredProducts = products;

  return (
    <div className="user-page-bg">
      {/* Hero Section */}
      <section className="user-hero">
        <h1>Discover Amazing Products</h1>
        <p>Premium quality, unbeatable prices, fast delivery</p>
        <div className="user-search-container">
          <div className="user-search-bar">
            <input
              type="text"
              placeholder="Search for products, brands, and more..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              disabled
            />
            <button className="user-search-btn" disabled>Search</button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="user-products-section">
        <h2 className="user-section-title">Featured Products</h2>
        {loading ? (
          <div className="user-loading">Loading products...</div>
        ) : (
          <div className="user-products-grid">
            {filteredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              filteredProducts.map((product, idx) => (
                <div className="user-product-card" key={product.id}>
                  <div className="user-product-image">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="user-product-img" />
                    ) : (
                      <div className={`user-product-placeholder user-product-image-${(idx % 4) + 1}`}>
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="user-product-info">
                    <h3 className="user-product-name">{product.name}</h3>
                    <p className="user-product-description">{product.description}</p>
                    <div className="user-product-meta">
                      <span className="user-product-price">${product.price}</span>
                    </div>
                    <button className="user-add-to-cart" disabled>Add to Cart</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductList; 
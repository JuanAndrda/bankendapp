import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import '../firebase';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [adding, setAdding] = useState(false);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    const db = getFirestore();
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productList);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new product
  const handleAddProduct = async e => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) return;
    setAdding(true);
    const db = getFirestore();
    await addDoc(collection(db, 'products'), {
      name: form.name,
      description: form.description,
      price: form.price
    });
    setForm({ name: '', description: '', price: '' });
    setAdding(false);
    fetchProducts();
  };

  // Delete product
  const handleDelete = async id => {
    const db = getFirestore();
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };

  return (
    <div className="admin-bg">
      <section className="admin-section">
        <h1 className="admin-title">Admin Product Management</h1>
        {/* Add Product Form */}
        <form className="admin-form" onSubmit={handleAddProduct}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
          <button type="submit" className="admin-add-btn" disabled={adding}>{adding ? 'Adding...' : 'Add Product'}</button>
        </form>

        {/* Product List */}
        <div className="admin-products-grid">
          {loading ? (
            <div className="admin-loading">Loading products...</div>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product, idx) => (
              <div className="admin-product-card" key={product.id}>
                <div className={`admin-product-image admin-product-image-${(idx % 4) + 1}`}></div>
                <div className="admin-product-info">
                  <h3 className="admin-product-name">{product.name}</h3>
                  <p className="admin-product-description">{product.description}</p>
                  <div className="admin-product-meta">
                    <span className="admin-product-price">${product.price}</span>
                  </div>
                  <button className="admin-delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard; 
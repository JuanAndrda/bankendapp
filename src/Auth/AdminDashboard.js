import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import '../firebase';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', imageUrl: '' });

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

  // Handle edit form input
  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Start editing a product
  const startEdit = (product) => {
    setEditing(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl || ''
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditing(null);
    setEditForm({ name: '', description: '', price: '', imageUrl: '' });
  };

  // Update product
  const handleUpdateProduct = async (productId) => {
    if (!editForm.name || !editForm.description || !editForm.price) return;
    
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'products', productId), {
        name: editForm.name,
        description: editForm.description,
        price: editForm.price,
        imageUrl: editForm.imageUrl || ''
      });
      
      setEditing(null);
      setEditForm({ name: '', description: '', price: '', imageUrl: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Add new product
  const handleAddProduct = async e => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) return;
    setAdding(true);
    
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'products'), {
        name: form.name,
        description: form.description,
        price: form.price,
        imageUrl: form.imageUrl || ''
      });
      
      setForm({ name: '', description: '', price: '', imageUrl: '' });
      setAdding(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      setAdding(false);
    }
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
          <input
            type="url"
            name="imageUrl"
            placeholder="Product Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
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
                <div className="admin-product-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="admin-product-img" />
                  ) : (
                    <div className={`admin-product-placeholder admin-product-image-${(idx % 4) + 1}`}>
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <div className="admin-product-info">
                  {editing === product.id ? (
                    // Edit Form
                    <div className="admin-edit-form">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="admin-edit-input"
                      />
                      <input
                        type="text"
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="admin-edit-input"
                      />
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        className="admin-edit-input"
                        min="0"
                        step="0.01"
                      />
                      <input
                        type="url"
                        name="imageUrl"
                        placeholder="Image URL (optional)"
                        value={editForm.imageUrl}
                        onChange={handleEditChange}
                        className="admin-edit-input"
                      />
                      <div className="admin-edit-buttons">
                        <button 
                          className="admin-save-btn" 
                          onClick={() => handleUpdateProduct(product.id)}
                        >
                          Save
                        </button>
                        <button 
                          className="admin-cancel-btn" 
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <>
                      <h3 className="admin-product-name">{product.name}</h3>
                      <p className="admin-product-description">{product.description}</p>
                      <div className="admin-product-meta">
                        <span className="admin-product-price">${product.price}</span>
                      </div>
                      <div className="admin-product-buttons">
                        <button 
                          className="admin-edit-btn" 
                          onClick={() => startEdit(product)}
                        >
                          Edit
                        </button>
                        <button 
                          className="admin-delete-btn" 
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
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
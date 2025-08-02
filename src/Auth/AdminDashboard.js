import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../firebase';
import Modal from '../components/Modal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [adding, setAdding] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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

  // Handle image file selection
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (file) => {
    const storage = getStorage();
    const filename = `products/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
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
      let imageUrl = form.imageUrl;
      
      // Upload image if file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      await addDoc(collection(db, 'products'), {
        name: form.name,
        description: form.description,
        price: form.price,
        imageUrl: imageUrl || ''
      });
      
      // Reset form and close modal
      setForm({ name: '', description: '', price: '', imageUrl: '' });
      setImageFile(null);
      setImagePreview('');
      setAdding(false);
      setShowAddModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      setAdding(false);
    }
  };

  // Close modal and reset form
  const closeAddModal = () => {
    setShowAddModal(false);
    setForm({ name: '', description: '', price: '', imageUrl: '' });
    setImageFile(null);
    setImagePreview('');
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
        <div className="admin-header">
          <h1 className="admin-title">Admin Product Management</h1>
          <button 
            className="admin-add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <span className="add-icon">+</span>
            Add Product
          </button>
        </div>

        {/* Add Product Modal */}
        <Modal open={showAddModal} onClose={closeAddModal}>
          <div className="add-product-modal">
            <h2 className="modal-title">Add New Product</h2>
            <form className="modal-form" onSubmit={handleAddProduct}>
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="imageFile">Product Image</label>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" className="preview-img" />
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="imageUrl">Or Image URL (optional)</label>
                <input
                  id="imageUrl"
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={handleChange}
                />
              </div>
              
              <div className="modal-buttons">
                <button 
                  type="button" 
                  className="modal-cancel-btn"
                  onClick={closeAddModal}
                  disabled={adding}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="modal-submit-btn" 
                  disabled={adding}
                >
                  {adding ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </Modal>

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
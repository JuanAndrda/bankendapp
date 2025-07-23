import React, { useState } from "react";
import './AddItem.css';
import { db, auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function AddItem() {
  const [name, setName] = useState("");
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, "items"), {
        name,
        ownerName: user.displayName || user.email || "Unknown",
        createdAt: new Date()
      });
      setName("");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <form className="add-item-form" onSubmit={handleAdd}>
      <input
        className="add-item-input"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Item name"
        required
        disabled={loading}
      />
      <button className="add-item-btn" type="submit" disabled={loading || !name}>
        {loading ? "Adding..." : "Add Item"}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

export default AddItem; 
import React, { useState } from "react";
import './ItemsList.css';
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";

function ItemsList() {
  const [user] = useAuthState(auth);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Only query if user is logged in
  const itemsQuery = user
    ? query(collection(db, "items"))
    : null;

  const [snapshot, loading, error] = useCollection(itemsQuery);

  const handleDelete = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "items", id));
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = async (id) => {
    if (!user || !editValue.trim()) return;
    await updateDoc(doc(db, "items", id), { name: editValue });
    setEditingId(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  if (!user) return <div>Please log in to see your items.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="items-list-container improved-list">
      <h2>Your Items</h2>
      <ul className="items-list-ul">
        {snapshot?.docs.map(docSnap => {
          const data = docSnap.data();
          return (
            <li className="items-list-li improved-li" key={docSnap.id}>
              {editingId === docSnap.id ? (
                <>
                  <input
                    className="items-list-edit-input"
                    value={editValue}
                    onChange={handleEditChange}
                  />
                  <button className="items-list-btn improved-btn" onClick={() => handleEditSave(docSnap.id)}>
                    Save
                  </button>
                  <button className="items-list-btn improved-btn" onClick={handleEditCancel}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.08rem' }}>{data.name}</div>
                    {data.ownerName && (
                      <div style={{ fontSize: '0.92rem', color: '#888', marginTop: '2px' }}>
                        by {data.ownerName}
                      </div>
                    )}
                    {!data.ownerName && data.owner && (
                      <div style={{ fontSize: '0.92rem', color: '#888', marginTop: '2px' }}>
                        by {data.owner}
                      </div>
                    )}
                  </div>
                  <div>
                    <button className="items-list-btn improved-btn" onClick={() => handleEdit(docSnap.id, data.name)}>
                      Edit
                    </button>
                    <button className="items-list-btn improved-btn" onClick={() => handleDelete(docSnap.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ItemsList; 
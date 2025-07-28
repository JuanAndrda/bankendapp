import React, { useState } from 'react';
import app from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserDocIfNotExists } from '../shared/createUserDoc';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import '../App.css';
import Modal from '../components/Modal';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

function SignUp({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const auth = getAuth(app);
  const navigate = useNavigate();

  if (!open) return null;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocIfNotExists(userCredential.user);
      // Check user role and redirect
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const role = userDoc.exists() ? userDoc.data().role : 'user';
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/'); // User product page
      }
      setSuccess('Account created!');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="signup-title">Sign Up</div>
      <form className="signup-form" onSubmit={handleSignUp}>
        <input
          className="signup-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="signup-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="signup-btn" type="submit">Sign Up</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </Modal>
  );
}

export default SignUp; 
import React, { useState } from 'react';
import app from '../firebase';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
<<<<<<< HEAD
import { createUserDocIfNotExists } from '../shared/createUserDoc';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
=======
>>>>>>> d60aaf17035438d24a3bc9ea2220c72eff8b6192
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Modal from '../components/Modal';
import './LogIn.css';

function LogIn({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth(app);
  const navigate = useNavigate();

  if (!open) return null;

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
<<<<<<< HEAD
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocIfNotExists(userCredential.user);
      // Check user role and redirect
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const role = userDoc.exists() ? userDoc.data().role : 'user';
      onClose();
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/'); // User product page
      }
=======
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
      navigate('/welcome');
>>>>>>> d60aaf17035438d24a3bc9ea2220c72eff8b6192
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
<<<<<<< HEAD
      const userCredential = await signInWithPopup(auth, provider);
      await createUserDocIfNotExists(userCredential.user);
      // Check user role and redirect
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const role = userDoc.exists() ? userDoc.data().role : 'user';
      onClose();
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/'); // User product page
      }
=======
      await signInWithPopup(auth, provider);
      onClose();
      navigate('/welcome');
>>>>>>> d60aaf17035438d24a3bc9ea2220c72eff8b6192
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="login-title">Log In</div>
      <form className="login-form" onSubmit={handleEmailSignIn}>
        <input
          className="login-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="login-btn" type="submit">
          Sign In
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
      <button className="google-btn" onClick={handleGoogleSignIn}>
        Log in with Google
      </button>
    </Modal>
  );
}

export default LogIn; 
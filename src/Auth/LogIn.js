import React, { useState } from 'react';
import app from '../firebase';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
      navigate('/welcome');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
      navigate('/welcome');
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
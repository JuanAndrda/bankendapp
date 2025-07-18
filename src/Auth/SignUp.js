import React, { useState } from 'react';
import app from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import '../App.css';

const SignUp = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const auth = getAuth(app);

  if (!open) return null;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Account created! You can now sign in.');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit">Sign Up</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: '#22c55e', marginTop: '1rem' }}>{success}</p>}
      </div>
    </div>
  );
};

export default SignUp; 
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../firebase';
import { useNavigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        navigate('/', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // Redirect handled in useEffect
  return children;
};

export default RequireAuth; 
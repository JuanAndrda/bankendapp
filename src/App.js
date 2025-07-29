import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './UnAuth/LandingPage';
import RequireAuth from './Auth/RequireAuth';
import ProductList from './User/ProductList';
import AdminDashboard from './Auth/AdminDashboard';
import RequireAdmin from './Auth/RequireAdmin';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={
          <RequireAuth>
            <ProductList />
          </RequireAuth>
        } />
        <Route path="/admin" element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

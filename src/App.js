import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './UnAuth/LandingPage';
import WelcomePage from './Auth/WelcomePage';
import RequireAuth from './Auth/RequireAuth';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={
          <RequireAuth>
            <WelcomePage />
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React, { useState } from 'react';
import './LandingPage.css';
import vrImage from '../assets/images/vr-headset.png'; // Placeholder path, update if needed
import HomeSection from './sections/HomeSection';
import SpecsSection from './sections/SpecsSection';
import FeaturesSection from './sections/FeaturesSection';
import ReviewsSection from './sections/ReviewsSection';
import PricingSection from './sections/PricingSection';
import LogIn from '../Auth/LogIn';
import SignUp from '../Auth/SignUp';

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const LandingPage = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="navbar-logo">AiZone</div>
        <ul className="navbar-links">
          <li onClick={() => scrollToSection('home')}>Home</li>
          <li onClick={() => scrollToSection('specs')}>Specs</li>
          <li onClick={() => scrollToSection('features')}>Features</li>
          <li onClick={() => scrollToSection('reviews')}>Reviews</li>
          <li onClick={() => scrollToSection('pricing')}>Pricing</li>
        </ul>
        <div className="navbar-actions">
          <button className="navbar-buy" onClick={() => scrollToSection('pricing')}>Buy Now</button>
          <button onClick={() => setShowSignIn(true)} className="sign-in-btn">Log in</button>
          <button onClick={() => setShowSignUp(true)} className="sign-in-btn">Sign Up</button>
        </div>
      </nav>
      <HomeSection />
      <SpecsSection />
      <FeaturesSection />
      <ReviewsSection />
      <PricingSection />
      <LogIn open={showSignIn} onClose={() => setShowSignIn(false)} />
      <SignUp open={showSignUp} onClose={() => setShowSignUp(false)} />
    </div>
  );
};

export default LandingPage; 
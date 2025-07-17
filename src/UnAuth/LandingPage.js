import React from 'react';
import './LandingPage.css';
import vrImage from '../assets/images/vr-headset.png'; // Placeholder path, update if needed
import HomeSection from './sections/HomeSection';
import SpecsSection from './sections/SpecsSection';
import FeaturesSection from './sections/FeaturesSection';
import ReviewsSection from './sections/ReviewsSection';
import PricingSection from './sections/PricingSection';

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const LandingPage = () => {
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
        <button className="navbar-buy" onClick={() => scrollToSection('pricing')}>Buy Now</button>
      </nav>
      <HomeSection />
      <SpecsSection />
      <FeaturesSection />
      <ReviewsSection />
      <PricingSection />
    </div>
  );
};

export default LandingPage; 
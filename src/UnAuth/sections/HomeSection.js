import React from 'react';
import vrImage from '../../assets/images/vr-headset.png';
import './HomeSection.css';

const HomeSection = () => (
  <section id="home" className="home-section">
    <div className="home-content">
      <h2 className="home-title">Welcome to AiZone</h2>
      <p className="home-description">Experience the next generation of virtual reality gear.</p>
    </div>
    <div className="vr-image-interactive">
      <img src={vrImage} alt="VR Headset" />
    </div>
  </section>
);

export default HomeSection; 
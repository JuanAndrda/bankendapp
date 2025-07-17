import React from 'react';
import vrImage from '../../assets/images/vr-headset.png';

const HomeSection = () => (
  <section id="home" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', flexWrap: 'wrap', gap: '48px' }}>
    <div>
      <h2>Welcome to AiZone</h2>
      <p>Experience the next generation of virtual reality gear.</p>
    </div>
    <div className="vr-image-interactive">
      <img src={vrImage} alt="VR Headset" />
    </div>
  </section>
);

export default HomeSection; 
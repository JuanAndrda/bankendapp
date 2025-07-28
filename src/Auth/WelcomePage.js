import React from 'react';
import './WelcomePage.css';
import AddItem from "./AddItem";
import ItemsList from "./ItemsList";

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome!</h1>
      <p className="welcome-message">You are now signed in.</p>
      <div className="add-item-form">
        <AddItem />
      </div>
      <div className="items-list">
        <ItemsList />
      </div>
    </div>
  );
};

export default WelcomePage; 
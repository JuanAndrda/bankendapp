import React from 'react';
import './Modal.css';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 
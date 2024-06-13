// components/Popup.js
import React from 'react';
import '../styles/main.css';

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup" >
      <div className="popupContent">
        <span className="closeButton" onClick={onClose}>&times;</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Popup;

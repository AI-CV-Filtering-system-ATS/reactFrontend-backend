// src/components/ui/Button.jsx
import React from 'react';
import './button.css';

const Button = ({ onClick, children, className }) => {
  return (
    <button onClick={onClick} className={`button ${className}`}>
      {children}
    </button>
  );
};

export default Button;

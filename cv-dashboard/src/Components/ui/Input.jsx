import React from 'react';
import './input.css';

const Input = ({ type, placeholder, value, onChange, onKeyDown, onSearch }) => {
  return (
    <div className="input-container">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="input-field"
      />
      {/* Search Icon Button */}
      <button
        type="button"
        onClick={onSearch} // Trigger search when clicked
        className="search-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="search-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 2a8 8 0 015.293 13.707l4.854 4.854a1 1 0 01-1.414 1.414l-4.854-4.854A8 8 0 1110 2zm0 2a6 6 0 104.243 10.243A6 6 0 0010 4z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default Input;

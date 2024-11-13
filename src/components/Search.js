import React, { useState } from 'react';
import './Search.css';

const Search = ({ onSearch, noResults, setNoResults }) => {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    onSearch(value); // Send the search term to App.js
  };

  const handleClear = () => {
    setInput(''); // Clear the input field
    onSearch(''); // Reset the search term
    setNoResults(false); // Reset noResults to hide "No destination found..."
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search destinations..."
        value={input}
        onChange={handleChange}
      />
      {input && (
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      )}
      {noResults && <div className="no-results">No destination found...</div>}
    </div>
  );
};

export default Search;

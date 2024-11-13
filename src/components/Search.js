import React, { useState } from 'react';
import './Search.css'
const Search = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search destinations..."
        value={input}
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;
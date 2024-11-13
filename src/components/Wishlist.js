import React, { useState } from 'react';
import './Wishlist.css';
const Wishlist = ({ entries, onPost, onDelete, onUpdate, onMoveToTravelled }) => {
  const [newEntry, setNewEntry] = useState({
    destination: '',
    imageUrl: '',
    description: '',
    budget: '',
  });

  const [editing, setEditing] = useState(null); // To track which entry is being edited

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    onPost(newEntry);
    setNewEntry({ destination: '', imageUrl: '', description: '', budget: '' });
  };

  const handleEdit = (entry) => {
    setEditing(entry.id);
    setNewEntry({
      destination: entry.destination,
      imageUrl: entry.imageUrl,
      description: entry.description,
      budget: entry.budget,
    });
  };

  const handleUpdate = () => {
    onUpdate(editing, newEntry);
    setEditing(null);
    setNewEntry({ destination: '', imageUrl: '', description: '', budget: '' });
  };

  return (
    <div className="wishlist-container">
      <h2>Wishlist</h2>
      <div className="add-entry-form">
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={newEntry.destination}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={newEntry.imageUrl}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newEntry.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={newEntry.budget}
          onChange={handleChange}
        />
        {editing ? (
          <button onClick={handleUpdate}>Update Entry</button>
        ) : (
          <button onClick={handleAdd}>Add Entry</button>
        )}
      </div>

      <div className="entries-container">
        {entries.map((entry) => (
          <div key={entry.id} className="entry">
            <h3>{entry.destination}</h3>
            <img src={entry.imageUrl} alt={entry.destination} />
            <p>{entry.description}</p>
            <p>Budget: ${entry.budget}</p>
            <div className="button-container">
              <button onClick={() => onDelete(entry.id)}>Delete</button>
              <button onClick={() => handleEdit(entry)}>Edit</button>
              <button onClick={() => onMoveToTravelled(entry.id)}>
                Move to Travelled
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
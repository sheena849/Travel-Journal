import React, { useState } from 'react';
import './AlreadyTravelled.css';

const AlreadyTravelled = ({ entries, onDelete, onUpdate }) => {
  const [updatedFields, setUpdatedFields] = useState({
    id: null,
    description: '',
    budget: '',
    imageUrl: ''
  });

  const handleEdit = (entry) => {
    setUpdatedFields({
      id: entry.id,
      description: entry.description,
      budget: entry.budget,
      imageUrl: entry.imageUrl
    });
  };

  const handleDelete = (id) => {
    onDelete(id);
  };

  const handleUpdate = () => {
    if (updatedFields.id) {
      onUpdate(updatedFields.id, {
        description: updatedFields.description,
        budget: updatedFields.budget,
        imageUrl: updatedFields.imageUrl
      });
      setUpdatedFields({ id: null, description: '', budget: '', imageUrl: '' });
    }
  };

  return (
    <div className="already-travelled-container">
      <h2>Already Travelled</h2>
      <div className="entries-container">
        {entries.map((entry) => (
          <div key={entry.id} className="travelled-entry">
            <img src={entry.imageUrl} alt={entry.destination} />
            <h3>{entry.destination}</h3>
            <p>{entry.description}</p>
            <p>Budget: ${entry.budget}</p>
            <div className="button-container">
              <button className="delete-button" onClick={() => handleDelete(entry.id)}>Delete</button>
              <button className="edit-button" onClick={() => handleEdit(entry)}>Edit</button>
            </div>

            {/* Edit Section */}
            {updatedFields.id === entry.id && (
              <div className="edit-section">
                <h4>Edit Entry</h4>
                <input
                  type="text"
                  placeholder="Updated Description"
                  value={updatedFields.description}
                  onChange={(e) => setUpdatedFields({ ...updatedFields, description: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Updated Budget"
                  value={updatedFields.budget}
                  onChange={(e) => setUpdatedFields({ ...updatedFields, budget: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Updated Image URL"
                  value={updatedFields.imageUrl}
                  onChange={(e) => setUpdatedFields({ ...updatedFields, imageUrl: e.target.value })}
                />
                <button className="save-button" onClick={handleUpdate}>Save</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlreadyTravelled;

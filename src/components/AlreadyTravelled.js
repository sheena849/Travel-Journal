import React, { useState } from 'react';
import './AlreadyTravelled.css';

const AlreadyTravelled = ({ entries, onDelete, onUpdate }) => {
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({
    description: '',
    budget: '',
  });

  const startEditing = (entry) => {
    setEditingEntryId(entry.id);
    setUpdatedFields({
      description: entry.description,
      budget: entry.budget,
    });
  };

  const cancelEditing = () => {
    setEditingEntryId(null);
    setUpdatedFields({ description: '', budget: '' });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleUpdateSave = () => {
    console.log("Saving update for ID:", editingEntryId);  // Debugging
    console.log("Updated fields:", updatedFields);  // Debugging

    if (editingEntryId !== null) {
      onUpdate(editingEntryId, updatedFields);  // Ensure only onUpdate is called
      cancelEditing();
    }
  };

  return (
    <div className="already-travelled-container">
      <h2>Already Travelled</h2>
      {entries.map((entry) => (
        <div key={entry.id} className="travelled-entry">
          <h3>{entry.destination}</h3> {/* Display destination */}
          <img src={entry.imageUrl} alt={entry.destination} /> {/* Display image */}
          <p>Description: {entry.description}</p> {/* Display updated description */}
          <p>Budget: ${entry.budget}</p> {/* Display updated budget */}

          <div className="button-container">
            <button onClick={() => onDelete(entry.id)} className="delete-button">
              Delete
            </button>
            <button onClick={() => startEditing(entry)} className="edit-button">
              Edit
            </button>
          </div>

          {editingEntryId === entry.id && (
            <div className="edit-section">
              <h4>Edit Entry</h4>
              <textarea
                name="description"
                value={updatedFields.description}
                onChange={handleUpdateChange}
                placeholder="Update description"
              />
              <input
                type="number"
                name="budget"
                value={updatedFields.budget}
                onChange={handleUpdateChange}
                placeholder="Update budget"
              />
              <div className="button-container">
                <button onClick={handleUpdateSave} className="save-button">
                  Save
                </button>
                <button onClick={cancelEditing} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlreadyTravelled;
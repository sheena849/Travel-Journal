import React, { useState } from 'react';
import './AlreadyTravelled.css';

const AlreadyTravelled = ({ entries, onDelete, onUpdate }) => {
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({
    description: '',
    budget: '',
    imageUrl: '',
  });

  const startEditing = (entry) => {
    setEditingEntryId(entry.id);
    setUpdatedFields({
      description: entry.description,
      budget: entry.budget,
      imageUrl: entry.imageUrl, // Set initial value for image URL
    });
  };

  const cancelEditing = () => {
    setEditingEntryId(null);
    setUpdatedFields({ description: '', budget: '', imageUrl: '' });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleUpdateSave = () => {
    if (editingEntryId !== null) {
      onUpdate(editingEntryId, updatedFields);
      cancelEditing();
    }
  };

  return (
    <div className="already-travelled-container">
      <h2>Already Travelled</h2>
      <div className="entries-container">
        {entries.map((entry) => (
          <div key={entry.id} className="travelled-entry">
            <h3>{entry.destination}</h3>
            <img src={entry.imageUrl} alt={entry.destination} />
            <p>Description: {entry.description}</p>
            <p>Budget: ${entry.budget}</p>

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
                <input
                  type="text"
                  name="imageUrl"
                  value={updatedFields.imageUrl}
                  onChange={handleUpdateChange}
                  placeholder="Update image URL"
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
    </div>
  );
};

export default AlreadyTravelled;


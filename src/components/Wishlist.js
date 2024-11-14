import React, { useState } from 'react';
import './Wishlist.css';

const Wishlist = ({ entries, setEntries }) => {
  const [newEntry, setNewEntry] = useState({
    destination: '',
    imageUrl: '',
    description: '',
    budget: '',
  });

  const [editing, setEditing] = useState(null); // Track which entry is being edited
  const [updatedFields, setUpdatedFields] = useState({
    description: '',
    budget: '',
    imageUrl: '', // Added image URL to updated fields
  });

  const [message, setMessage] = useState(null); // Success/Error messages

  // Helper function for adding new entry
  const addEntry = async () => {
    try {
      const res = await fetch('http://localhost:3000/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEntry, status: 'Wishlist' }),
      });
      const postedEntry = await res.json();
      setEntries((prevEntries) => [...prevEntries, postedEntry]);
      setNewEntry({
        destination: '',
        imageUrl: '',
        description: '',
        budget: '',
      });
      setMessage('Entry added successfully!');
    } catch (err) {
      console.error('Error posting entry:', err);
      setMessage('Error adding entry. Please try again.');
    }
  };

  // Handle deleting an entry from the Wishlist
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/entries/${id}`, { method: 'DELETE' });
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
      setMessage('Entry deleted successfully!');
    } catch (err) {
      console.error('Error deleting entry:', err);
      setMessage('Error deleting entry. Please try again.');
    }
  };

  // Handle moving an entry to the "Already Travelled" section
  const handleMoveToTravelled = async (id) => {
    try {
      const entry = entries.find((entry) => entry.id === id);
      await fetch(`http://localhost:3000/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entry, status: 'Already Travelled' }),
      });
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === id ? { ...entry, status: 'Already Travelled' } : entry
        )
      );
      setMessage('Entry moved to Already Travelled!');
    } catch (err) {
      console.error('Error moving to already travelled:', err);
      setMessage('Error moving entry. Please try again.');
    }
  };

  // Handle editing an entry
  const handleEdit = (entry) => {
    setEditing(entry.id);
    setUpdatedFields({
      description: entry.description,
      budget: entry.budget,
      imageUrl: entry.imageUrl,
    });
  };

  // Handle saving the updated entry
  const handleUpdate = async (id) => {
    try {
      const entry = entries.find((entry) => entry.id === id);
      const updatedData = { ...entry, ...updatedFields };
      const res = await fetch(`http://localhost:3000/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const updatedEntry = await res.json();
      setEntries((prevEntries) =>
        prevEntries.map((entry) => (entry.id === id ? updatedEntry : entry))
      );
      setEditing(null); // Reset editing state after updating
      setUpdatedFields({ description: '', budget: '', imageUrl: '' });
      setMessage('Entry updated successfully!');
    } catch (err) {
      console.error('Error updating entry:', err);
      setMessage('Error updating entry. Please try again.');
    }
  };

  return (
    <div className="wishlist-container">
      <h2>Wishlist</h2>
      
      {/* Message Display */}
      {message && <div className="message">{message}</div>}

      <div className="add-entry-form">
        <input
          type="text"
          placeholder="Destination"
          value={newEntry.destination}
          onChange={(e) => setNewEntry({ ...newEntry, destination: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newEntry.imageUrl}
          onChange={(e) => setNewEntry({ ...newEntry, imageUrl: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newEntry.description}
          onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Budget"
          value={newEntry.budget}
          onChange={(e) => setNewEntry({ ...newEntry, budget: e.target.value })}
        />
        <button onClick={addEntry}>Add to Wishlist</button>
      </div>

      <div className="entries-container">
        {entries.map((entry) =>
          entry.status === 'Wishlist' && (
            <div key={entry.id} className="entry">
              <h3>{entry.destination}</h3>
              <img src={entry.imageUrl} alt={entry.destination} />
              {/* Edit form appears directly in the list */}
              {editing === entry.id ? (
                <div>
                  <input
                    type="text"
                    value={updatedFields.imageUrl}
                    onChange={(e) => setUpdatedFields({ ...updatedFields, imageUrl: e.target.value })}
                    placeholder="Image URL"
                  />
                  <textarea
                    value={updatedFields.description}
                    onChange={(e) => setUpdatedFields({ ...updatedFields, description: e.target.value })}
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={updatedFields.budget}
                    onChange={(e) => setUpdatedFields({ ...updatedFields, budget: e.target.value })}
                    placeholder="Budget"
                  />
                  <button onClick={() => handleUpdate(entry.id)}>Save</button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{entry.description}</p>
                  <p>{`$${entry.budget}`}</p> {/* Display budget with dollar sign */}
                  <div className="button-container">
                    <button onClick={() => handleMoveToTravelled(entry.id)} className="move-btn">
                      Move to Already Travelled
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="delete-btn">
                      Delete
                    </button>
                    <button onClick={() => handleEdit(entry)} className="update-btn">
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Wishlist;

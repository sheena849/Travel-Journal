import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Search from './components/Search';
import AlreadyTravelled from './components/AlreadyTravelled';
import Wishlist from './components/Wishlist';
import ErrorPage from './components/ErrorPage';
import './App.css';

const App = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/entries')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        console.log('Fetched entries:', data);
        setEntries(data);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError(true);
      });
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log('Search term:', term);
  };

  const handleDelete = (id) => {
    console.log('Deleting entry with id:', id);
    fetch(`http://localhost:3000/entries/${id}`, { method: 'DELETE' })
      .then(() => {
        setEntries(entries.filter((entry) => entry.id !== id));
      })
      .catch((err) => {
        console.error('Error deleting entry:', err);
        setError(true);
      });
  };

  const handleUpdate = (id, updatedEntry) => {
    console.log('Updating entry with id:', id, 'to:', updatedEntry);
    const entryToUpdate = entries.find((entry) => entry.id === id);
    const updatedData = {
      ...entryToUpdate,
      description: updatedEntry.description,
      budget: updatedEntry.budget,
    };

    fetch(`http://localhost:3000/entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((updatedData) => {
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.id === id ? updatedData : entry
          )
        );
      })
      .catch((err) => {
        console.error('Error updating entry:', err);
        setError(true);
      });
  };

  const handlePost = (newEntry) => {
    console.log('Posting new entry:', newEntry);
    fetch('http://localhost:3000/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newEntry, status: 'Wishlist' }),
    })
      .then((res) => res.json())
      .then((postedEntry) => {
        setEntries([...entries, postedEntry]);
      })
      .catch((err) => {
        console.error('Error posting entry:', err);
        setError(true);
      });
  };

  const handleMoveToTravelled = (id) => {
    console.log('Moving entry with id:', id, 'to Travelled');
    const entryToUpdate = entries.find((entry) => entry.id === id);
    const updatedEntry = { ...entryToUpdate, status: 'Already Travelled' };
    handleUpdate(id, updatedEntry);
  };

  if (error) return <ErrorPage />;

  return (
    <div>
      <Header />
      <Search onSearch={handleSearch} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <AlreadyTravelled
          entries={entries.filter(
            (entry) =>
              entry.status === 'Already Travelled' &&
              entry.destination.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
        <Wishlist
          entries={entries.filter(
            (entry) =>
              entry.status === 'Wishlist' &&
              entry.destination.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onPost={handlePost}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onMoveToTravelled={handleMoveToTravelled}
        />
      </div>
    </div>
  );
};

export default App;

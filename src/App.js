import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Search from './components/Search';
import AlreadyTravelled from './components/AlreadyTravelled';
import Wishlist from './components/Wishlist';
import ErrorPage from './components/ErrorPage';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch('http://localhost:3000/entries');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(true);
      }
    };
    fetchEntries();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const hasResults = entries.some(entry =>
      entry.destination.toLowerCase().includes(term.toLowerCase())
    );
    setNoResults(!hasResults);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/entries/${id}`, { method: 'DELETE' });
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError(true);
    }
  };

  const handleUpdate = async (id, updatedFields) => {
    const entryToUpdate = entries.find((entry) => entry.id === id);
    if (!entryToUpdate) return;

    const updatedData = { ...entryToUpdate, ...updatedFields };

    try {
      const res = await fetch(`http://localhost:3000/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const updatedEntry = await res.json();
      setEntries((prevEntries) =>
        prevEntries.map((entry) => (entry.id === id ? updatedEntry : entry))
      );
    } catch (err) {
      console.error('Error updating entry:', err);
      setError(true);
    }
  };

  const handlePost = async (newEntry) => {
    try {
      const res = await fetch('http://localhost:3000/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEntry, status: 'Wishlist' }),
      });
      const postedEntry = await res.json();
      setEntries((prevEntries) => [...prevEntries, postedEntry]);
    } catch (err) {
      console.error('Error posting entry:', err);
      setError(true);
    }
  };

  const handleMoveToTravelled = (id) => {
    handleUpdate(id, { status: 'Already Travelled' });
  };

  if (error) return <ErrorPage />;

  const filteredEntries = (status) =>
    entries.filter(
      (entry) =>
        entry.status === status &&
        entry.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Router>
      <div className="app-container">
        <div className="header-navbar-container">
          <Header />
          <Navbar />
        </div>
        <Search onSearch={handleSearch} noResults={noResults} setNoResults={setNoResults} />
        {noResults && <div className="no-results">No destination found...</div>}

        <Routes>
          <Route path="/" element={
            <>
              <div className="columns-container">
                <div className="column">
                  <AlreadyTravelled
                    entries={filteredEntries('Already Travelled')}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                </div>
                <div className="column">
                  <Wishlist
                    entries={filteredEntries('Wishlist')}
                    onPost={handlePost}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    onMoveToTravelled={handleMoveToTravelled}
                    setEntries={setEntries} 
                  />
                </div>
              </div>
            </>
          } />
          <Route path="/wishlist" element={
            <div className="columns-container">
              <div className="column">
                <Wishlist
                  entries={filteredEntries('Wishlist')}
                  onPost={handlePost}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onMoveToTravelled={handleMoveToTravelled}
                  setEntries={setEntries} // Passing setEntries correctly
                />
              </div>
            </div>
          } />
          <Route path="/already-travelled" element={
            <div className="columns-container">
              <div className="column">
                <AlreadyTravelled
                  entries={filteredEntries('Already Travelled')}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

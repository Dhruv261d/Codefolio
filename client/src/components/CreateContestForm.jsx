// client/src/components/CreateContestForm.jsx
import React, { useState } from 'react';
import { auth } from '../firebase.js';

function CreateContestForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setMessage('Error: Not logged in.');
      return;
    }
    
    if (new Date(endTime) <= new Date(startTime)) {
      setMessage('Error: End time must be after start time.');
      return;
    }

    // const contestData = { title, description, startTime, endTime };
    const contestData = { 
      title, 
      description, 
      startTime: new Date(startTime).toISOString(), 
      endTime: new Date(endTime).toISOString() 
    };

    
    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/contests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(contestData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create contest.');
      }
      setMessage(`Success: ${data.message}`);
      setTitle(''); setDescription(''); setStartTime(''); setEndTime('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Create New Contest</h2>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Contest Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{width: '100%', padding: '8px', boxSizing: 'border-box'}} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" style={{width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'vertical'}} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Start Time:</label>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required style={{width: '100%', padding: '8px', boxSizing: 'border-box'}} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>End Time:</label>
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required style={{width: '100%', padding: '8px', boxSizing: 'border-box'}} />
      </div>
      <button type="submit" style={{ marginTop: '10px', padding: '10px 15px' }}>Create Contest</button>
      {message && <p style={{ marginTop: '15px', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
    </form>
  );
}

export default CreateContestForm;
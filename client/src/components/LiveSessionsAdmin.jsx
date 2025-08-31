// client/src/components/LiveSessionsAdmin.jsx
import React, { useState } from 'react';
import { auth } from '../firebase.js';

function LiveSessionsAdmin() {
    const [title, setTitle] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [message, setMessage] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        try {
            if (!auth.currentUser) throw new Error('Authentication error.');
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/sessions/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ title, meetingLink, startTime, endTime }), 
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create session.');
            }
            setMessage(`Success: ${data.message}`);
            setTitle('');
            setMeetingLink('');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Create New Live Session</h2>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block' }}>Session Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block' }}>Meeting Link (e.g., Google Meet or Zoom):</label>
                <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    required
                    placeholder="https://meet.google.com/..."
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
             <label style={{ display: 'block' }}>Start Time:</label>
             <input
                 type="datetime-local"
                 value={startTime}
                 onChange={(e) => setStartTime(e.target.value)}
                 required
                 style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
             />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block' }}>End Time:</label>
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>
                <button type="submit" style={{ marginTop: '10px', padding: '10px 15px' }}>Create Session</button>
            {message && <p style={{ marginTop: '15px', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
        </form>
    );
}

export default LiveSessionsAdmin;
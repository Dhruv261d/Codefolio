// client/src/components/LiveSessionsStudent.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';


const getSessionStatus = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start) || isNaN(end)) {
    return { text: 'Invalid Date', color: '#dc3545' };
  }
  if (now < start) return { text: 'Upcoming', color: '#007bff' };
  if (now >= start && now < end) return { text: 'Active', color: '#28a745' };
  return { text: 'Finished', color: '#6c757d' };
};

function LiveSessionsStudent() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSessions = async () => {
            if (!auth.currentUser) {
                setError("You must be logged in to view live sessions.");
                setLoading(false);
                return;
            }
            try {
                const idToken = await auth.currentUser.getIdToken();
                const response = await fetch('http://localhost:5000/api/sessions', {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch live sessions.');
                }
                const data = await response.json();
                setSessions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    if (loading) return <div>Loading live sessions...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h2 style={{ fontSize: '1.8rem', color: '#343a40' }}>Live Sessions</h2>
            {sessions.length > 0 ? (
                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {sessions.map(session => {
                     const status = getSessionStatus(session.startTime, session.endTime);
                     const startDate = new Date(session.startTime);
                    const endDate = new Date(session.endTime);          
                     const isJoinable = status.text === 'Active';

                     return (
                         <div key={session.id} style={{
                             backgroundColor: '#fff', border: '1px solid #dee2e6',
                             padding: '20px', borderRadius: '10px',
                             boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                         }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#212529' }}>{session.title}</h3>
                                 <span style={{ color: status.color, fontWeight: '600' }}>{status.text}</span>
                             </div>
                             <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#6c757d' }}>
                                 Starts: {startDate ? startDate.toLocaleString('en-IN') : 'N/A'}<br/>
                                 Ends: {endDate ? endDate.toLocaleString('en-IN') : 'N/A'}
                             </p>
                             <a 
                                 href={isJoinable ? session.meetingLink : undefined} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 onClick={(e) => !isJoinable && e.preventDefault()}
                                 style={{
                                     display: 'inline-block', padding: '10px 20px', 
                                     backgroundColor: isJoinable ? '#28a745' : '#6c757d',
                                     color: '#fff', textDecoration: 'none', borderRadius: '6px',
                                     fontWeight: '600', transition: 'background-color 0.2s ease',
                                     cursor: isJoinable ? 'pointer' : 'not-allowed',
                                     opacity: isJoinable ? 1 : 0.6
                                 }}
                             >
                                 Join Session
                             </a>
                         </div>
                     );
                 })}
                </div>
            ) : (
                <p style={{ color: '#6c757d' }}>No live sessions are scheduled at the moment.</p>
            )}
        </div>
    );
}

export default LiveSessionsStudent;
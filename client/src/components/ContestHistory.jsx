// client/src/components/ContestHistory.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';

// --- Using the same robust date logic from your other components ---
const parseFirestoreDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp._seconds) return new Date(timestamp._seconds * 1000);
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
  if (typeof timestamp === 'string') {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

function ContestHistory({ onPracticeClick, onLeaderboardClick }) {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!auth.currentUser) {
                setError("You must be logged in to view contest history.");
                setLoading(false);
                return;
            }
            try {
                const idToken = await auth.currentUser.getIdToken();
                const response = await fetch('http://localhost:5000/api/student/contests/history', {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch contest history.');
                }
                const data = await response.json();
                setContests(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div>Loading contest history...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ marginTop: '20px' }}>
            <h2 style={{color: '#333'}}>Contest History</h2>
            {contests.length > 0 ? (
                contests.map(contest => {
                    const endDate = parseFirestoreDate(contest.endTime);

                    return (
                        <div key={contest.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>{contest.title}</h3>
                            <p style={{ fontSize: '0.9em', color: '#555' }}>
                                Ended on: {endDate ? endDate.toLocaleString() : 'Invalid Date'}
                            </p>
                            <div style={{marginTop: '10px'}}>
                                <button 
                                    onClick={() => onPracticeClick(contest.id)}
                                    style={{ 
                                        backgroundColor: '#6c757d', color: 'white', border: 'none', 
                                        padding: '10px 15px', borderRadius: '5px', marginRight: '10px', cursor: 'pointer'
                                    }}
                                >
                                    Practice
                                </button>
                                <button 
                                    onClick={() => onLeaderboardClick(contest.id)}
                                    style={{ 
                                        backgroundColor: '#007bff', color: 'white', border: 'none', 
                                        padding: '10px 15px', borderRadius: '5px', cursor: 'pointer'
                                    }}
                                >
                                    View Leaderboard
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No past contests found.</p>
            )}
        </div>
    );
}

export default ContestHistory;
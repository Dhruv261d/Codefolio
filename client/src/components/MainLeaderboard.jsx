// client/src/components/MainLeaderboard.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';

function MainLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!auth.currentUser) {
                setError("You must be logged in to view the leaderboard.");
                setLoading(false);
                return;
            }
            try {
                const idToken = await auth.currentUser.getIdToken();
                const response = await fetch('http://localhost:5000/api/leaderboard', {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch main leaderboard data.');
                }
                const data = await response.json();
                setLeaderboard(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) return <div>Loading Leaderboard...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h2 style={{ color: '#333' }}>Platform Leaderboard</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#333' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Rank</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>User</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.length > 0 ? (
                        leaderboard.map((entry, index) => (
                            <tr key={entry.userId} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{index + 1}</td>
                                <td style={{ padding: '12px' }}>{entry.userName}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: '#007bff' }}>{entry.rating}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ padding: '12px', textAlign: 'center' }}>
                                The leaderboard is empty. Participate in a contest to get a rating!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MainLeaderboard;
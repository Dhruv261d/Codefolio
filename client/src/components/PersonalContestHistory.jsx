// client/src/components/PersonalContestHistory.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';

function PersonalContestHistory({ onPracticeClick }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!auth.currentUser) {
                setError("You must be logged in to view your history.");
                setLoading(false);
                return;
            }
            try {
                const idToken = await auth.currentUser.getIdToken();
                const response = await fetch('http://localhost:5000/api/users/contest-history', {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch contest history.');
                }
                const data = await response.json();
                setHistory(data);
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

    // This is the clean way to render the table rows
    const renderTableRows = () => {
        if (history.length > 0) {
            return history.map(item => (
                <tr key={item.contestId} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{item.contestName}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.score}</td>
                    <td style={{ padding: '12px' }}>{item.rank}</td>
                    {/* The button is not yet functional, placeholder for now */}
                    <td style={{ padding: '12px' }}>
                        <button onClick={() => onPracticeClick(item.contestId)}>Practice</button>
                    </td>
                </tr>
            ));
        }
        return (
            <tr>
                <td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>
                    You haven't participated in any contests yet.
                </td>
            </tr>
        );
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#333' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Contest Name</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Final Score</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Rank</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows()}
                </tbody>
            </table>
        </div>
    );
}

export default PersonalContestHistory;
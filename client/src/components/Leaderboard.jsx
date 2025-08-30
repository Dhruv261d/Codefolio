// client/src/components/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';

function Leaderboard({ contestId, onBack }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [problems, setProblems] = useState([]);
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
                const response = await fetch(`http://localhost:5000/api/contests/${contestId}/leaderboard`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard data.');
                }
                const data = await response.json();
                setLeaderboard(data.leaderboard);
                setProblems(data.problems);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (contestId) {
            fetchLeaderboard();
        }
    }, [contestId]);

    const formatTime = (totalSeconds) => {
        if (totalSeconds === 0 && leaderboard.length > 0) return "00:00:00";
        if (totalSeconds === 0) return "--:--:--";
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    if (loading) return <div>Loading leaderboard...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <button onClick={onBack} style={{ marginBottom: '20px' }}>&larr; Back to Contest Lobby</button>
            <h2 style={{ color: '#333' }}>Contest Leaderboard</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#333' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Rank</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>User</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Score</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Finish Time</th>
                        {problems.map((p, index) => (
                            <th key={p.id} style={{ padding: '8px', textAlign: 'center' }}>{`Q${index + 1}`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.length > 0 ? (
                        leaderboard.map((entry, index) => (
                            <tr key={entry.userId} style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{index + 1}</td>
                                <td style={{ padding: '8px' }}>{entry.userName}</td>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{entry.score}</td>
                                <td style={{ padding: '8px' }}>{formatTime(entry.finishTime)}</td>
                                {problems.map(p => {
                                    const detail = entry.problemDetails[p.id];
                                    if (detail?.solved) {
                                        return (
                                            <td key={p.id} style={{ padding: '8px', textAlign: 'center', backgroundColor: '#d4edda', color: '#155724' }}>
                                                <div>{formatTime(detail.solveTime)}</div>
                                                <div style={{fontSize: '0.8em'}}>({detail.attempts} {detail.attempts > 1 ? 'tries' : 'try'})</div>
                                            </td>
                                        );
                                    } else if (detail?.attempts > 0) {
                                        return <td key={p.id} style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f8d7da', color: '#721c24' }}>-{detail.attempts}</td>;
                                    } else {
                                        return <td key={p.id} style={{ padding: '8px', textAlign: 'center' }}>-</td>;
                                    }
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4 + problems.length} style={{ padding: '8px', textAlign: 'center' }}>
                                No submissions yet. Be the first!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Leaderboard;
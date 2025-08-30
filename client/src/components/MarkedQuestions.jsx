// client/src/components/MarkedQuestions.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';

function MarkedQuestions({ onSolveClick }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMarkedQuestions = async () => {
            if (!auth.currentUser) {
                setError("You must be logged in to view marked questions.");
                setLoading(false);
                return;
            }
            try {
                const idToken = await auth.currentUser.getIdToken();
                const response = await fetch('http://localhost:5000/api/users/marked-questions', {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch marked questions.');
                }
                const data = await response.json();
                setQuestions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkedQuestions();
    }, []);

    if (loading) return <div>Loading marked questions...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#333' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Problem Title</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Difficulty</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length > 0 ? (
                        questions.map(q => (
                            <tr key={q.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{q.title}</td>
                                <td style={{ padding: '12px', color: q.difficulty === 'Hard' ? 'red' : q.difficulty === 'Medium' ? 'orange' : 'green' }}>
                                    {q.difficulty}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {/* This button will navigate to the problem page later */}
                                    <button onClick={() => onSolveClick(q.id, true)}>Solve Again</button>                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ padding: '12px', textAlign: 'center' }}>
                                You haven't bookmarked any questions yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MarkedQuestions;
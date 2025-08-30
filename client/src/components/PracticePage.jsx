// client/src/components/PracticePage.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';

function PracticePage({ contestId, onBack, onSolveClick }) {
    const [problems, setProblems] = useState([]);
    const [contestTitle, setContestTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContestAndProblems = async () => {
            if (!auth.currentUser) {
                setError("You must be logged in to practice.");
                setLoading(false);
                return;
            }
            try {
                const idToken = await auth.currentUser.getIdToken();
                
                const contestRes = await fetch(`http://localhost:5000/api/contests/${contestId}`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (!contestRes.ok) throw new Error('Failed to fetch contest details.');
                const contestData = await contestRes.json();
                setContestTitle(contestData.title);

                const problemsRes = await fetch(`http://localhost:5000/api/contests/${contestId}/problems`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (!problemsRes.ok) throw new Error('Failed to fetch problems.');
                const problemsData = await problemsRes.json();
                setProblems(problemsData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (contestId) {
            fetchContestAndProblems();
        }
    }, [contestId]);

    if (loading) return <div>Loading practice session...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <button onClick={onBack} style={{ marginBottom: '20px' }}>&larr; Back to Contest History</button>
            <h2 style={{color: '#333'}}>Practice: {contestTitle}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                        <th style={{ color: '#333', padding: '8px', textAlign: 'left' }}>#</th>
                        <th style={{ color: '#333', padding: '8px', textAlign: 'left' }}>Title</th>
                        <th style={{ color: '#333', padding: '8px', textAlign: 'left' }}>Difficulty</th>
                        <th style={{ color: '#333', padding: '8px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.length > 0 ? (
                        problems.map((problem, index) => (
                            <tr key={problem.id} style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ color: '#333', padding: '8px' }}>{index + 1}</td>
                                <td style={{ color: '#333', padding: '8px' }}>{problem.title}</td>
                                <td style={{ padding: '8px', color: problem.difficulty === 'Hard' ? 'red' : problem.difficulty === 'Medium' ? 'orange' : 'green' }}>
                                    {problem.difficulty}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    <button onClick={() => onSolveClick(problem.id)}>Solve</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ color: '#333', padding: '8px', textAlign: 'center' }}>No problems found for this contest.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default PracticePage;
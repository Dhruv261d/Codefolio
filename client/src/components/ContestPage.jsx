// client/src/components/ContestPage.jsx
import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// --- START: FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyAtoruRZWCbBmtdKL_zQ2KgBVa5kqIBlvI",
  authDomain: "codefolio-dc15e.firebaseapp.com",
  projectId: "codefolio-dc15e",
  storageBucket: "codefolio-dc15e.appspot.com",
  messagingSenderId: "976455322727",
  appId: "1:976455322727:web:900bd38d98b19cfd5b18c2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// --- END: FIREBASE CONFIGURATION ---

// ADDITION: Accept the 'onSolveClick' prop
function ContestPage({ contestId, onBack, onSolveClick }) {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProblems = async () => {
            if (!auth.currentUser) {
                setError("You must be logged in to view problems.");
                setLoading(false);
                return;
            }

            try {
                const idToken = await auth.currentUser.getIdToken();
                const response = await fetch(`http://localhost:5000/api/contests/${contestId}/problems`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch problems.');
                }

                const data = await response.json();
                setProblems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (contestId) {
            fetchProblems();
        }
    }, [contestId]);

    if (loading) return <div>Loading problems...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <button onClick={onBack} style={{ marginBottom: '20px' }}>&larr; Back to Contest Lobby</button>
            <h2 style={{color: '#333'}}>Contest Problems</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                        <th style={{ padding: '8px', textAlign: 'left', color: '#333' }}>#</th>
                        <th style={{ padding: '8px', textAlign: 'left',color: '#333' }}>Title</th>
                        <th style={{ padding: '8px', textAlign: 'left',color: '#333' }}>Difficulty</th>
                        <th style={{ padding: '8px', textAlign: 'left',color: '#333' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.length > 0 ? (
                        problems.map((problem, index) => (
                            <tr key={problem.id} style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px', color: '#333' }}>{index + 1}</td>
                                <td style={{ padding: '8px', color: '#333' }}>{problem.title}</td>
                                <td style={{ padding: '8px', color: problem.difficulty === 'Hard' ? 'red' : problem.difficulty === 'Medium' ? 'orange' : 'green' }}>
                                    {problem.difficulty}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    {/* ADDITION: Add the onClick handler to the button */}
                                    <button onClick={() => onSolveClick(problem.id)}>Solve</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ padding: '8px', textAlign: 'center', color: '#333' }}>No problems found for this contest.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ContestPage;
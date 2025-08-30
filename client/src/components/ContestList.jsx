// client/src/components/ContestList.jsx
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

function ContestList({ onAddProblemClick }) {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const parseFirestoreDate = (timestamp) => {
        if (!timestamp) return null;
        const seconds = timestamp.seconds ?? timestamp._seconds;
        if (typeof seconds === 'number') return new Date(seconds * 1000);
        if (typeof timestamp === 'string') {
            const parsed = new Date(timestamp);
            return isNaN(parsed.getTime()) ? null : parsed;
        }
        if (timestamp instanceof Date) return timestamp;
        return null;
    };

    const getContestStatus = (startTime, endTime) => {
        const now = new Date();
        const start = parseFirestoreDate(startTime);
        const end = parseFirestoreDate(endTime);
        if (!start || !end) return { text: 'Invalid Date', color: 'red' };
        if (now < start) return { text: 'Upcoming', color: 'blue' };
        if (now >= start && now < end) return { text: 'Active', color: 'green' };
        return { text: 'Finished', color: 'grey' };
    };

    const getCountdown = (endTime) => {
        const end = parseFirestoreDate(endTime);
        const now = new Date();
        const diffMs = end - now;
        if (diffMs <= 0) return '00:00:00';

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleFinalize = async (contestId) => {
        setMessage('Finalizing...');
        try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch(`http://localhost:5000/api/contests/${contestId}/finalize`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${idToken}` }
            });
            if (!response.ok) throw new Error('Failed to finalize.');
            setMessage('Leaderboard finalized successfully!');
            // Refresh the contest list to update the button's visibility
            const refreshResponse = await fetch('http://localhost:5000/api/contests', { headers: { 'Authorization': `Bearer ${idToken}` } });
            const data = await refreshResponse.json();
            setContests(data);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    useEffect(() => {
        const fetchContests = async () => {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                if (user) {
                    try {
                        const idToken = await user.getIdToken();
                        const response = await fetch('http://localhost:5000/api/contests', {
                            headers: { 'Authorization': `Bearer ${idToken}` }
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Failed to fetch contests.');
                        }

                        const data = await response.json();
                        console.log("Fetched contests:", data);
                        const sorted = data.sort((a, b) => {
                            const aStart = parseFirestoreDate(a.startTime)?.getTime() || 0;
                            const bStart = parseFirestoreDate(b.startTime)?.getTime() || 0;
                            return aStart - bStart;
                        });
                        setContests(sorted);
                    } catch (err) {
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setError("You must be logged in to view contests.");
                    setLoading(false);
                }
            });
            return () => unsubscribe();
        };

        fetchContests();
    }, []);

    if (loading) return <div>Loading contests...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h2>Existing Contests</h2>
            {message && <p>{message}</p>} {/* ADD THIS LINE */}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Title</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Start Time (IST)</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>End Time (IST)</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Countdown</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contests.length > 0 ? (
                        contests.map(contest => {
                            const status = getContestStatus(contest.startTime, contest.endTime);
                            const startDate = parseFirestoreDate(contest.startTime);
                            const endDate = parseFirestoreDate(contest.endTime);
                            const countdown = status.text === 'Active' ? getCountdown(contest.endTime) : '-';

                            return (
                                <tr key={contest.id || contest.title} style={{ borderBottom: '1px solid #ccc' }}>
                                    <td style={{ padding: '8px' }}>{contest.title}</td>
                                    <td style={{ padding: '8px' }}>
                                        {startDate ? startDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Invalid Date'}
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                        {endDate ? endDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Invalid Date'}
                                    </td>
                                    <td style={{ padding: '8px', color: status.color, fontWeight: 'bold' }}>
                                        {status.text}
                                    </td>
                                    <td style={{ padding: '8px' }}>{countdown}</td>
                                    <td style={{ padding: '8px' }}>
                                        <button onClick={() => onAddProblemClick(contest.id)}>Add Problem</button>
                                        {status.text === 'Finished' && !contest.isFinalized && (
                                        <button onClick={() => handleFinalize(contest.id)} style={{ marginLeft: '10px' }}>
                                            Finalize Leaderboard
                                        </button>
                                    )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ padding: '8px', textAlign: 'center' }}>
                                No contests found. Create one!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ContestList;

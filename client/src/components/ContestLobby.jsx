import React, { useState, useEffect } from 'react';
import { getApps, initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import CountdownTimer from './CountdownTimer.jsx';

// --- Firebase Config ---
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

// --- Timestamp Parsing + Status Logic ---
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

const getContestStatus = (startTime, endTime) => {
  const now = new Date();
  const start = parseFirestoreDate(startTime);
  const end = parseFirestoreDate(endTime);

  if (!start || !end || isNaN(start) || isNaN(end)) {
    return { text: 'Invalid Date', color: '#dc3545' };
  }

  if (now < start) return { text: 'Upcoming', color: '#007bff' };
  if (now >= start && now < end) return { text: 'Active', color: '#28a745' };
  return { text: 'Finished', color: '#6c757d' };
};

// --- ContestLobby Component ---
// ADDITION: Accept the 'onLeaderboardClick' prop
function ContestLobby({ onEnterContest, onLeaderboardClick }) {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setError("You must be logged in to view contests.");
        setLoading(false);
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const response = await fetch('http://localhost:5000/api/student/contests', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });

        if (!response.ok) throw new Error('Failed to fetch contests.');
        const data = await response.json();
        setContests(data);
      } catch (err) {
        console.error("Error fetching contests:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading contests...</div>;
  if (error) return <div style={{ padding: '20px', color: '#dc3545' }}>Error: {error}</div>;

  return (
    <div style={{ marginTop: '30px', padding: '0 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '25px', color: '#333' }}>Contest Lobby</h2>
      {contests.length > 0 ? (
        contests.map(contest => {
          const status = getContestStatus(contest.startTime, contest.endTime);
          const startDate = parseFirestoreDate(contest.startTime);
          const endDate = parseFirestoreDate(contest.endTime);
          const isActive = status.text === 'Active';

          return (
            <div key={contest.id || contest.title} style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease',
              cursor: 'default'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#222' }}>{contest.title}</h3>
                <span style={{ color: status.color, fontWeight: '600', fontSize: '1rem' }}>{status.text}</span>
              </div>
              <p style={{ marginTop: '10px', marginBottom: '15px', color: '#444', lineHeight: '1.5' }}>{contest.description}</p>
              <div style={{ fontSize: '0.95em', color: '#555' }}>
                <p>Starts: {startDate ? startDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Invalid Date'}</p>
                <p>Ends: {endDate ? endDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Invalid Date'}</p>
              </div>
                  {status.text === 'Upcoming' && startDate && (
                    <div style={{marginTop: '10px'}}>
                      <CountdownTimer targetDate={startDate} prefix={"Starts in: "} />
                    </div>
                  )}
              <div style={{ marginTop: '15px' }}>
                <button
                  disabled={!isActive}
                  onClick={() => onEnterContest(contest.id)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: isActive ? '#28a745' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isActive ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    transition: 'background-color 0.3s ease',
                    marginRight: '10px' // Added margin
                  }}
                >
                  Enter Contest
                </button>
                {/* ADDITION: The new "View Leaderboard" button */}
                <button
                  onClick={() => onLeaderboardClick(contest.id)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  View Leaderboard
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ color: '#666' }}>No upcoming contests at the moment. Check back later!</p>
      )}
    </div>
  );
}

export default ContestLobby;
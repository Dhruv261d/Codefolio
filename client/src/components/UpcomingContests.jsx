// client/src/components/UpcomingContests.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';
import { getContestStatus, parseFirestoreDate } from '../utils/contestUtils.js';
import CountdownTimer from './CountdownTimer.jsx';
import '../css/ContestWidgets.css';

function UpcomingContests({ onLeaderboardClick }) {
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
        const upcomingContests = data.filter(contest => getContestStatus(contest.startTime, contest.endTime).text === 'Upcoming');
        setContests(upcomingContests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <>
      {contests.length > 0 ? contests.map(contest => {
        const startDate = parseFirestoreDate(contest.startTime);
        const endDate = parseFirestoreDate(contest.endTime);

        return (
          <div key={contest.id} className="contest-item-card">
            <div className="card-header">
              <h3 className="card-title">{contest.title}</h3>
              <span className="card-status upcoming">Upcoming</span>
            </div>
            <p className="card-description">{contest.description}</p>
            <div className="card-time">
              <p>Starts: {startDate?.toLocaleString()}</p>
              <p>Ends: {endDate?.toLocaleString()}</p>
            </div>
            {startDate && <CountdownTimer targetDate={startDate} prefix="Starts in: " />}
            <div className="card-buttons" style={{ marginTop: '15px' }}>
              <button disabled className="card-button primary">Enter Contest</button>
              <button onClick={() => onLeaderboardClick(contest.id)} className="card-button secondary">View Leaderboard</button>
            </div>
          </div>
        );
      }) : (
        <p style={{ color: '#666' }}>No upcoming contests at the moment.</p>
      )}
    </>
  );
}

export default UpcomingContests;

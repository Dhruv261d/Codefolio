// client/src/components/StudentProfile.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import PersonalContestHistory from './PersonalContestHistory.jsx';
import MarkedQuestions from './MarkedQuestions.jsx';

import 'react-calendar-heatmap/dist/styles.css';

// CORRECTED: Using your proven date parsing logic
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

function StudentProfile({ onSolveClick, onPracticeClick }) {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ratingHistory, setRatingHistory] = useState([]);

    useEffect(() => {
    const fetchProfileData = async () => {
        if (!auth.currentUser) {
            setError("You must be logged in to view your profile.");
            setLoading(false);
            return;
        }
        try {
            const idToken = await auth.currentUser.getIdToken();
            
            // Fetch main profile stats
            const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
                headers: { 'Authorization': `Bearer ${idToken}` }
            });
            if (!profileResponse.ok) throw new Error('Failed to fetch profile data.');
            const profileData = await profileResponse.json();
            setProfileData(profileData);

            // Fetch rating history
            const historyResponse = await fetch('http://localhost:5000/api/users/rating-history', {
                headers: { 'Authorization': `Bearer ${idToken}` }
            });
            if (!historyResponse.ok) throw new Error('Failed to fetch rating history.');
            const historyData = await historyResponse.json();
            setRatingHistory(historyData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchProfileData();
  }, []);

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
    if (!profileData) return <div>No profile data found.</div>;

    const difficultyData = [
        { name: 'Easy', value: profileData.solvedByDifficulty.Easy },
        { name: 'Medium', value: profileData.solvedByDifficulty.Medium },
        { name: 'Hard', value: profileData.solvedByDifficulty.Hard },
    ];

    const COLORS = ['#28a745', '#ffc107', '#dc3545'];

    const styles = {
        wrapper: {
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 30px',
            boxSizing: 'border-box',
            fontFamily: 'Segoe UI, sans-serif'
        },
        statsCard: {
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        },
        statsLabel: {
            margin: 0,
            color: '#6c757d',
            fontSize: '1rem'
        },
        statsValue: {
            fontSize: '2.2rem',
            margin: '10px 0 0 0',
            fontWeight: '600',
            color: '#343a40'
        },
        sectionTitle: {
            fontSize: '1.5rem',
            color: '#343a40',
            marginBottom: '20px'
        },
        chartContainer: {
            width: '100%',
            height: 300,
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            boxSizing: 'border-box'
        }
    };
    
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    return (
        <div style={styles.wrapper}>
            <style>{`
                .react-calendar-heatmap .color-github-0 { fill: #ebedf0; }
                .react-calendar-heatmap .color-github-1 { fill: #9be9a8; }
                .react-calendar-heatmap .color-github-2 { fill: #40c463; }
                .react-calendar-heatmap .color-github-3 { fill: #30a14e; }
                .react-calendar-heatmap .color-github-4 { fill: #216e39; }
            `}</style>

            <h2 style={styles.sectionTitle}>My Profile</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                <div style={styles.statsCard}>
                    <h3 style={styles.statsLabel}>Total Submissions</h3>
                    <p style={styles.statsValue}>{profileData.totalSubmissions}</p>
                </div>
                <div style={styles.statsCard}>
                    <h3 style={styles.statsLabel}>Problems Solved</h3>
                    <p style={styles.statsValue}>{profileData.uniqueProblemsSolved}</p>
                </div>
                <div style={styles.statsCard}>
                    <h3 style={styles.statsLabel}>Submission Accuracy</h3>
                    <p style={styles.statsValue}>{profileData.submissionAccuracy}%</p>
                </div>
            </div>

            <h3 style={styles.sectionTitle}>Submission Activity (Past Year)</h3>
            <div style={{...styles.chartContainer, height: 'auto'}}>
                <CalendarHeatmap
                    startDate={oneYearAgo}
                    endDate={today}
                    values={profileData.activityData}
                    classForValue={(value) => {
                        if (!value || value.count === 0) {
                            return 'color-github-0';
                        }
                        return `color-github-${Math.min(4, value.count)}`;
                    }}
                    tooltipDataAttrs={value => {
                        // This now correctly handles null values from the heatmap library
                        if (!value || !value.date) {
                            return {
                            'data-tooltip-id': 'heatmap-tooltip',
                            'data-tooltip-content': `${new Date(value.date).toDateString()}: ${value.count || 0} submissions`,
                          };
                        }
                        return {
                            'data-tooltip-id': 'heatmap-tooltip',
                            'data-tooltip-content': `${new Date(value.date).toDateString()}: ${value.count || 0} submissions`,
                        };
                    }}
                />
                <ReactTooltip id="heatmap-tooltip" />
            </div>

            <h3 style={{...styles.sectionTitle, marginTop: '40px'}}>Solved by Difficulty</h3>
            <div style={styles.chartContainer}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={difficultyData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {difficultyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <RechartsTooltip  />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
             <h3 style={{...styles.sectionTitle, marginTop: '40px'}}>Personal Contest History</h3>
            <div style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <PersonalContestHistory onPracticeClick={onPracticeClick} />
            </div>   
            <h3 style={{...styles.sectionTitle, marginTop: '40px'}}>Rating History</h3>
            <div style={styles.chartContainer}>
                <ResponsiveContainer>
                    <LineChart
                        data={ratingHistory}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin - 50', 'dataMax + 50']} />
                        <RechartsTooltip  />
                        <Legend />
                        <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <h3 style={{...styles.sectionTitle, marginTop: '40px'}}>Marked Questions</h3>
            <div style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <MarkedQuestions onSolveClick={onSolveClick} />
            </div> 
        </div>
    );
}

export default StudentProfile;
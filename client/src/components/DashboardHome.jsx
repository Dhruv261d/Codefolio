// client/src/components/DashboardHome.jsx
import React from 'react';
import ContestLobby from './ContestLobby.jsx';
import ContestHistory from './ContestHistory.jsx';
import UpcomingContests from './UpcomingContests.jsx'; // Import the new component
import '../css/DashboardHome.css';

function DashboardHome({ user, onEnterContest, onLeaderboardClick, onPracticeClick }) {
    return (
        <div>
            {/* Welcome header remains the same */}
            <div className="welcome-header">
                 {/* ... */}
            </div>
            
            <div className="dashboard-home-grid">
                {/* Section 1: Active Contests */}
                <div className="widget-card scrollable">
                    <div className="widget-header">
                        <h2 className="widget-title">Active Contests</h2>
                    </div>
                    <ContestLobby onEnterContest={onEnterContest} onLeaderboardClick={onLeaderboardClick} isEmbedded={true} />
                </div>

                {/* Section 2: Upcoming Contests (NEW) */}
                <div className="widget-card scrollable">
                    <div className="widget-header">
                        <h2 className="widget-title">Upcoming Contests</h2>
                    </div>
                    <UpcomingContests />
                </div>

                {/* Section 3: Contest History */}
                <div className="widget-card scrollable">
                    <div className="widget-header">
                        <h2 className="widget-title">Contest History</h2>
                    </div>
                    <ContestHistory onPracticeClick={onPracticeClick} onLeaderboardClick={onLeaderboardClick} isEmbedded={true} />
                </div>
            </div>
        </div>
    );
}

export default DashboardHome;
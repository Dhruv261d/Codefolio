// client/src/components/StudentDashboard.jsx
import React, { useState } from 'react';
import DashboardHome from './DashboardHome.jsx';
import ContestLobby from './ContestLobby.jsx';
import ContestPage from './ContestPage.jsx';
import ProblemSolvingPage from './ProblemSolvingPage.jsx';
import Leaderboard from './Leaderboard.jsx';
import ContestHistory from './ContestHistory.jsx';
import PracticePage from './PracticePage.jsx';
import StudentProfile from './StudentProfile.jsx';
import MainLeaderboard from './MainLeaderboard.jsx';
import ContestHeader from './ContestHeader.jsx';
import CalendarPage from './CalendarPage.jsx';
import LiveSessionsStudent from './LiveSessionsStudent.jsx';
import '../css/StudentDashboard.css';

function StudentDashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState('home');
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [previousView, setPreviousView] = useState('home');

  const handleEnterContest = (contestId) => {
    setSelectedContestId(contestId);
    setActiveView('contest');
    setIsPracticing(false);
  };

  const handleSolveClick = (problemId, isPractice = false) => {
    setPreviousView(activeView);
    setSelectedProblemId(problemId);
    setIsPracticing(isPractice);
    setActiveView('solve');
  };

  const handleLeaderboardClick = (contestId) => {
    setSelectedContestId(contestId);
    setActiveView('leaderboard');
  };

  const handleBackToLobby = () => {
    setSelectedContestId(null);
    setSelectedProblemId(null);
    setActiveView('home');
  };

  const handleBackToProblems = () => {
    setSelectedProblemId(null);
    setActiveView(previousView);
  };

  const handlePracticeClick = (contestId) => {
    setSelectedContestId(contestId);
    setActiveView('practice');
    setIsPracticing(true);
  };

  const navButton = (viewName, displayName) => (
    <button
      onClick={() => setActiveView(viewName)}
      className={`nav-button ${activeView === viewName ? 'active' : ''}`}
    >
      {displayName}
    </button>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <DashboardHome 
                  user={user} 
                  onEnterContest={handleEnterContest} 
                  onLeaderboardClick={handleLeaderboardClick} 
                  onPracticeClick={handlePracticeClick} 
               />;
      case 'lobby':
        return <ContestLobby onEnterContest={handleEnterContest} onLeaderboardClick={handleLeaderboardClick} />;
      case 'contest':
        return <ContestPage contestId={selectedContestId} onBack={handleBackToLobby} onSolveClick={handleSolveClick} />;
      case 'solve':
        return <ProblemSolvingPage problemId={selectedProblemId} onBack={handleBackToProblems} isPracticeMode={isPracticing} />;
      case 'leaderboard':
        return <Leaderboard contestId={selectedContestId} onBack={() => setActiveView('home')} />;
      case 'history':
        return <ContestHistory onPracticeClick={handlePracticeClick} onLeaderboardClick={handleLeaderboardClick} />;
      case 'practice':
        return <PracticePage contestId={selectedContestId} onBack={() => setActiveView('home')} onSolveClick={handleSolveClick} />;
      case 'profile':
        return <StudentProfile onSolveClick={(problemId) => handleSolveClick(problemId, true)} onPracticeClick={handlePracticeClick} />;
      case 'main-leaderboard':
        return <MainLeaderboard />;
      case 'calendar':
        return <CalendarPage />;
      case 'sessions':
        return <LiveSessionsStudent />;
      default:
        return <DashboardHome user={user} onEnterContest={handleEnterContest} onLeaderboardClick={handleLeaderboardClick} onPracticeClick={handlePracticeClick} />;
    }
  };

  return (
    <div className="student-dashboard-container">
      <header className="dashboard-header">
        <h1 className="header-logo">Codefolio</h1>
        
        <nav className="header-nav">
          {navButton('home', 'Home')}
          {/* {navButton('lobby', 'All Contests')}
          {navButton('history', 'Contest History')} */}
          {navButton('main-leaderboard', 'Leaderboard')}
          {navButton('calendar', 'Calendar')}
          {navButton('sessions', 'Live Sessions')}
          {navButton('profile', 'Profile')}
        </nav>
        
        <button onClick={onLogout} className="header-logout-button">
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        {(activeView === 'contest' || activeView === 'solve') && !isPracticing && (
          <ContestHeader contestId={selectedContestId} />
        )}
        {renderContent()}
      </main>
    </div>
  );
}

export default StudentDashboard;
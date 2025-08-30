// client/src/components/StudentDashboard.jsx
import React, { useState } from 'react';
import ContestLobby from './ContestLobby.jsx';
import ContestPage from './ContestPage.jsx';
import ProblemSolvingPage from './ProblemSolvingPage.jsx';
import Leaderboard from './Leaderboard.jsx'; 
import ContestHistory from './ContestHistory.jsx';
import PracticePage from './PracticePage.jsx';
import StudentProfile from './StudentProfile.jsx';
import MainLeaderboard from './MainLeaderboard.jsx';

function StudentDashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState('lobby');
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [previousView, setPreviousView] = useState('lobby');

  const handleEnterContest = (contestId) => {
    setSelectedContestId(contestId);
    setActiveView('contest');
    setIsPracticing(false);
  };

  const handleSolveClick = (problemId, isPractice = false) => {
    setPreviousView(activeView); // Remember the current page
    setSelectedProblemId(problemId);
    setIsPracticing(isPractice); // Set practice mode based on where the click came from
    setActiveView('solve');
  };

  const handleLeaderboardClick = (contestId) => {
    setSelectedContestId(contestId);
    setActiveView('leaderboard');
  };

  const handleBackToLobby = () => {
    setSelectedContestId(null);
    setSelectedProblemId(null);
    setActiveView('lobby');
  };

  const handleBackToProblems = () => {
    setSelectedProblemId(null);
    setActiveView(previousView); // Go back to the page we remembered
  };

  const handlePracticeClick = (contestId) => {
    setSelectedContestId(contestId);
    setActiveView('practice');
    setIsPracticing(true);
  };

  if (!user) {
    return (
      <div style={{
        padding: '40px',
        fontFamily: 'Segoe UI, sans-serif',
        color: '#dc3545',
        fontSize: '1.1rem',
        textAlign: 'center'
      }}>
        Error: No user data found. Please log in again.
      </div>
    );
  }

  const renderContent = () => {
    switch(activeView) {
      case 'contest':
        return <ContestPage 
                  contestId={selectedContestId} 
                  onBack={handleBackToLobby} 
                  onSolveClick={handleSolveClick} 
               />;
      case 'solve':
        return <ProblemSolvingPage 
                  problemId={selectedProblemId} 
                  onBack={handleBackToProblems} 
                  isPracticeMode={isPracticing} 
               />;
      case 'leaderboard':
        return <Leaderboard 
                  contestId={selectedContestId} 
                  onBack={handleBackToLobby} 
               />;
      case 'history':
        return <ContestHistory 
                  onPracticeClick={handlePracticeClick} // CHANGE THIS LINE
                  onLeaderboardClick={handleLeaderboardClick}
               />;
      case 'practice': // ADD THIS CASE
              return <PracticePage 
                        contestId={selectedContestId} 
                        onBack={() => setActiveView('history')} 
                        onSolveClick={handleSolveClick} 
                     />;
      case 'profile':
        return <StudentProfile 
                   onSolveClick={(problemId) => handleSolveClick(problemId, true)} 
                   onPracticeClick={handlePracticeClick} // ADD THIS LINE
               />;
       case 'main-leaderboard': 
              return <MainLeaderboard />;
      case 'lobby':
      default:
        return <ContestLobby 
                  onEnterContest={handleEnterContest} 
                  onLeaderboardClick={handleLeaderboardClick} 
               />;
    }
  };

  return (
    <div style={{ width: '100vw', overflowX: 'hidden' }}>
      {/* Full-width header */}
      <header style={{
        width: '100%',
        padding: '20px 30px',
        borderBottom: '2px solid #dee2e6',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '2.2rem',
          color: '#343a40',
          letterSpacing: '0.5px'
        }}>
          Codefolio
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginLeft: 'auto'
        }}>
          <span style={{
            fontSize: '1rem',
            color: '#495057'
          }}>
            Welcome, <strong>{user.name || user.email}</strong>
          </span>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 18px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.3s ease'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Full-width nav */}
      <nav style={{
        width: '100%',
        padding: '0 30px',
        borderBottom: '1px solid #dee2e6',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box'
      }}>
        <button 
          onClick={() => setActiveView('lobby')} 
          style={{
            padding: '10px 15px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeView === 'lobby' ? 'bold' : 'normal',
            color: activeView === 'lobby' ? '#007bff' : '#495057',
            borderBottom: activeView === 'lobby' ? '3px solid #007bff' : '3px solid transparent',
            marginRight: '20px'
          }}
        >
          Contest Lobby
        </button>
        <button 
          onClick={() => setActiveView('history')} 
          style={{
            padding: '10px 15px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeView === 'history' ? 'bold' : 'normal',
            color: activeView === 'history' ? '#007bff' : '#495057',
            borderBottom: activeView === 'history' ? '3px solid #007bff' : '3px solid transparent',
            marginRight: '20px'
          }}
        >
          Contest History
        </button>
        <button 
          onClick={() => setActiveView('main-leaderboard')} 
          style={{
            padding: '10px 15px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeView === 'main-leaderboard' ? 'bold' : 'normal',
            color: activeView === 'main-leaderboard' ? '#007bff' : '#495057',
            borderBottom: activeView === 'main-leaderboard' ? '3px solid #007bff' : '3px solid transparent',
            marginRight: '20px'
          }}
        >
          Leaderboard
        </button>
        <button 
          onClick={() => setActiveView('profile')} 
          style={{
            padding: '10px 15px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeView === 'profile' ? 'bold' : 'normal',
            color: activeView === 'profile' ? '#007bff' : '#495057',
            borderBottom: activeView === 'profile' ? '3px solid #007bff' : '3px solid transparent'
          }}
        >
          Profile
        </button>
      </nav>

      {/* Centered main content */}
      <main style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 30px',
        boxSizing: 'border-box'
      }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default StudentDashboard;

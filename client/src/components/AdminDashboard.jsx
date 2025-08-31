// client/src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import AddStudentForm from './AddStudentForm.jsx';
import CreateContestForm from './CreateContestForm.jsx';
import ContestList from './ContestList.jsx';
import AddProblemForm from './AddProblemForm.jsx';
import LiveSessionsAdmin from './LiveSessionsAdmin.jsx';

function AdminDashboard({ admin, onLogout }) {
  const [activeView, setActiveView] = useState('students');
  const [contestView, setContestView] = useState('list');
  const [selectedContestId, setSelectedContestId] = useState(null);

  const handleAddProblemClick = (contestId) => {
    setSelectedContestId(contestId);
    setContestView('addProblem');
  };

  const renderContestView = () => {
    switch (contestView) {
      case 'create':
        return <CreateContestForm onContestCreated={() => setContestView('list')} />;
      case 'addProblem':
        return <AddProblemForm contestId={selectedContestId} onProblemAdded={() => setContestView('list')} />;
      case 'list':
      default:
        return <ContestList onAddProblemClick={handleAddProblemClick} />;
    }
  };

  return (
    <>
      <style>{`
        .admin-dashboard {
          width: 100vw;
          overflow-x: hidden;
          background-color: #f9fbfc;
          font-family: 'Segoe UI', sans-serif;
          color: #343a40;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #dee2e6;
          padding: 20px 30px;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .logout-button {
          margin-left: 15px;
          padding: 8px 16px;
          background-color: #dc3545;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }

        .logout-button:hover {
          background-color: #c82333;
        }

        .admin-nav {
          display: flex;
          gap: 10px;
          padding: 20px 30px;
          border-bottom: 1px solid #dee2e6;
          background-color: #ffffff;
        }

        .nav-button {
          padding: 10px 15px;
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          cursor: pointer;
          font-weight: 500;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .nav-button.active {
          background-color: #007bff;
          color: #fff;
          border-color: #007bff;
        }

        .nav-button:hover {
          background-color: #e2e6ea;
        }

        .admin-main {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px;
          box-sizing: border-box;
        }

        .toggle-button {
          margin-bottom: 20px;
          padding: 10px 15px;
          background-color: #28a745;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .toggle-button:hover {
          background-color: #218838;
        }
      `}</style>

      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>Codefolio Admin Dashboard</h1>
          <div>
            <span>Welcome, {admin.email}</span>
            <button onClick={onLogout} className="logout-button">Logout</button>
          </div>
        </header>

        <nav className="admin-nav">
          <button
            onClick={() => setActiveView('students')}
            className={`nav-button ${activeView === 'students' ? 'active' : ''}`}
          >
            Manage Students
          </button>
          <button
            onClick={() => setActiveView('contests')}
            className={`nav-button ${activeView === 'contests' ? 'active' : ''}`}
          >
            Manage Contests
          </button>
          <button
          onClick={() => setActiveView('sessions')}
          className={`nav-button ${activeView === 'sessions' ? 'active' : ''}`}
        >
          Live Sessions
        </button>
        </nav>

        <main className="admin-main">
          {activeView === 'students' && <AddStudentForm />}

          {activeView === 'contests' && (
            <div>
              <button
                onClick={() => setContestView(contestView === 'create' ? 'list' : 'create')}
                className="toggle-button"
              >
                {contestView === 'create' ? 'Back to Contest List' : 'Create New Contest'}
              </button>
              {renderContestView()}
            </div>
          )}
          {activeView === 'sessions' && <LiveSessionsAdmin />}

        </main>
      </div>
    </>
  );
}

export default AdminDashboard;

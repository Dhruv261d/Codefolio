// client/src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import AddStudentForm from './AddStudentForm.jsx';
import CreateContestForm from './CreateContestForm.jsx';
import ContestList from './ContestList.jsx';
import AddProblemForm from './AddProblemForm.jsx';
import LiveSessionsAdmin from './LiveSessionsAdmin.jsx';
import '../css/AdminDashboard.css';

const AnalyticsPage = () => {
    return (
        <div className="admin-form">
            <h2>Platform Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ backgroundColor: '#0b192f', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    <h3 style={{ color: '#8892b0', margin: '0 0 10px 0' }}>Total Students</h3>
                    <p style={{ color: '#64ffda', fontSize: '2rem', margin: 0, fontWeight: '700' }}>[Data]</p>
                </div>
                <div style={{ backgroundColor: '#0b192f', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    <h3 style={{ color: '#8892b0', margin: '0 0 10px 0' }}>Contests Hosted</h3>
                    <p style={{ color: '#64ffda', fontSize: '2rem', margin: 0, fontWeight: '700' }}>[Data]</p>
                </div>
                <div style={{ backgroundColor: '#0b192f', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    <h3 style={{ color: '#8892b0', margin: '0 0 10px 0' }}>Total Submissions</h3>
                    <p style={{ color: '#64ffda', fontSize: '2rem', margin: 0, fontWeight: '700' }}>[Data]</p>
                </div>
            </div>
            <p style={{ color: '#8892b0', marginTop: '30px', textAlign: 'center' }}>
                Full analytics charts and data visualizations will be displayed here.
            </p>
        </div>
    );
};

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
                return <CreateContestForm onBack={() => setContestView('list')} />;
            case 'addProblem':
                return <AddProblemForm contestId={selectedContestId} onProblemAdded={() => setContestView('list')} />;
            case 'list':
            default:
                return (
                    <ContestList
                        onAddProblemClick={handleAddProblemClick}
                        setContestView={setContestView} // ✅ passed down here
                    />
                );
        }
    };

    const navButton = (viewName, displayName) => (
        <button
            onClick={() => setActiveView(viewName)}
            className={`admin-button ${activeView === viewName ? 'active' : ''}`}
        >
            {displayName}
        </button>
    );

    return (
        <div className="admin-dashboard-container">
            <header className="admin-header">
                <h1>Codefolio Admin</h1>
                <nav className="admin-header-nav">
                    {navButton('students', 'Manage Students')}
                    <button
                        onClick={() => {
                            setActiveView('contests');
                            setContestView('list');
                        }}
                        className={`admin-button ${activeView === 'contests' ? 'active' : ''}`}
                    >
                        Manage Contests
                    </button>
                    {navButton('sessions', 'Live Sessions')}
                    {/* {navButton('analytics', 'Analytics')} */}
                </nav>
                <div>
                    <button onClick={onLogout} className="admin-logout-button">Logout</button>
                </div>
            </header>

            <main className="admin-main">
                {activeView === 'students' && <AddStudentForm />}
                {activeView === 'contests' && renderContestView()}
                {activeView === 'sessions' && <LiveSessionsAdmin />}
                {/* {activeView === 'analytics' && <AnalyticsPage />} */}
            </main>
        </div>
    );
}

export default AdminDashboard;

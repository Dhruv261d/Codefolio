// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import LoginForm from './components/LoginForm.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';

function App() {
  const [user, setUser] = useState(null); // Will hold the full user object with role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, now get their role from our backend
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${idToken}` }
          });
          if (!response.ok) { // If user exists in Auth but not Firestore
            await signOut(auth); // Log them out
            setUser(null);
          } else {
            const data = await response.json();
            setUser(data.user); // Set the full user profile with role
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          await signOut(auth);
          setUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  // Render the correct dashboard based on the user's role
  const renderDashboard = () => {
    if (user?.role === 'admin') {
      return <AdminDashboard admin={user} onLogout={handleLogout} />;
    }
    if (user?.role === 'student') {
      return <StudentDashboard user={user} onLogout={handleLogout} />;
    }
    // If no user or no role, show the login form
    return <LoginForm />;
  };

  return (
  <div style={{
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    boxSizing: 'border-box',
    fontFamily: 'Segoe UI, sans-serif'
  }}>
    {renderDashboard()}
  </div>
);

}

export default App;

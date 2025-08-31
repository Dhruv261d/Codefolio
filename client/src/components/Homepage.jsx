// client/src/components/Homepage.jsx
import React from 'react';

// The Homepage component receives a function to open the login modal
function Homepage({ onLoginClick }) {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            padding: '20px'
        },
        title: {
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: '#343a40',
            marginBottom: '10px'
        },
        tagline: {
            fontSize: '1.5rem',
            color: '#6c757d',
            marginBottom: '30px'
        },
        loginButton: {
            padding: '15px 30px',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to Codefolio</h1>
            <p style={styles.tagline}>The Competitive Programming Platform of [Your Institution's Name]</p>
            <button 
                onClick={onLoginClick} 
                style={styles.loginButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
                Login to Continue
            </button>
        </div>
    );
}

export default Homepage;
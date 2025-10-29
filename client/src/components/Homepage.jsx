// client/src/components/Homepage.jsx
import React from 'react';
import Slider from './Slider.jsx';
import LoginForm from './LoginForm.jsx';
import '../css/Homepage.css';

// The Homepage now renders the two-part layout and passes the onLoginSuccess prop down
function Homepage({ onLoginSuccess }) {
    return (
        <div className="homepage-split-container">
            <div className="homepage-left">
                <Slider />
            </div>
            <div className="homepage-right">
                <LoginForm onLoginSuccess={onLoginSuccess} />
            </div>
        </div>
    );
}

export default Homepage;
// client/src/components/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';

function CountdownTimer({ targetDate, prefix }) {
    const calculateTimeLeft = () => {
        const difference = new Date(targetDate) - new Date();
        if (difference <= 0) {
            return null;
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        // Update the timer every second
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clear the interval when the component is unmounted
        return () => clearTimeout(timer);
    });

    if (!timeLeft) {
        return <span style={{ fontWeight: 'bold', color: '#dc3545' }}>{prefix}Time's up!</span>;
    }

    // Format the time into a clean string like "01 days 10 hours 30 mins 05 secs"
    const timerString = Object.entries(timeLeft)
        .filter(([unit, value]) => value > 0 || unit === 'seconds')
        .map(([unit, value]) => `${String(value).padStart(2, '0')} ${unit}`)
        .join(' ');
        
    return (
        <div style={{ fontWeight: 'bold', color: '#dc3545' }}>
            <span>{prefix}</span>
            <span>{timerString}</span>
        </div>
    );
}

export default CountdownTimer;
// client/src/components/SliderCard.jsx
import React from 'react';
import '../css/Slider.css';

// This is a simple "presentational" component for a single slide.
function SliderCard({ image, title, subtitle, description }) {
    return (
        <div className="slider-card">
            <img src={image} alt={title} className="slider-image" />
            <h3 className="slider-subtitle">{subtitle}</h3>
            <h2 className="slider-title">{title}</h2>
            <p className="slider-description">{description}</p>
        </div>
    );
}

export default SliderCard;
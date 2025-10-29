// client/src/components/Slider.jsx
import React, { useState, useEffect } from "react";
import SliderCard from "./SliderCard.jsx";
import '../css/Slider.css';

// Card data with updated, more engaging descriptions
const cards = [
    {
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&q=80",
        title: "DSA Contests",
        subtitle: "Master Algorithms",
        description: "Sharpen your problem-solving skills with carefully curated challenges. From basic data structures to advanced algorithms, we have contests for every skill level."
    },
    {
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80",
        title: "Live Leaderboards",
        subtitle: "Track Your Progress",
        description: "Compete in real-time and see how you rank against peers. Track your improvement over time and celebrate your achievements on interactive leaderboards."
    },
    {
        image: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=500&q=80",
        title: "Practice Mode",
        subtitle: "Learn at Your Pace",
        description: "Tackle problems from past contests without the pressure of a timer. It's the perfect way to learn new concepts and prepare for the next challenge."
    },
    {
        image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=500&q=80",
        title: "Mentor Support",
        subtitle: "Get Instant Help",
        description: "Connect with experienced mentors and peers in live sessions. Never get stuck on a problem for too long with our active community and live coding support."
    }
];

function Slider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // This useEffect hook handles the automatic sliding every 3.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === cards.length - 1 ? 0 : prevIndex + 1
            );
        }, 3500); // Changed to 3.5 seconds for a better viewing experience

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slider-container">
            <SliderCard
                key={currentIndex} // Adding a key ensures React re-renders the component on change
                image={cards[currentIndex].image}
                title={cards[currentIndex].title}
                subtitle={cards[currentIndex].subtitle}
                description={cards[currentIndex].description}
            />
        </div>
    );
}

export default Slider;
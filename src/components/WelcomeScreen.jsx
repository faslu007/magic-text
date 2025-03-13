import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function WelcomeScreen({ onCreateNew }) {
    const theme = useSelector((state) => state.editor?.theme) || 'dark';
    const [animatedText, setAnimatedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const fullText = "Your secure space for ideas, notes, and creative writing.";

    // Get time of day for personalized greeting
    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Typing animation effect
    useEffect(() => {
        if (animatedText.length < fullText.length) {
            const timeout = setTimeout(() => {
                setAnimatedText(fullText.slice(0, animatedText.length + 1));
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [animatedText, fullText]);

    // Blinking cursor effect
    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Random floating shapes for background
    const renderFloatingShapes = () => {
        const shapes = [];
        const shapeCount = 8;

        for (let i = 0; i < shapeCount; i++) {
            shapes.push(
                <div
                    key={i}
                    className={`floating-shape shape-${i % 4}`}
                    style={{
                        left: `${Math.random() * 90}%`,
                        top: `${Math.random() * 90}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${15 + Math.random() * 15}s`
                    }}
                />
            );
        }

        return shapes;
    };

    return (
        <div className="welcome-screen">
            <div className="welcome-background">
                {renderFloatingShapes()}
            </div>

            <div className="welcome-content">
                <div className="welcome-header">
                    <div className="welcome-logo">
                        <svg
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="welcome-icon"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <line x1="10" y1="9" x2="8" y2="9"></line>
                        </svg>
                    </div>

                    <h1 className="welcome-title">{getTimeBasedGreeting()}</h1>

                    <div className="welcome-tagline">
                        <p>
                            {animatedText}
                            <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>|</span>
                        </p>
                        <p className="welcome-subtitle">Every thought is protected, every word is yours.</p>
                    </div>
                </div>

                <div className="welcome-features">
                    <div className="welcome-feature">
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="feature-text">
                            <h3>Secure</h3>
                            <p>Screen sharing protection keeps your content private</p>
                        </div>
                    </div>

                    <div className="welcome-feature">
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                        </div>
                        <div className="feature-text">
                            <h3>Simple</h3>
                            <p>Clean interface focused on your writing experience</p>
                        </div>
                    </div>

                    <div className="welcome-feature">
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="feature-text">
                            <h3>Smart</h3>
                            <p>Auto-save, creative titles, and intuitive organization</p>
                        </div>
                    </div>
                </div>

                <div className="welcome-actions">
                    <button
                        className="welcome-button primary-button"
                        onClick={onCreateNew}
                    >
                        <span className="button-icon">+</span>
                        <span>Create New Document</span>
                    </button>
                    {/* <button
                        className="welcome-button secondary-button"
                        onClick={() => window.open('https://github.com/yourusername/secure-text-editor', '_blank')}
                    >
                        <span className="button-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                        </span>
                        <span>Learn More</span>
                    </button> */}
                </div>

                <div className="welcome-footer">
                    <div className="welcome-quote-container">
                        <p className="welcome-quote">
                            "{theme === 'dark' ?
                                'The night is dark and full of terrors, but your ideas are safe here.' :
                                'In the light of day, your creativity finds its way.'}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeScreen; 
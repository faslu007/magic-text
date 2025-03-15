import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';

function WelcomeScreen({ onCreateNew }) {
    const theme = useSelector((state) => state.editor?.theme) || 'dark';
    const [animatedText, setAnimatedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const fullText = "Your secure space for ideas, notes, and creative writing.";

    // Clerk authentication
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const clerk = useClerk();

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

    // Get user display name or email
    const getUserIdentifier = () => {
        if (!isLoaded || !isSignedIn || !user) return null;
        return user.fullName || user.primaryEmailAddress?.emailAddress || 'User';
    };

    // Handle sign in
    const handleSignIn = () => {
        if (isLoaded && !isSignedIn) {
            clerk.openSignIn();
        }
    };

    // Handle sign up
    const handleSignUp = () => {
        if (isLoaded && !isSignedIn) {
            clerk.openSignUp();
        }
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
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="feature-text">
                            <h3>Encrypted</h3>
                            <p>End-to-end encryption protects your sensitive information</p>
                        </div>
                    </div>

                    <div className="welcome-feature">
                        <div className="feature-icon-wrapper">
                            <div className="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                    <polyline points="16 6 12 2 8 6"></polyline>
                                    <line x1="12" y1="2" x2="12" y2="15"></line>
                                </svg>
                            </div>
                        </div>
                        <div className="feature-text">
                            <h3>Controlled Sharing</h3>
                            <p>IP-based file sharing with rate-limited viewership</p>
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
                </div>

                {/* Authentication UI */}
                <div className="welcome-auth-container">
                    {isLoaded && (
                        isSignedIn ? (
                            <div className="welcome-user-info">
                                <div className="user-avatar">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <span>Logged in as <strong>{getUserIdentifier()}</strong></span>
                            </div>
                        ) : (
                            <div className="welcome-auth-buttons">
                                <button
                                    className="auth-button sign-in-button"
                                    onClick={handleSignIn}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10 17 15 12 10 7"></polyline>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                    </svg>
                                    <span>Sign In</span>
                                </button>
                                <button
                                    className="auth-button sign-up-button"
                                    onClick={handleSignUp}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="8.5" cy="7" r="4"></circle>
                                        <line x1="20" y1="8" x2="20" y2="14"></line>
                                        <line x1="23" y1="11" x2="17" y2="11"></line>
                                    </svg>
                                    <span>Sign Up</span>
                                </button>
                            </div>
                        )
                    )}
                </div>

                <div className="welcome-actions">
                    <button
                        className="welcome-button primary-button"
                        onClick={onCreateNew}
                    >
                        <span className="button-icon">+</span>
                        <span>Create New Document</span>
                    </button>
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
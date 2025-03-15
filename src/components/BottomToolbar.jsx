import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/features/editorSlice';
import { useAuth, useClerk } from '@clerk/clerk-react';

function BottomToolbar() {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.editor?.theme) || 'dark';

    // Clerk authentication
    const { isLoaded, isSignedIn } = useAuth();
    const clerk = useClerk();

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    const handleAuth = () => {
        if (!isLoaded) return;

        if (isSignedIn) {
            clerk.openUserProfile();
        } else {
            clerk.openSignIn();
        }
    };

    return (
        <div className="bottom-toolbar">
            <div className="bottom-toolbar-content">
                <button
                    onClick={handleAuth}
                    className="auth-toggle"
                    title={isSignedIn ? "User profile" : "Sign in"}
                >
                    👤
                </button>
                <button
                    onClick={handleToggleTheme}
                    className="theme-toggle"
                    title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </div>
    );
}

export default BottomToolbar; 
import { registerSW } from 'virtual:pwa-register';

// This is the service worker registration function
export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        const updateSW = registerSW({
            onNeedRefresh() {
                // This function is called when new content is available
                if (confirm('New content available. Reload?')) {
                    updateSW(true);
                }
            },
            onOfflineReady() {
                console.log('App ready to work offline');
                // You could show a notification to the user here
            },
        });
    }
}; 
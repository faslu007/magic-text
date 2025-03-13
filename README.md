# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Secure Text Editor

A secure text editor with offline support, built with React and Redux.

## Features

- **Offline Support**: Continue working even without an internet connection
- **Automatic Sync**: Changes are automatically saved and synced when you're back online
- **Screen Sharing Protection**: Content is protected when screen sharing is detected
- **Password Protection**: Add password protection to sensitive documents
- **Dark/Light Theme**: Choose your preferred theme for comfortable editing
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Build for production: `npm run build`

## Offline Usage

This application is a Progressive Web App (PWA), which means:

- It can be installed on your device (desktop or mobile)
- It works offline, allowing you to create and edit documents without an internet connection
- All changes are saved locally and will sync when you're back online
- You'll see an offline indicator when you're working without a connection

## Installation on Mobile

1. Visit the application in your mobile browser
2. Tap the "Add to Home Screen" option in your browser menu
3. The app will be installed and available from your home screen

## Installation on Desktop

1. Visit the application in Chrome, Edge, or other compatible browsers
2. Look for the install icon in the address bar
3. Click "Install" to add the app to your desktop

## Technologies Used

- React
- Redux Toolkit
- Redux Persist (for offline storage)
- Vite
- PWA (Progressive Web App)

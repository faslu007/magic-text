import { useSelector } from 'react-redux'
import './App.css'
import Editor from './components/Editor'
import OfflineIndicator from './components/OfflineIndicator'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

function App() {
	const { theme } = useSelector((state) => state.editor);

	// Import your Publishable Key
	const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

	if (!PUBLISHABLE_KEY) {
		throw new Error("Missing Publishable Key")
	}

	// Create the appearance object based on theme
	const getAppearance = (theme) => {
		if (theme === 'dark') {
			return dark;
		} else {
			return "";
		}
	};

	return (
		<>
			<ClerkProvider
				publishableKey={PUBLISHABLE_KEY}
				afterSignOutUrl="/"
				appearance={getAppearance(theme)}
			>
			<Editor />
			<OfflineIndicator />
			</ClerkProvider>
		</>
	)
}

export default App

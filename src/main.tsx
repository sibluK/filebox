import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const theme = localStorage.getItem('theme');

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl='/'
        appearance={{
          baseTheme: theme === 'dark' ? dark : undefined,
        }}
        >
        <App />
      </ClerkProvider>
  </BrowserRouter>
)

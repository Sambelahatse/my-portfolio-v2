import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import CvPage from './components/CvPage.tsx'

const path = window.location.pathname
const isCvPage = path === '/cv' || path === '/cv/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      {isCvPage ? <CvPage /> : <App />}
    </HelmetProvider>
  </StrictMode>,
)

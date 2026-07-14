import { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import SEO from './components/SEO';
import { IoChatbubble } from 'react-icons/io5';
import PageSkeleton from './components/PageSkeleton';
import backendAssistantHandler from './services/assistantBackendService';
import profileData from '../profile.json';
import { defaultSEO, generatePersonSchema, generateWebsiteSchema } from './services/seoConfig';
import MagicMouse from './components/MagicMouse';

const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const AssistantChat = lazy(() => import('./components/AssistantChat'));

function AppContent() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const onLoad = () => setAppReady(true);
    if (document.readyState === 'complete') {
      const t = setTimeout(() => setAppReady(true), 400);
      return () => clearTimeout(t);
    }
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!appReady) return <PageSkeleton />;

  return (
    <div className="bg-white dark:bg-dark-bg text-neutral-900 dark:text-white font-light antialiased transition-colors duration-300">
      <SEO
        title={defaultSEO.title}
        description={defaultSEO.description}
        keywords={defaultSEO.keywords}
        canonical={defaultSEO.canonical}
        ogImage={defaultSEO.ogImage}
        structuredData={[generatePersonSchema(), generateWebsiteSchema()]}
      />

      <Header />
      <main>
        <Hero />
        <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-50 dark:bg-dark-surface" />}>
          <About />
          <Skills />
          <Projects />
          <Contact />
        </Suspense>
      </main>
      <Footer />

      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg transition-all duration-300 hover:scale-110 z-50 no-cursor"
          aria-label="Retour en haut"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {!showAssistant && (
        <button
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-6 right-16 p-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg transition-all duration-300 hover:scale-110 z-40 no-cursor"
          aria-label="Ouvrir l'assistant IA"
        >
          <IoChatbubble size={16} />
        </button>
      )}

      <Suspense fallback={null}>
        <AssistantChat
          isOpen={showAssistant}
          onClose={() => setShowAssistant(false)}
          title="Assistant IA"
          placeholder="Posez-moi une question..."
          portfolioContext={{
            name: profileData.firstName,
            title: profileData.title,
            bio: profileData.bio,
            email: profileData.email,
            phone: profileData.phone1,
            linkedin: profileData.linkedin,
            github: profileData.github
          }}
          onSendMessage={backendAssistantHandler}
        />
      </Suspense>
      <MagicMouse />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

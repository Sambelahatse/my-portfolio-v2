import React from 'react';
import profile from '../../profile.json';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      {/* Subtle accent circle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] dark:opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 70%)' }}
      />

      <motion.div
        className="relative max-w-3xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="text-sm font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-6">
          <TypeAnimation
            key={language}
            sequence={[t.greeting, 5000, t.greeting, 5000]}
            wrapper="span"
            cursor={false}
            repeat={Infinity}
          />
        </p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-6">
          {profile.fullName}
        </h1>

        <p className="text-lg sm:text-xl font-light text-neutral-500 dark:text-neutral-400 mb-4">
          {t.title}
        </p>

        <p className="max-w-xl mx-auto text-base font-light leading-relaxed text-neutral-500 dark:text-neutral-400 mb-10">
          {t.shortBio}
        </p>

        <div className="flex items-center justify-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            {t.contactMe}
          </a>
          <a
            href="/cv"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-full hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
          >
            {t.viewCV}
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

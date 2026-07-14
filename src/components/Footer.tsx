import React from 'react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import profile from '../../profile.json';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].footer;

  return (
    <footer className="border-t border-neutral-100 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <FiLinkedin className="w-4 h-4" />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <FiGithub className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            &copy; {new Date().getFullYear()} {profile.copyrightName}. {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

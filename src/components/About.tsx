import React from 'react';
import profile from '../../profile.json';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import LazyImage from './LazyImage';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].about;
  const avatarBlue = '/assets/profil-avatar-bg-blue.png';

  const stats = [
    { label: language === 'fr' ? 'Années d\'expérience' : 'Years of experience', value: '3+' },
    { label: language === 'fr' ? 'Projets réalisés' : 'Projects completed', value: '5+' },
  ];

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-3">
            {t.subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-16">
            {t.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t.bio.map((paragraph, i) => (
              <p key={i} className="text-base font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                {paragraph}
              </p>
            ))}

            <div className="flex gap-12 pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-semibold text-neutral-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <div className="absolute inset-0 rounded-3xl bg-neutral-100 dark:bg-dark-surface" />
              <LazyImage
                src={avatarBlue}
                alt={`${profile.fullName} - Profile`}
                className="relative rounded-3xl object-cover w-full h-full"
                skeletonClassName="rounded-3xl w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

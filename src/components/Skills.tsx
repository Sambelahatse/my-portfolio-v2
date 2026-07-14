import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { motion } from 'framer-motion';

const Skills: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].skills;

  const skillGroups = [
    {
      label: 'Front-end',
      skills: [
        { name: t.data.html, level: 95 },
        { name: t.data.css, level: 90 },
        { name: t.data.js, level: 75 },
        { name: t.data.react, level: 60 },
        { name: t.data.ts, level: 60 },
      ],
    },
    {
      label: 'Back-end',
      skills: [
        { name: t.data.node, level: 75 },
        { name: t.data.php, level: 90 },
        { name: t.data.python, level: 60 },
        { name: t.data.sql, level: 85 },
      ],
    },
    {
      label: language === 'fr' ? 'Soft Skills' : 'Soft Skills',
      skills: [
        { name: t.data.communication, level: 95 },
        { name: t.data.teamwork, level: 90 },
        { name: t.data.projectManagement, level: 85 },
        { name: t.data.autonomy, level: 75 },
        { name: t.data.problemSolving, level: 80 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-32 px-6 bg-neutral-50/50 dark:bg-dark-surface/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-3">
            {t.toolsTech}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-16">
            {t.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {skillGroups.map((group, groupIndex) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
            >
              <h3 className="text-sm font-medium tracking-wider uppercase text-neutral-900 dark:text-white mb-6">
                {group.label}
              </h3>
              <div className="space-y-4">
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                        {skill.name}
                      </span>
                      <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-neutral-900 dark:bg-white rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

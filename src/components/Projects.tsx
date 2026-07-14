import React, { useState } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import profile from '../../profile.json';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import ProjectDetailModal from './ProjectDetailModal';
import LazyImage from './LazyImage';
import { motion } from 'framer-motion';

interface Project {
  name: string;
  description: string;
  long_description: string;
  image: string;
  url: string;
  features: string[] | { features: { module: string; features: string[] }[] };
  technologies: string[];
  github_url: string;
  website_url: string;
}

const Projects: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].projects;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-3">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-16">
            {t.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.projects.map((project, index) => {
            const projectText = t.projects[index];
            const hasLiveLink = !!project.url && project.url !== '#';

            return (
              <motion.article
                key={project.name}
                className="group relative bg-white dark:bg-dark-card border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <LazyImage
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    skeletonClassName="h-48 w-full"
                  />
                  {hasLiveLink && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm rounded-full text-neutral-700 dark:text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    {projectText?.title || project.name}
                  </h3>
                  <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                    {projectText?.description || project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={`${project.name}-${tech}`}
                        className="text-xs font-medium px-2.5 py-1 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedProject(project as Project)}
                    className="text-sm font-medium text-neutral-900 dark:text-white hover:underline underline-offset-4"
                  >
                    {t.viewProject}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Projects;

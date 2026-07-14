import React from 'react';
import { FiX, FiExternalLink, FiGithub } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import LazyImage from './LazyImage';
import { motion, AnimatePresence } from 'framer-motion';

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

interface Props {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<Props> = ({ project, isOpen, onClose }) => {
  const { language } = useLanguage();
  const t = translations[language].projects;

  if (!project) return null;

  const projectText = t.projects.find((p) => p.title === project.name);

  const renderFeatures = () => {
    if (Array.isArray(project.features)) {
      return (
        <ul className="space-y-2">
          {project.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-light text-neutral-600 dark:text-neutral-400">
              <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-500 mt-2 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative h-56">
              <LazyImage
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
                skeletonClassName="h-56 w-full"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm rounded-full text-neutral-700 dark:text-neutral-300 hover:scale-110 transition-transform"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(85vh-14rem)]">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3">
                {projectText?.title || project.name}
              </h3>
              <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
                {project.long_description}
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-medium tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-3">
                  {t.features}
                </h4>
                {renderFeatures()}
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-medium tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-3">
                  {t.technologies}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-medium px-2.5 py-1 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {project.website_url && project.website_url !== '#' && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-full px-4 py-2 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
                  >
                    <FiExternalLink className="w-3.5 h-3.5" />
                    {t.visitSite}
                  </a>
                )}
                {project.github_url && project.github_url !== '#' && project.github_url !== 'null' && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-full px-4 py-2 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
                  >
                    <FiGithub className="w-3.5 h-3.5" />
                    {t.githubCode}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;

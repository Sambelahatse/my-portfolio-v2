import { useLanguage } from '../context/LanguageContext';
import { seoConfigs } from '../services/seoConfig';
import type { SEOConfig } from '../services/seoConfig';

type SectionKey = 'home' | 'about' | 'skills' | 'projects' | 'contact';

/**
 * Hook personnalisé pour obtenir la configuration SEO en fonction de la section et de la langue
 * @param section - La section du portfolio (home, about, skills, projects, contact)
 * @returns Configuration SEO pour la section et la langue actuelle
 */
export const useSEO = (section: SectionKey): Partial<SEOConfig> => {
    const { language } = useLanguage();

    // Récupérer la configuration pour la section et la langue
    const config = seoConfigs[section]?.[language] || seoConfigs[section]?.['fr'];

    return config || {};
};

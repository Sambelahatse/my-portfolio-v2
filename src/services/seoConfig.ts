// Configuration SEO centralisée pour le portfolio
import profileData from '../../profile.json';

export interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    author?: string;
    noindex?: boolean;
}

// URL de base du site (à modifier selon votre déploiement)
export const SITE_URL = 'https://ms-team-androy.onrender.com';
export const SITE_NAME = 'Mara Sambelahatse - Portfolio';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// Configuration SEO par défaut
export const defaultSEO: SEOConfig = {
    title: `${profileData.firstName} ${profileData.lastName} | ${profileData.title}`,
    description: Array.isArray(profileData.bio) ? profileData.bio.join(' ') : profileData.bio,
    keywords: [
        'développeur web',
        'react',
        'typescript',
        'vite',
        'portfolio',
        'frontend',
        'full stack',
        'php',
        'symfony',
        'codeigniter',
        'java',
        'automatisation',
        'agent ia',
        'node.js',
        'javascript'
    ],
    canonical: SITE_URL,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    author: `${profileData.firstName} ${profileData.lastName}`,
    noindex: false
};

// Configurations SEO spécifiques par section
export const seoConfigs = {
    home: {
        fr: {
            title: `${profileData.firstName} ${profileData.lastName} | Développeur Web Full Stack`,
            description: `Portfolio professionnel de ${profileData.firstName} ${profileData.lastName}. Développeur web spécialisé en React, Node.js, PHP et automatisation. Découvrez mes projets et compétences.`,
            keywords: [...(defaultSEO.keywords || []), 'accueil', 'portfolio développeur'],
        },
        en: {
            title: `${profileData.firstName} ${profileData.lastName} | Full Stack Web Developer`,
            description: `Professional portfolio of ${profileData.firstName} ${profileData.lastName}. Web developer specialized in React, Node.js, PHP and automation. Discover my projects and skills.`,
            keywords: [...(defaultSEO.keywords || []), 'home', 'developer portfolio'],
        }
    },
    about: {
        fr: {
            title: `À propos | ${profileData.firstName} ${profileData.lastName}`,
            description: `Découvrez mon parcours, mes expériences et ma passion pour le développement web. ${profileData.bio}`,
            keywords: ['à propos', 'parcours', 'expérience', 'développeur'],
        },
        en: {
            title: `About | ${profileData.firstName} ${profileData.lastName}`,
            description: `Discover my background, experiences and passion for web development. ${profileData.bio}`,
            keywords: ['about', 'background', 'experience', 'developer'],
        }
    },
    skills: {
        fr: {
            title: `Compétences | ${profileData.firstName} ${profileData.lastName}`,
            description: `Mes compétences techniques : React, TypeScript, Node.js, PHP, Symfony, bases de données, DevOps et plus encore.`,
            keywords: ['compétences', 'technologies', 'react', 'typescript', 'node.js', 'php'],
        },
        en: {
            title: `Skills | ${profileData.firstName} ${profileData.lastName}`,
            description: `My technical skills: React, TypeScript, Node.js, PHP, Symfony, databases, DevOps and more.`,
            keywords: ['skills', 'technologies', 'react', 'typescript', 'node.js', 'php'],
        }
    },
    projects: {
        fr: {
            title: `Projets | ${profileData.firstName} ${profileData.lastName}`,
            description: `Découvrez mes projets web : applications React, APIs REST, automatisation et solutions innovantes.`,
            keywords: ['projets', 'réalisations', 'applications web', 'portfolio'],
        },
        en: {
            title: `Projects | ${profileData.firstName} ${profileData.lastName}`,
            description: `Discover my web projects: React applications, REST APIs, automation and innovative solutions.`,
            keywords: ['projects', 'achievements', 'web applications', 'portfolio'],
        }
    },
    contact: {
        fr: {
            title: `Contact | ${profileData.firstName} ${profileData.lastName}`,
            description: `Contactez-moi pour discuter de vos projets web. Email: ${profileData.email}`,
            keywords: ['contact', 'email', 'collaboration', 'projet'],
        },
        en: {
            title: `Contact | ${profileData.firstName} ${profileData.lastName}`,
            description: `Contact me to discuss your web projects. Email: ${profileData.email}`,
            keywords: ['contact', 'email', 'collaboration', 'project'],
        }
    }
};

// Génération des données structurées JSON-LD
export const generatePersonSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: `${profileData.firstName} ${profileData.lastName}`,
        jobTitle: profileData.title,
        description: profileData.bio,
        email: profileData.email,
        telephone: profileData.phone1,
        url: SITE_URL,
        sameAs: [
            profileData.linkedin,
            profileData.github,
        ].filter(Boolean),
        address: {
            '@type': 'PostalAddress',
            addressLocality: (profileData as any).addresse || 'Antananarivo, Madagascar',
        },
        knowsAbout: defaultSEO.keywords,
    };
};

export const generateWebsiteSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: defaultSEO.description,
        author: {
            '@type': 'Person',
            name: `${profileData.firstName} ${profileData.lastName}`,
        },
        inLanguage: ['fr', 'en'],
    };
};

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
};

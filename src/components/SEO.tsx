import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../services/seoConfig';
import type { SEOConfig } from '../services/seoConfig';

interface SEOProps extends Partial<SEOConfig> {
    children?: React.ReactNode;
    structuredData?: object | object[];
}

/**
 * Composant SEO réutilisable pour gérer les balises meta de chaque page/section
 * Utilise React Helmet Async pour la gestion dynamique du head
 */
const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords = [],
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    author,
    noindex = false,
    children,
    structuredData,
}) => {
    // Construire le titre complet
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    // URL canonique
    const canonicalUrl = canonical || SITE_URL;

    // Convertir les keywords en string
    const keywordsString = keywords.join(', ');

    return (
        <Helmet>
            {/* Balises meta de base */}
            <title>{fullTitle}</title>
            {description && <meta name="description" content={description} />}
            {keywordsString && <meta name="keywords" content={keywordsString} />}
            {author && <meta name="author" content={author} />}

            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Robots */}
            <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="fr_FR" />
            <meta property="og:locale:alternate" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={ogImage} />

            {/* Données structurées JSON-LD */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
                </script>
            )}

            {/* Contenu additionnel */}
            {children}
        </Helmet>
    );
};

export default SEO;

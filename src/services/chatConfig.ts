/**
 * Configuration et utilitaires pour AssistantChat
 * 
 * Ce fichier contient des helper functions et des configurations
 * prêtes à l'emploi pour les intégrations LLM
 */

import type { PortfolioContext } from '../components/AssistantChat';

/**
 * Génère le prompt système basé sur le contexte du portfolio
 */
export const generateSystemPrompt = (context: PortfolioContext): string => {
  const basePrompt = `Tu es l'assistant IA de ${context.name || 'Mara'}, un ${context.title || 'développeur web'}`;
  
  const bioSection = context.bio && context.bio.length > 0
    ? `\n\nÀ propos de ${context.name}:\n${context.bio.join('\n')}`
    : '';

  const skillsSection = context.skills && context.skills.length > 0
    ? `\n\nCompétences:\n${context.skills.join(', ')}`
    : '';

  const projectsSection = context.projects && context.projects.length > 0
    ? `\n\nProjets notables:\n${context.projects.map((p: any) => `- ${p.name}: ${p.description}`).join('\n')}`
    : '';

  const contactSection = `\n\nMoyens de contact:\n${[
    context.email && `📧 Email: ${context.email}`,
    context.phone && `📱 Téléphone: ${context.phone}`,
    context.linkedin && `🔗 LinkedIn: ${context.linkedin}`,
    context.github && `💻 GitHub: ${context.github}`
  ].filter(Boolean).join('\n')}`;

  const instructions = `\n\nDirectives importantes:
1. Réponds TOUJOURS en français
2. Si la question concerne ${context.name} ou son portfolio, utilise les informations ci-dessus
3. Pour les questions générales hors du portfolio, utilise tes connaissances
4. Sois professionnel, courtois et concis
5. Si tu ne connais pas quelque chose, dis-le honnêtement
6. Ajoute des emojis pertinents pour rendre la conversation engageante
7. Si quelqu'un demande à contacter ${context.name}, fournis les informations appropriées
8. Ne pense jamais que tu es une vraie personne, tu es un assistant IA`;

  return basePrompt + bioSection + skillsSection + projectsSection + contactSection + instructions;
};

/**
 * Vérifie la validité d'une API key
 */
export const validateApiKey = (apiKey: string | undefined, service: string): boolean => {
  if (!apiKey) {
    console.warn(`⚠️ API key manquante pour ${service}`);
    return false;
  }
  
  if (apiKey.length < 10) {
    console.warn(`⚠️ API key invalide pour ${service}`);
    return false;
  }

  return true;
};

/**
 * Crée un handler avec retry logic
 */
export const createRetryableHandler = (
  handler: (message: string, context: PortfolioContext) => Promise<string>,
  maxRetries: number = 3
) => {
  return async (message: string, context: PortfolioContext) => {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await handler(message, context);
      } catch (error) {
        lastError = error as Error;
        console.warn(`❌ Tentative ${i + 1}/${maxRetries} échouée:`, lastError.message);
        
        // Attendre avant de réessayer (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }

    throw new Error(`Impossible de traiter le message après ${maxRetries} tentatives: ${lastError?.message}`);
  };
};

/**
 * Tronque le contexte pour éviter les limites de tokens
 */
export const truncateContext = (
  context: PortfolioContext,
  maxChars: number = 2000
): PortfolioContext => {
  const truncate = (str: string | string[] | undefined, max: number): string | string[] | undefined => {
    if (!str) return str;
    
    if (Array.isArray(str)) {
      return str.map(s => s.substring(0, max));
    }
    
    return str.substring(0, max);
  };

  return {
    ...context,
    bio: truncate(context.bio, maxChars) as string[] | undefined,
    skills: truncate(context.skills, maxChars) as string[] | undefined,
  };
};

/**
 * Détecte le type de question
 */
export const detectQuestionType = (message: string): 'portfolio' | 'technical' | 'general' => {
  const lowerMessage = message.toLowerCase();

  const portfolioKeywords = [
    'mara', 'portfolio', 'projet', 'compétence', 'expérience', 
    'contact', 'email', 'linkedin', 'github', 'téléphone',
    'travail', 'experience', 'skill', 'skillset'
  ];

  const technicalKeywords = [
    'react', 'typescript', 'tailwind', 'node', 'python', 'javascript',
    'html', 'css', 'api', 'database', 'sql', 'mongodb', 'git',
    'development', 'programming', 'code', 'coding', 'developer'
  ];

  const portfolioMatches = portfolioKeywords.filter(k => lowerMessage.includes(k)).length;
  const technicalMatches = technicalKeywords.filter(k => lowerMessage.includes(k)).length;

  if (portfolioMatches > technicalMatches && portfolioMatches > 0) {
    return 'portfolio';
  }

  if (technicalMatches > 0) {
    return 'technical';
  }

  return 'general';
};

/**
 * Logger pour debugging
 */
export const chatLogger = {
  log: (message: string, data?: any) => {
    console.log(`[AssistantChat] ${message}`, data || '');
  },
  
  error: (message: string, error?: any) => {
    console.error(`[AssistantChat] ❌ ${message}`, error || '');
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[AssistantChat] ⚠️ ${message}`, data || '');
  },
  
  debug: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.debug(`[AssistantChat] 🔍 ${message}`, data || '');
    }
  }
};

/**
 * Rate limiter pour les appels API
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  getTimeUntilReset(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = this.requests[0];
    return this.windowMs - (Date.now() - oldestRequest);
  }
}

/**
 * Cache simple pour les réponses
 */
export class ResponseCache {
  private cache: Map<string, { response: string; timestamp: number }> = new Map();
  private ttl: number; // Time to live en ms

  constructor(ttlMinutes: number = 60) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  set(key: string, value: string): void {
    this.cache.set(key, {
      response: value,
      timestamp: Date.now()
    });
  }

  get(key: string): string | null {
    const item = this.cache.get(key);
    
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.response;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

/**
 * Formatteur pour les réponses Markdown
 */
export const formatResponse = (text: string): string => {
  // Limiter la longueur globale pour éviter des réponses trop longues
  const maxLength = 2000;
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }

  // Normaliser les sauts de ligne multiples sans enlever la mise en forme Markdown
  text = text.replace(/\n\n\n+/g, '\n\n');

  return text;
};

/**
 * Gestionnaire d'erreurs pour les APIs LLM
 */
export const handleLLMError = (error: unknown, service: string): string => {
  console.error(`Erreur ${service}:`, error);

  if (error instanceof Error) {
    // Erreurs réseau
    if (error.message.includes('fetch')) {
      return 'Erreur de connexion. Vérifiez votre connexion Internet.';
    }

    // Erreurs d\'authentification
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return 'Erreur d\'authentification. Vérifiez votre clé API.';
    }

    // Erreurs de quota
    if (error.message.includes('429') || error.message.includes('quota')) {
      return 'Quota dépassé. Veuillez réessayer dans quelques instants.';
    }

    // Erreurs de serveur
    if (error.message.includes('500')) {
      return 'Erreur du serveur. Veuillez réessayer.';
    }
  }

  return 'Une erreur s\'est produite. Veuillez réessayer.';
};

/**
 * Exemple d'utilisation:
 * 
 * import { 
 *   generateSystemPrompt, 
 *   RateLimiter, 
 *   ResponseCache,
 *   chatLogger 
 * } from './chatConfig';
 * 
 * const limiter = new RateLimiter(10, 60000); // 10 req/min
 * const cache = new ResponseCache(60); // 1 heure de cache
 * 
 * const handleChat = async (message, context) => {
 *   if (!limiter.canMakeRequest()) {
 *     const timeLeft = limiter.getTimeUntilReset();
 *     throw new Error(`Rate limit exceeded. Retry in ${timeLeft / 1000}s`);
 *   }
 * 
 *   const cacheKey = message.toLowerCase();
 *   const cachedResponse = cache.get(cacheKey);
 * 
 *   if (cachedResponse) {
 *     chatLogger.debug('Cache hit', cacheKey);
 *     return cachedResponse;
 *   }
 * 
 *   const systemPrompt = generateSystemPrompt(context);
 *   const response = await callLLM(message, systemPrompt);
 * 
 *   cache.set(cacheKey, response);
 *   return response;
 * };
 */

export default {
  generateSystemPrompt,
  validateApiKey,
  createRetryableHandler,
  truncateContext,
  detectQuestionType,
  chatLogger,
  RateLimiter,
  ResponseCache,
  formatResponse,
  handleLLMError
};

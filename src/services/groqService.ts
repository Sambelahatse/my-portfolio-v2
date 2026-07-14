/**
 * Service Groq pour AssistantChat
 * 
 * Réplique exacte du fonctionnement Python avec:
 * - Client Groq OpenAI-compatible
 * - Contexte fixe du portfolio de Mara
 * - Historique de conversation persistant
 * - Système d'intelligence intelligent
 */

import type { PortfolioContext } from '../components/AssistantChat';

/**
 * Contexte fixe - Les règles d'intelligence et profil de Mara
 * Ce contexte est envoyé à chaque requête pour guider l'IA
 */
const MARA_CONTEXT = `
====================
RÈGLE D'INTELLIGENCE
====================
Avant de répondre, analyse la question de l'utilisateur.

1) Si la question concerne Mara Sambelahatse, son profil, ses compétences, ses projets,
   son parcours, ses objectifs ou toute information liée à son portfolio :
   → Réponds STRICTEMENT en t'appuyant sur les données du portfolio fournies.
   → N'invente jamais d'information.
   → Si l'information n'existe pas dans le portfolio, dis clairement que l'information
     n'est pas disponible.

2) Si la question est générale et ne concerne pas le portfolio
   (exemples : programmation, intelligence artificielle, technologies, concepts généraux,
   culture numérique, bonnes pratiques, définitions, conseils techniques) :
   → Tu es autorisé à répondre en utilisant ta connaissance générale en tant que modèle
     de langage.
   → Réponds de manière claire, pédagogique et factuelle.

3) Si la question est ambiguë, imprécise ou dépasse clairement tes capacités :
   → Dis que tu n'as pas suffisamment d'informations pour répondre correctement.

====================
IDENTITÉ
====================
Nom : Mara Sambelahatse
Prénom : Mara
Métier : Développeur Web Full Stack
Années d'expérience : 5+
Projets réalisés : 20+

====================
PROFIL
====================
Mara est un développeur web Full Stack passionné et autodidacte.
Fasciné depuis son plus jeune âge par l'informatique et internet, il conçoit des applications web modernes, performantes et intuitives qui répondent à des problématiques concrètes.

Il se spécialise dans :
- React et TypeScript pour le front-end
- Node.js et Python pour le back-end

Mara est également très attiré par le domaine de l'Intelligence Artificielle (IA).
Il s'intéresse activement aux usages de l'IA dans le développement logiciel, l'automatisation, l'analyse de données et les assistants intelligents.

Son objectif pour l'année 2026 est de maîtriser l'Intelligence Artificielle ainsi que ses principaux domaines (machine learning, IA appliquée, automatisation intelligente) afin d'intégrer pleinement l'IA dans ses projets professionnels.

Il aime :
- Explorer de nouvelles technologies
- Se tenir à jour des tendances du web et de l'IA
- Travailler sur des projets personnels ambitieux
- Relever de nouveaux défis techniques
- Collaborer sur des projets innovants

====================
OBJECTIFS
====================
Court et moyen terme :
- Continuer à développer des applications web modernes et performantes
- Approfondir les bonnes pratiques Full Stack

Objectif 2026 :
- Maîtriser l'Intelligence Artificielle
- Comprendre et appliquer les domaines clés de l'IA (machine learning, IA appliquée, automatisation)
- Créer des applications intégrant efficacement l'IA
- Devenir un développeur Full Stack orienté IA

====================
COMPÉTENCES TECHNIQUES
====================
HTML5 : 95%
CSS3 : 90%
JavaScript : 75%
React : 60%
Node.js : 75%
TypeScript : 60%
SQL : 85%
Python : 60%

====================
COMPÉTENCES PROFESSIONNELLES
====================
Communication : 95%
Travail d'équipe : 90%
Gestion de projet : 85%
Autonomie : 75%
Résolution de problèmes : 80%

====================
OUTILS & TECHNOLOGIES
====================
Frontend :
- HTML5
- CSS3
- JavaScript
- TypeScript
- React

Backend :
- Node.js
- Express
- PHP
- Python
- Symfony
- Java
- Spring Boot

Bases de données :
- PostgreSQL
- MySQL
- Oracle

Outils :
- Git
- Figma

====================
PROJETS PRINCIPAUX
====================

1) hellopro.fr
Description :
Marketplace B2B française connectant acheteurs professionnels et fournisseurs.
Fonctionnalités :
- Demandes de devis
- Leads qualifiés
- Large couverture industrielle
Lien : https://www.hellopro.fr

2) Korobo App
Description :
Application de gestion de maintenance de sites photovoltaïques.
Fonctionnalités :
- Suivi en temps réel
- Maintenance préventive et corrective
- Rapports détaillés

3) Ge CARBURANT
Description :
Solution de gestion des quotas de carburant pour les employés.
Fonctionnalités :
- Automatisation de la distribution
- Suivi des consommations
- Transparence budgétaire

4) LasyNet
Description :
Application web de gestion complète de cyber café.
Fonctionnalités :
- Suivi du temps d'utilisation
- Facturation automatique
- Statistiques d'activité
- Gestion des postes clients

====================
LIENS
====================
LinkedIn : https://www.linkedin.com/in/sambelahatse-mara
GitHub : https://github.com/Sambelahatse

====================
RÈGLES DE RÉPONSE
====================
- Réponds toujours de façon claire, professionnelle et concise
- Utilise un ton humain et accueillant
- Mets en valeur les compétences et projets
- Ne dépasse pas les informations fournies
- Si l'utilisateur demande "Tout savoir sur toi", fournis un résumé structuré complet
`;

/**
 * Type pour l'historique de conversation
 */
interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Service Groq - Gère la communication avec l'API Groq
 */
class GroqService {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1';
  private conversationHistory: ConversationMessage[] = [];
  private model: string = 'mixtral-8x7b-32768'; // Modèle Groq disponible

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GROQ_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn(
        '⚠️ Clé API Groq manquante. ' +
        'Ajouter VITE_GROQ_API_KEY à .env.local\n' +
        'Voir: https://console.groq.com'
      );
    }
  }

  /**
   * Ajoute un message à l'historique
   */
  private addToHistory(role: 'user' | 'assistant', content: string): void {
    this.conversationHistory.push({ role, content });
  }

  /**
   * Récupère l'historique formaté pour l'API
   */
  private getFormattedHistory(): Array<{ role: string; content: string }> {
    return this.conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  /**
   * Envoie une requête à l'API Groq
   */
  async askAI(userQuestion: string): Promise<string> {
    // Valider la clé API
    if (!this.apiKey) {
      console.warn('⚠️ Clé API Groq manquante');
      throw new Error(
        'Clé API Groq manquante. Veuillez configurer VITE_GROQ_API_KEY'
      );
    }

    try {
      console.log('🤖 Groq - Message utilisateur:', userQuestion);
      
      // Ajouter la question utilisateur à l'historique
      this.addToHistory('user', userQuestion);

      // Préparer les messages avec le contexte et l'historique
      const messages = [
        {
          role: 'system' as const,
          content: MARA_CONTEXT
        },
        ...this.getFormattedHistory()
      ];

      console.log('📤 Groq - Envoi de la requête...');

      // Appel à l'API Groq
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      console.log('📥 Groq - Réponse reçue (status:', response.status + ')');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || 'Erreur inconnue';
        console.error('❌ Groq API Error:', response.status, errorMessage);
        
        throw new Error(
          `Erreur API Groq (${response.status}): ${errorMessage}`
        );
      }

      const data = await response.json();
      
      // Extraire la réponse
      const assistantMessage = data.choices?.[0]?.message?.content;
      
      if (!assistantMessage) {
        console.error('❌ Groq - Pas de contenu dans la réponse');
        throw new Error('Pas de réponse reçue de l\'API');
      }

      console.log('✅ Groq - Réponse obtenue, taille:', assistantMessage.length);

      // Ajouter la réponse à l'historique
      this.addToHistory('assistant', assistantMessage);

      return assistantMessage;
    } catch (error) {
      console.error('❌ Erreur Groq Service:', error);
      throw error;
    }
  }

  /**
   * Réinitialise l'historique de conversation
   */
  resetHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Récupère l'historique complet
   */
  getHistory(): ConversationMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Défini le modèle à utiliser
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Défini la clé API
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Vérifie si le service est configuré
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

/**
 * Instance singleton du service Groq
 */
let groqServiceInstance: GroqService | null = null;

/**
 * Récupère ou crée l'instance du service Groq
 */
export function getGroqService(): GroqService {
  if (!groqServiceInstance) {
    groqServiceInstance = new GroqService();
  }
  return groqServiceInstance;
}

/**
 * Handler pour AssistantChat - Utilise le service Groq
 */
export async function groqServiceHandler(
  message: string,
  _context?: PortfolioContext
): Promise<string> {
  const service = getGroqService();
  
  console.log('📨 Handler Groq appelé avec message:', message);
  console.log('🔑 Service configuré:', service.isConfigured());

  if (!service.isConfigured()) {
    console.warn('⚠️ API Groq non configurée, utilisation des réponses locales');
    // Fallback vers réponses locales si pas de clé API
    return generateLocalResponse(message);
  }

  try {
    const response = await service.askAI(message);
    console.log('✅ Réponse Groq reçue avec succès');
    return response;
  } catch (error) {
    console.error('❌ Erreur lors de l\'appel Groq:', error);
    console.warn('⚠️ Basculement sur réponses locales');
    // Fallback vers réponses locales en cas d'erreur
    return generateLocalResponse(message);
  }
}

/**
 * Génère une réponse locale basée sur les mots-clés
 * (Fallback si Groq n'est pas disponible)
 */
function generateLocalResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Questions sur Mara
  if (lowerMessage.includes('mara') || lowerMessage.includes('qui es-tu')) {
    return `Je suis Mara Sambelahatse, un développeur web Full Stack passionné et autodidacte basé à Madagascar. 👨‍💻

Je me spécialise en React, TypeScript pour le front-end et Node.js, Python pour le back-end. 

Je suis particulièrement intéressé par l'Intelligence Artificielle et j'ai pour objectif en 2026 de maîtriser l'IA et ses domaines clés pour intégrer pleinement ces technologies dans mes projets.

Vous avez des questions sur mon travail ou mes projets? 😊`;
  }

  if (lowerMessage.includes('compétences') || lowerMessage.includes('skills')) {
    return `Mes compétences principales:

**Front-end:**
- HTML5 (95%) 
- CSS3 (90%)
- JavaScript (75%)
- React (60%)
- TypeScript (60%)

**Back-end:**
- Node.js (75%)
- Python (60%)
- SQL (85%)
- PHP, Symfony, Java, Spring Boot

**Compétences professionnelles:**
- Communication (95%)
- Travail d'équipe (90%)
- Gestion de projet (85%)
- Résolution de problèmes (80%)

Je travaille aussi avec Git et Figma pour les designs. 🎨`;
  }

  if (lowerMessage.includes('projet')) {
    return `Voici mes projets principaux:

1️⃣ **hellopro.fr** - Marketplace B2B
   Connecte acheteurs professionnels et fournisseurs français.
   Lien: https://www.hellopro.fr

2️⃣ **Korobo App** - Gestion de maintenance
   Application pour la gestion et le suivi des sites photovoltaïques.

3️⃣ **Ge CARBURANT** - Gestion des quotas
   Solution moderne pour gérer les quotas de carburant des employés.

4️⃣ **LasyNet** - Gestion de cyber café
   Application web complète pour gérer un cyber café (facturation, statistiques, etc.)

J'ai réalisé plus de 20 projets au total! Vous voulez connaître plus de détails sur un projet? 🚀`;
  }

  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('téléphone')) {
    return `Vous pouvez me contacter via:

📧 **Email:** marasambilahy@gmail.com
📱 **Téléphone:** +261 34 05 857 21

Ou retrouvez-moi sur:
🔗 **LinkedIn:** https://www.linkedin.com/in/sambelahatse-mara
💻 **GitHub:** https://github.com/Sambelahatse

Je serais ravi de discuter de vos projets ou de collaborer! 😊`;
  }

  if (lowerMessage.includes('objectif') || lowerMessage.includes('2026') || lowerMessage.includes('ia') || lowerMessage.includes('intelligence artificielle')) {
    return `Mon objectif principal pour 2026 est de **maîtriser l'Intelligence Artificielle** et ses domaines clés:

🤖 **Machine Learning** - Comprendre les algorithmes et modèles
📊 **IA Appliquée** - Intégrer l'IA dans des applications réelles
⚙️ **Automatisation Intelligente** - Créer des systèmes autonomes
🧠 **Assistants Intelligents** - Développer des chatbots et assistants IA

L'IA fascine par son potentiel à transformer le développement logiciel, l'automatisation et l'analyse de données. C'est un domaine en constant évolution où je veux vraiment exceller! 

Avez-vous des questions sur l'IA ou comment je compte l'appliquer? 🚀`;
  }

  if (lowerMessage.includes('react')) {
    return `React est une excellente bibliothèque JavaScript créée par Facebook! 📚

**Points clés:**
- Composants réutilisables
- Virtual DOM pour optimiser les perfs
- Hooks pour la gestion d'état moderne
- Large communauté et écosystème

Je maîtrise React à 60% et je l'utilise beaucoup dans mes projets. Je vous recommande de l'apprendre si vous voulez développer des interfaces web modernes! ⚡`;
  }

  if (lowerMessage.includes('typescript')) {
    return `TypeScript est un sur-ensemble puissant de JavaScript! 💪

**Avantages principaux:**
- Typage statique (détecte les erreurs avant l'exécution)
- Meilleure autocomplétion dans les IDEs
- Documentation du code intégrée
- Refactoring sécurisé

Je l'utilise à 60% dans mes projets pour améliorer la qualité et la maintenabilité du code. C'est un incontournable en développement professionnel! ✨`;
  }

  // Réponse par défaut
  return `Je n'ai pas d'information spécifique sur ce sujet. N'hésitez pas à me poser des questions sur:
  
- Mara et son profil
- Ses compétences techniques
- Ses projets réalisés
- L'Intelligence Artificielle
- Ou d'autres sujets généraux

Qu'aimeriez-vous savoir? 😊`;
}

export default GroqService;
export type { MARA_CONTEXT, GroqService, ConversationMessage };

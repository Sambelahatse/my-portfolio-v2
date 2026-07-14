/**
 * Service pour appeler le backend déjà déployé de l'assistant IA
 * Endpoint: POST https://back-ai-assist.onrender.com/ask
 * Body attendu: { "prompt": string }
 * Réponse type:
 * {
 *   "prompt": string,
 *   "response": string,
 *   "status": "success" | "error"
 * }
 */

import type { PortfolioContext } from '../components/AssistantChat';
import { generateSystemPrompt, truncateContext } from './chatConfig';
import { groqServiceHandler } from './groqService';

/**
 * Construit un prompt enrichi avec le contexte du portfolio si disponible.
 */
function buildPromptWithContext(message: string, context?: PortfolioContext): string {
  if (!context) {
    return message;
  }

  const safeContext = truncateContext(context, 1000);
  const system = generateSystemPrompt(safeContext);

  return [
    system,
    '\n\n---\n\n',
    "Question de l'utilisateur :",
    '\n',
    message
  ].join('');
}

/**
 * Handler compatible avec <AssistantChat onSendMessage>
 * 1. Envoie la requête au backend déployé
 * 2. En cas d'échec, bascule sur le handler Groq existant (qui a lui-même un fallback local)
 */
export async function backendAssistantHandler(
  message: string,
  context?: PortfolioContext
): Promise<string> {
  const prompt = buildPromptWithContext(message, context);

  try {
    const resp = await fetch('https://back-ai-assist.onrender.com/ask', {
    // const resp = await fetch('http://localhost:5000/ask', { DEV ONLY
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!resp.ok) {
      console.error('Erreur HTTP backend assistant:', resp.status, resp.statusText);
      console.warn('Basculement sur le handler Groq (fallback)...');
      return await groqServiceHandler(message, context);
    }

    const data: { response?: string } = await resp.json();

    if (typeof data?.response === 'string') {
      return data.response;
    }

    console.error('Réponse inattendue du backend assistant:', data);
    console.warn('Basculement sur le handler Groq (fallback)...');
    return await groqServiceHandler(message, context);
  } catch (error) {
    console.error("Erreur lors de l’appel au backend assistant:", error);
    console.warn('Basculement sur le handler Groq (fallback)...');

    try {
      return await groqServiceHandler(message, context);
    } catch (groqError) {
      console.error('Erreur lors du fallback Groq:', groqError);
      return "Désolé, une erreur est survenue lors de la communication avec les services d'assistance. Veuillez réessayer plus tard.";
    }
  }
}

export default backendAssistantHandler;

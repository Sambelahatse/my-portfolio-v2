/**
 * Service d'envoi d'email déclenché depuis le chatbot.
 *
 * Idée :
 * - L'utilisateur écrit :
 *   "envoyer un email à Mara, avec objet X, et voici le message Y, et de piece jointe Z"
 * - On détecte l'intention, on extrait objet / message / pièce jointe
 * - On envoie l'email via la même API Web3Forms que le formulaire de contact
 */

import type { PortfolioContext } from '../components/AssistantChat';

export interface ParsedEmailRequest {
  subject: string;
  body: string;
  attachment?: string;
  senderName?: string;
  senderCompany?: string;
}

/**
 * Détecte si le message semble être une demande d'envoi d'email.
 */
export function isEmailIntent(message: string): boolean {
  const lower = message.toLowerCase();

  const patterns = [
    'envoyer un email',
    'envoyer un mail',
    'envoie un email',
    'envoie un mail',
    'send an email',
    'send email'
  ];

  return patterns.some((p) => lower.includes(p));
}

/**
 * Trouve le premier marqueur dans une liste ("objet", "message", "pièce jointe", ...).
 */
function findMarker(
  lower: string,
  markers: string[]
): { index: number; marker: string } | null {
  for (const marker of markers) {
    const idx = lower.indexOf(marker);
    if (idx !== -1) {
      return { index: idx, marker };
    }
  }
  return null;
}

/**
 * Essaie d'extraire objet / message / pièce jointe à partir d'une phrase naturelle.
 *
 * Exemple supporté :
 * "envoyer un email à Mara, avec objet X, et voici le message Y, et de piece jointe Z"
 */
export function parseEmailRequest(message: string): ParsedEmailRequest | null {
  const lower = message.toLowerCase();

  if (!isEmailIntent(message)) {
    return null;
  }

  const subjectMarker = findMarker(lower, ['objet', 'sujet', 'subject']);
  const bodyMarker = findMarker(lower, ['message', 'contenu', 'corps']);
  const attachmentMarker = findMarker(lower, [
    'pièce jointe',
    'piece jointe',
    'pièce-jointe',
    'fichier joint',
    'attachment'
  ]);

  const len = message.length;

  // Objet
  let subject = '';
  if (subjectMarker) {
    const start = subjectMarker.index + subjectMarker.marker.length;
    const end = bodyMarker?.index ?? attachmentMarker?.index ?? len;
    subject = message
      .substring(start, end)
      .replace(/^\s*[:\-–]*/u, '')
      .trim();
  }

  // Corps du message
  let body = '';
  if (bodyMarker) {
    const start = bodyMarker.index + bodyMarker.marker.length;
    const end = attachmentMarker?.index ?? len;
    body = message
      .substring(start, end)
      .replace(/^\s*[:\-–]*/u, '')
      .trim();
  }

  // Fallbacks si on n'a pas trouvé clairement objet / corps
  if (!subject) {
    subject = "Message depuis le chatbot du portfolio";
  }

  if (!body) {
    // On enlève juste la partie "envoyer un email..." et on garde le reste
    const intentIdx = lower.indexOf('envoyer un email');
    const start = intentIdx !== -1 ? intentIdx + 'envoyer un email'.length : 0;
    body = message.substring(start).trim() || message.trim();
  }

  // Pièce jointe (texte ou lien)
  let attachment: string | undefined;
  if (attachmentMarker) {
    const start = attachmentMarker.index + attachmentMarker.marker.length;
    attachment = message
      .substring(start)
      .replace(/^\s*[:\-–]*/u, '')
      .trim();

    if (!attachment) {
      attachment = undefined;
    }
  }

  // Tentative simple de détection du nom et de l'entreprise de l'expéditeur
  let senderName: string | undefined;
  let senderCompany: string | undefined;

  const namePatterns: RegExp[] = [
    /je m'appelle\s+([^,.\n]+)/i,
    /je m’appelle\s+([^,.\n]+)/i,
    /mon nom est\s+([^,.\n]+)/i
  ];

  for (const re of namePatterns) {
    const m = message.match(re);
    if (m && m[1]) {
      senderName = m[1].trim();
      break;
    }
  }

  const companyPatterns: RegExp[] = [
    /de l'entreprise\s+([^,.\n]+)/i,
    /de la société\s+([^,.\n]+)/i,
    /de la societe\s+([^,.\n]+)/i,
    /de l’entreprise\s+([^,.\n]+)/i,
    /from company\s+([^,.\n]+)/i
  ];

  for (const re of companyPatterns) {
    const m = message.match(re);
    if (m && m[1]) {
      senderCompany = m[1].trim();
      break;
    }
  }

  return { subject, body, attachment, senderName, senderCompany };
}

/**
 * Envoie un email à Mara via l'API Web3Forms.
 * Utilise la même clé / endpoint que le formulaire de contact.
 */
export async function sendPortfolioEmail(
  request: ParsedEmailRequest,
  portfolioContext?: PortfolioContext
): Promise<string> {
  const toEmail = portfolioContext?.email || 'marasambilahy@gmail.com';

  // Corps final de l'email (on ajoute la pièce jointe textuelle si fournie)
  let finalBody = request.body;
  if (request.attachment) {
    finalBody += `\n\n[Information pièce jointe depuis le chatbot]\n${request.attachment}`;
  }

  // Si le nom ou l'entreprise de l'expéditeur sont présents dans le prompt,
  // on les ajoute aussi explicitement dans l'email.
  if (request.senderName || request.senderCompany) {
    finalBody += '\n\n[Informations sur l\'expéditeur]\n';
    if (request.senderName) {
      finalBody += `Nom: ${request.senderName}\n`;
    }
    if (request.senderCompany) {
      finalBody += `Entreprise: ${request.senderCompany}\n`;
    }
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '3135f7e1-8288-4316-85f1-4e5919cadb7e',
        name: 'Chatbot du portfolio',
        email: 'no-reply@assistant.mara-portfolio.com',
        message: finalBody,
        subject: request.subject,
        from_name: 'Assistant IA du portfolio',
        to_email: toEmail
      })
    });

    const result = await response.json();

    if (result.success) {
      return "✅ J'ai bien envoyé un email à Mara avec les informations que tu m'as données.";
    }

    console.error('Erreur Web3Forms (chatEmailService):', result);
    return "❌ Je n'ai pas réussi à envoyer l'email. Merci de réessayer ou d'utiliser directement le formulaire de contact.";
  } catch (error) {
    console.error('Erreur lors de lenvoi de lemail (chatEmailService):', error);
    return "❌ Une erreur réseau est survenue pendant lenvoi de lemail. Merci de réessayer plus tard.";
  }
}

/**
 * Handler complet pour AssistantChat :
 * - détecte lintention
 * - parse la requête
 * - envoie l'email
 * - retourne un message pour affichage dans le chat
 */
export async function handleEmailRequestFromChat(
  rawMessage: string,
  portfolioContext?: PortfolioContext
): Promise<string> {
  if (!isEmailIntent(rawMessage)) {
    return rawMessage;
  }

  const parsed = parseEmailRequest(rawMessage);

  if (!parsed) {
    return "Je crois que tu veux envoyer un email, mais je nai pas compris suffisamment les détails. Merci de préciser au moins lobjet et le message.";
  }

  // On pourrait, dans une version avancée, demander une confirmation utilisateur ici
  // ("Veux-tu que j'envoie cet email ? Oui / Non"). Pour l'instant, on envoie directement.

  return await sendPortfolioEmail(parsed, portfolioContext);
}

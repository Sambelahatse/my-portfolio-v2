import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { IoSend, IoClose, IoRefresh, IoExpand, IoContract } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { isEmailIntent, handleEmailRequestFromChat } from '../services/chatEmailService';
import { useDraggable } from '../hooks/useDraggable';

/**
 * Types pour le composant AssistantChat
 */
type Role = 'user' | 'assistant';

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface PortfolioContext {
  name?: string;
  title?: string;
  bio?: string[];
  skills?: string[];
  projects?: Array<{
    name: string;
    description: string;
  }>;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

interface AssistantChatProps {
  /** Fonction pour envoyer le message à un backend/LLM */
  onSendMessage?: (message: string, context?: PortfolioContext) => Promise<string>;
  /** Titre du chat */
  title?: string;
  /** Placeholder du champ de saisie */
  placeholder?: string;
  /** Afficher/masquer le composant */
  isOpen?: boolean;
  /** Callback quand le chat est fermé */
  onClose?: () => void;
  /** Contexte du portfolio pour les réponses */
  portfolioContext?: PortfolioContext;
}

/**
 * Composant AssistantChat
 * Un assistant IA conversationnel pour le portfolio
 * - Historique de conversation
 * - Support Dark/Light Mode
 * - Prêt pour intégration backend LLM
 * - Design moderne et professionnel
 */
const AssistantChat: React.FC<AssistantChatProps> = ({
  onSendMessage,
  title = 'Assistant IA',
  placeholder = 'Posez-moi une question...',
  isOpen = false,
  onClose = () => {},
  portfolioContext = {}
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // États du composant
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Bonjour ! Je suis l'assistant IA de ${portfolioContext.name || 'Mara'}. 👋\n\nJe peux vous parler de son expérience, ses projets, ses compétences et bien plus encore. N'hésitez pas à poser vos questions !`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Hook pour rendre la fenêtre déplaçable
  const draggable = useDraggable({
    disabled: isExpanded
  });

  /**
   * Auto-scroll vers le dernier message
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Génère une réponse par défaut (sans backend)
   */
  const generateDefaultResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Questions sur Mara / Portfolio
    if (lowerMessage.includes('mara') || lowerMessage.includes('qui es-tu')) {
      return `Je suis l'assistant IA de Mara Sambelahatse. ${portfolioContext.name} est un ${portfolioContext.title || 'développeur web passionné'}. ${portfolioContext.bio?.[0] || 'Il est spécialisé en Full Stack.'}`;
    }

    if (lowerMessage.includes('compétences') || lowerMessage.includes('skills')) {
      const skills = portfolioContext.skills?.join(', ') || 'React, TypeScript, Tailwind CSS, Node.js, Python';
      return `${portfolioContext.name || 'Mara'} maîtrise les compétences suivantes : ${skills}`;
    }

    if (lowerMessage.includes('projet')) {
      const projectsList = portfolioContext.projects?.map(p => `- ${p.name}: ${p.description}`).join('\n') || 'Plusieurs projets innovants en Full Stack';
      return `Voici les projets de ${portfolioContext.name || 'Mara'}:\n\n${projectsList}`;
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('téléphone')) {
      const email = portfolioContext.email || 'marasambilahy@gmail.com';
      const phone = portfolioContext.phone || '+261 34 05 857 21';
      return `Vous pouvez contacter ${portfolioContext.name || 'Mara'} à:\n📧 Email: ${email}\n📱 Téléphone: ${phone}`;
    }

    if (lowerMessage.includes('lien') || lowerMessage.includes('linkedin') || lowerMessage.includes('github')) {
      const linkedin = portfolioContext.linkedin || 'https://linkedin.com';
      const github = portfolioContext.github || 'https://github.com';
      return `Retrouvez ${portfolioContext.name || 'Mara'} sur:\n🔗 LinkedIn: ${linkedin}\n💻 GitHub: ${github}`;
    }

    // Questions générales - simule une réponse IA
    if (lowerMessage.includes('react')) {
      return 'React est une bibliothèque JavaScript créée par Facebook pour construire des interfaces utilisateur interactives. Elle utilise le Virtual DOM pour optimiser les performances.';
    }

    if (lowerMessage.includes('typescript')) {
      return 'TypeScript est un sur-ensemble typé de JavaScript qui offre une meilleure vérification de type et aide à détecter les erreurs avant l\'exécution du code.';
    }

    if (lowerMessage.includes('tailwind')) {
      return 'Tailwind CSS est un framework CSS utility-first qui permet de construire des designs personnalisés sans quitter votre HTML.';
    }

    // Réponse par défaut
    return `Je n'ai pas d'information spécifique sur "${userMessage}". Pourriez-vous reformuler votre question ou me poser quelque chose sur ${portfolioContext.name || 'Mara'} et son travail ?`;
  };

  /**
   * Gère l'envoi de message
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsSending(true);

    try {
      // Appel au backend/LLM si fourni, sinon utiliser la réponse par défaut
      let response = '';

      // 1) Cas spécial : demande d'envoi d'email
      if (isEmailIntent(userMessage.content)) {
        response = await handleEmailRequestFromChat(userMessage.content, portfolioContext);
      }
      // 2) Sinon, on passe par le handler principal (backend IA)
      else if (onSendMessage) {
        response = await onSendMessage(userMessage.content, portfolioContext);
      } else {
        // 3) Fallback local si aucun backend fourni
        await new Promise(resolve => setTimeout(resolve, 800));
        response = generateDefaultResponse(userMessage.content);
      }

      // Ajouter la réponse de l'assistant
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'Désolé, une erreur s\'est produite lors du traitement de votre message. Veuillez réessayer.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  /**
   * Réinitialise la conversation
   */
  const handleReset = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: `Bonjour ! Je suis l'assistant IA de ${portfolioContext.name || 'Mara'}. 👋\n\nJe peux vous parler de son expérience, ses projets, ses compétences et bien plus encore. N'hésitez pas à poser vos questions !`,
        timestamp: new Date()
      }
    ]);
    setInput('');
  };

  // Ne pas rendre si fermé
  if (!isOpen) return null;

  return (
    <div 
      ref={draggable.ref}
      className={`no-cursor pt-10 fixed z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isExpanded 
          ? 'inset-4 w-auto h-auto' 
          : 'bottom-6 right-6 w-96 max-w-[calc(100vw-1.5rem)] h-screen max-h-[600px]'
      }`}
      style={{
        backgroundColor: isDark ? '#202020' : '#ffffff',
        borderColor: isDark ? '#333333' : '#e5e7eb',
        ...draggable.style
      }}
    >
        {/* En-tête */}
        <div 
          ref={draggable.handleRef}
          className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between cursor-move"
        >
          <div>
            <h2 className="text-white font-bold text-lg">{title}</h2>
            <p className="text-white/80 text-xs">Posez-moi vos questions</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
              aria-label={isExpanded ? "Réduire" : "Agrandir"}
            >
              {isExpanded ? <IoContract size={20} /> : <IoExpand size={20} />}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
              aria-label="Fermer le chat"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>

      {/* Zone des messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin ${
        isDark 
          ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-700' 
          : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
      }`}
        style={{
          backgroundColor: isDark ? '#1a1a1a' : '#f9fafb'
        }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-sm lg:max-w-md px-4 py-3 rounded-2xl transition-all duration-300 ${
                message.role === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : isDark
                  ? 'bg-gray-700 text-white rounded-bl-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <div className="text-sm leading-relaxed break-words space-y-2">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="mb-1 last:mb-0" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside space-y-1" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside space-y-1" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-1" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto -mx-1">
                        <table className="min-w-full text-xs border-collapse" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border px-2 py-1 font-semibold" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border px-2 py-1 align-top" {...props} />
                    ),
                    code: ({ node, className, ...props }) => (
                      <code
                        className={`rounded bg-black/10 px-1 py-0.5 text-xs ${className || ''}`}
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />
                    )
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              <span className={`text-xs mt-1 block ${
                message.role === 'user'
                  ? 'text-white/70'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}

        {/* Indicateur "Assistant écrit…" */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className={`px-4 py-3 rounded-2xl rounded-bl-none ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className={`text-xs mt-2 block ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Assistant écrit…
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className={`border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } p-4 space-y-3`}>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder={placeholder}
            rows={1}
            disabled={isLoading || isSending}
            className={`flex-1 px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed resize-none scrollbar-thin ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            style={{ minHeight: '44px', maxHeight: '120px' }}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || isSending || !input.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Envoyer le message"
          >
            <IoSend size={18} />
          </button>
        </form>

        {/* Bouton réinitialiser */}
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-primary dark:text-primary"
        >
          <IoRefresh size={16} />
          Réinitialiser
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        /* Scrollbar personnalisé */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AssistantChat;

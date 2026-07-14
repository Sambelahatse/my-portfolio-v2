import React, { useState } from 'react';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import profile from '../../profile.json';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { sendToN8n, sendToWeb3Forms } from '../services/helpers';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].contact;

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactItems = [
    { icon: FiMail, label: t.email, value: profile.email, href: `mailto:${profile.email}` },
    { icon: FiPhone, label: t.phone, value: profile.phone1, href: `tel:${profile.phone1}` },
    { icon: FiMapPin, label: t.location, value: profile.addresse, href: '' },
  ];

  const socials = [
    { icon: FaLinkedinIn, label: 'LinkedIn', href: profile.linkedin },
    { icon: FaGithub, label: 'GitHub', href: profile.github },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await Promise.all([sendToN8n(formData), sendToWeb3Forms(formData)]);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 bg-neutral-50/50 dark:bg-dark-surface/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-3">
            {language === 'fr' ? 'Me contacter' : 'Get in touch'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-16">
            {t.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2">
                  {t.form.name}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-light focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2">
                  {t.form.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-light focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2">
                  {t.form.message}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-light focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (language === 'fr' ? 'Envoi...' : 'Sending...') : t.form.submit}
              </button>

              {submitStatus === 'success' && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {language === 'fr' ? 'Message envoyé avec succès !' : 'Message sent successfully!'}
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {language === 'fr' ? 'Erreur lors de l\'envoi.' : 'Error sending message.'}
                </p>
              )}
            </form>
          </motion.div>

          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-5">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <Icon className="w-4 h-4 mt-1 text-neutral-400 dark:text-neutral-500 shrink-0" />
                    <div>
                      <p className="text-xs font-medium tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-neutral-700 dark:text-neutral-300 hover:underline underline-offset-4">{item.value}</a>
                      ) : (
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">{item.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              {socials.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

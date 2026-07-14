import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import profile from '../../profile.json';
import { FaPrint, FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdLocationOn, MdPhone, MdLink } from 'react-icons/md';
import { FiArrowLeft, FiDownload, FiMail, FiMapPin } from 'react-icons/fi';

/* ─── Reusable timeline entry ─── */
interface ExpEntryProps {
  title: string;
  period: string;
  company: string;
  location?: string;
  intro?: React.ReactNode;
  responsibilities?: string;
  items?: React.ReactNode[];
  techLabel?: string;
  tech: React.ReactNode;
  fonctionnalites?: React.ReactNode[];
}

const ExpEntry: React.FC<ExpEntryProps> = ({
  title, period, company, location, intro, responsibilities, items, techLabel = 'Technologies :', tech, fonctionnalites,
}) => (
  <div className="relative pl-5">
    <div className="absolute w-2 h-2 bg-black rounded-full -left-[4.5px] top-1"></div>
    <div className="flex justify-between items-start mb-0.5 gap-2">
      <h4 className="text-[11.5px] font-bold text-[#D08B2A] leading-tight">{title}</h4>
      <span className="text-[10px] text-gray-800 whitespace-nowrap shrink-0">{period}</span>
    </div>
    <p className="text-[10.5px] font-bold text-black leading-tight">
      {company}{location && <span className="font-normal text-gray-700"> {location}</span>}
    </p>
    {intro && (
      <div className="text-[10px] text-gray-800 mt-1 leading-snug">{intro}</div>
    )}
    {fonctionnalites && (
      <>
        <p className="text-[10px] font-bold mt-1.5">Fonctionnalités :</p>
        <ul className="list-disc list-outside ml-5 space-y-0.5 mt-0.5 text-[10px] text-gray-700 leading-snug">
          {fonctionnalites}
        </ul>
      </>
    )}
    {responsibilities && items && (
      <>
        <p className="text-[10px] font-bold mt-1.5">{responsibilities}</p>
        <ul className="list-disc list-outside ml-5 space-y-0.5 mt-0.5 text-[10px] text-gray-700 leading-snug">
          {items}
        </ul>
      </>
    )}
    <div className="mt-1.5 text-[10px] leading-snug">
      <span className="font-bold">{techLabel}</span>{' '}{tech}
    </div>
  </div>
);

/* ─── Skill bar ─── */
const SkillBar: React.FC<{ name: string; pct: string }> = ({ name, pct }) => (
  <div>
    <p className="text-[11px] font-bold mb-1 text-white">{name}</p>
    <div className="h-1.5 w-full bg-[#353C51] rounded-full overflow-hidden">
      <div className="h-full bg-orange-500" style={{ width: pct }}></div>
    </div>
  </div>
);

/* ─── Main component ─── */
const CvPage: React.FC = () => {
  const cvRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const avatarRed = profile.avatarUrlRed || '/assets/profil-avatar-bg-red.png';

  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: `CV_${profile.fullName.replace(/\s+/g, '_')}`,
    onBeforePrint: async () => {
      const photo = photoRef.current;

      if (!photo || photo.complete) {
        return;
      }

      await new Promise<void>((resolve, reject) => {
        photo.onload = () => resolve();
        photo.onerror = () => reject(new Error('La photo du CV n\'a pas pu etre chargee avant impression.'));
      });
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center print:bg-white print:p-0"
         style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff7ed 100%)' }}>

      {/* ── Top action bar ── */}
      <div className="w-full max-w-[210mm] mt-6 mb-4 flex items-center justify-between gap-3 print:hidden px-1">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/70 backdrop-blur-sm border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FiArrowLeft size={15} />
          Retour au portfolio
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePrint()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #1E2535 0%, #2d3a55 100%)' }}
          >
            <FaPrint size={13} />
            Imprimer
          </button>
          <button
            onClick={() => handlePrint()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #D08B2A 0%, #e6a03a 100%)' }}
          >
            <FiDownload size={14} />
            Télécharger PDF
          </button>
        </div>
      </div>

      {/* ── Hero banner ── */}
      <div
        className="w-full max-w-[210mm] rounded-2xl mb-4 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #1E2535 0%, #2d3a55 100%)' }}
      >
        {/* Decorative glow */}
        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #D08B2A, transparent)' }} />
        <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

        <div className="relative z-10">
          <p className="text-xs font-semibold text-orange-400 tracking-widest uppercase mb-1">Curriculum Vitae</p>
          <h1 className="text-xl font-bold text-white leading-tight">{profile.fullName}</h1>
          <p className="text-sm text-slate-300 mt-0.5">{profile.title}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <FiMail size={11} className="text-orange-400" />
              {profile.email}
            </span>
            <span className="flex items-center gap-1">
              <FiMapPin size={11} className="text-orange-400" />
              Antananarivo, Madagascar
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center sm:items-end gap-2 shrink-0">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(208,139,42,0.18)', color: '#f5b342', border: '1px solid rgba(208,139,42,0.3)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Disponible pour collaboration
          </span>
          <div className="flex gap-2 mt-1">
            <a
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full text-slate-300 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              aria-label="GitHub"
            >
              <FaGithub size={15} />
            </a>
            <a
              href={`https://linkedin.com/in/${profile.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full text-slate-300 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              aria-label="LinkedIn"
            >
              <FaLinkedin size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* A4 wrapper */}
      <div
        ref={cvRef}
        className="cv-print-container w-full max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-[210mm] print:m-0"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        <div className="cv-wrapper flex flex-row">

          {/* ═══════════ LEFT SIDEBAR ═══════════ */}
          <aside className="w-[32%] shrink-0 bg-[#1E2535] text-white flex flex-col">

            {/* Photo */}
            <div className="p-5 pb-3 w-full">
              <div className="w-full aspect-square rounded-md overflow-hidden bg-red-600 shadow-md">
                <img
                  ref={photoRef}
                  src={avatarRed}
                  alt={profile.fullName}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="px-5 py-3 flex-grow space-y-4">

              {/* Contact */}
              <div className="space-y-2 text-[10.5px] leading-tight text-gray-200">
                <div className="flex items-start gap-1.5">
                  <MdEmail size={13} className="mt-0.5 shrink-0 text-orange-400" />
                  <span className="break-all">{profile.email}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MdLocationOn size={13} className="mt-0.5 shrink-0 text-orange-400" />
                  <span>Lot IJ 65 Bis - Andavamamba,<br />Antananarivo 101</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MdLink size={13} className="mt-0.5 shrink-0 text-orange-400" />
                  <span>ms-team-androy.onrender.com</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MdPhone size={13} className="mt-0.5 shrink-0 text-orange-400" />
                  <span>{profile.phone1}</span>
                </div>
              </div>

              {/* Langues */}
              <div>
                <h3 className="text-[12px] font-bold tracking-wide text-white mb-2">Langues</h3>
                <div className="space-y-2.5">
                  <div>
                    <p className="text-[10.5px] font-bold mb-1">Français</p>
                    <div className="h-1.5 w-full bg-[#353C51] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-[95%]"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10.5px] font-bold mb-1">Anglais</p>
                    <div className="h-1.5 w-full bg-[#353C51] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-[55%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div>
                <h3 className="text-[12px] font-bold tracking-wide text-white mb-2">Réseaux sociaux</h3>
                <div className="space-y-1.5 text-[10.5px] text-gray-200">
                  <div className="flex items-center gap-1.5">
                    <FaGithub size={13} className="shrink-0" />
                    <span>Mara Sambelahatse</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaLinkedin size={13} className="shrink-0" />
                    <span>Sambelahatse Mara</span>
                  </div>
                </div>
              </div>

              {/* Atouts */}
              <div>
                <h3 className="text-[12px] font-bold tracking-wide text-white mb-2">Atouts</h3>
                <ul className="text-[10.5px] space-y-1 text-gray-200">
                  <li>Gestion du temps</li>
                  <li>Esprit analytique et curiosité intellectuelle</li>
                  <li>Communication efficace</li>
                  <li>Résilience et gestion du stress</li>
                  <li>Capacité d'adaptation</li>
                  <li>Esprit d'équipe</li>
                </ul>
              </div>

              {/* Centres d'intérêt */}
              <div>
                <h3 className="text-[12px] font-bold tracking-wide text-white mb-2">Centres d'intérêt</h3>
                <ul className="text-[10.5px] space-y-1 text-gray-200">
                  <li>Chanter (Chorale)</li>
                  <li>Sport (Football / Athlétisme)</li>
                </ul>
              </div>

              {/* Compétences – text blocks */}
              <div>
                <h3 className="text-[12px] font-bold tracking-wide text-white mb-2">Compétences</h3>
                <div className="text-[10px] space-y-2.5 text-gray-200">
                  <div>
                    <span className="font-bold block text-white">Optimisation des performances</span>
                    <span className="leading-tight block">Capacité à optimiser les performances des applications développées en termes de vitesse, consommation de ressources, etc.</span>
                  </div>
                  <div>
                    <span className="font-bold block text-white">Veille technologique</span>
                    <span className="leading-tight block">Capacité à se tenir informé des dernières avancées technologiques et à les intégrer dans ses projets de développement.</span>
                  </div>
                  <div>
                    <span className="font-bold block text-white">Analyse des besoins</span>
                    <span className="leading-tight block">Capacité à comprendre et analyser les besoins des utilisateurs pour proposer des solutions adaptées.</span>
                  </div>
                  {/* Automatisation n8n */}
                  <div>
                    <span className="font-bold block text-white mb-1">Automatisation avec n8n</span>
                    <div className="h-1.5 w-full bg-[#353C51] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-[70%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compétences – progress bars */}
              <div className="space-y-3 pb-6">
                {[
                  { name: 'PHP', pct: '85%' },
                  { name: 'Git et gestion de versions', pct: '90%' },
                  { name: 'TypeScript', pct: '85%' },
                  { name: 'Node.js (TS)', pct: '80%' },
                  { name: 'React TS', pct: '85%' },
                  { name: 'JavaScript (ES6+)', pct: '90%' },
                  { name: 'CSS3', pct: '90%' },
                  { name: 'HTML5', pct: '95%' },
                ].map((s) => <SkillBar key={s.name} name={s.name} pct={s.pct} />)}
              </div>
            </div>
          </aside>

          {/* ═══════════ RIGHT COLUMN ═══════════ */}
          <main className="flex-1 flex flex-col bg-white">

            {/* Header – peach */}
            <header className="bg-[#FFEFE0] px-7 py-7 border-b-4 border-white">
              <h1 className="text-[20px] font-medium text-gray-900 leading-tight">Sambelahatse MARA</h1>
              <h2 className="text-[15px] font-bold text-[#D08B2A] mt-0.5">Développeur full stack</h2>
              <p className="text-[10.5px] text-gray-800 mt-2 leading-relaxed">
                Développeur informatique confirmé spécialisé en développement Full Stack,<br />
                capable de transformer vos idées en solutions digitales innovantes.
              </p>
            </header>

            <div className="px-7 py-5 space-y-5">

              {/* ── Diplômes ── */}
              <section>
                <h3 className="text-[14px] font-bold text-black mb-3">Diplômes et Formations</h3>
                <div className="relative border-l-[1.5px] border-black ml-1.5 space-y-4">

                  <div className="relative pl-5">
                    <div className="absolute w-2 h-2 bg-black rounded-full -left-[4.5px] top-1"></div>
                    <div className="flex justify-between items-start mb-0.5 gap-2">
                      <h4 className="text-[11.5px] font-bold text-[#D08B2A]">Master Professionnel</h4>
                      <span className="text-[10px] text-gray-800 whitespace-nowrap shrink-0">De 2021 à 2023</span>
                    </div>
                    <p className="text-[10.5px] font-bold text-black">ECOLE NATIONALE D'INFORMATIQUE - Université de Fianarantsoa</p>
                    <p className="text-[10px] text-gray-700">Fianarantsoa, Madagascar</p>
                    <p className="text-[10px] text-gray-600 leading-snug mt-0.5">
                      Formation axée sur le développement logiciel, l'ingénierie informatique,
                      l'intelligence artificielle, le DevOps et les systèmes ERP.
                    </p>
                  </div>

                  <div className="relative pl-5">
                    <div className="absolute w-2 h-2 bg-black rounded-full -left-[4.5px] top-1"></div>
                    <div className="flex justify-between items-start mb-0.5 gap-2">
                      <h4 className="text-[11.5px] font-bold text-[#D08B2A]">LICENCE PROFESSIONNELLE</h4>
                      <span className="text-[10px] text-gray-800 whitespace-nowrap shrink-0">De 2018 à 2021</span>
                    </div>
                    <p className="text-[10.5px] font-bold text-black">ECOLE NATIONALE D'INFORMATIQUE - Université de Fianarantsoa</p>
                    <p className="text-[10px] text-gray-700">Fianarantsoa, Madagascar</p>
                    <p className="text-[10px] text-gray-600 leading-snug mt-0.5">
                      Licence Professionnelle en Informatique – Formation axée sur la modélisation
                      MERISE, l'algorithmique et la programmation (C, C++, PHP, Java, JavaScript),
                      ainsi que les fondamentaux de la gestion des fichiers et des données.
                    </p>
                  </div>

                </div>
              </section>

              {/* ── Expériences ── */}
              <section>
                <h3 className="text-[14px] font-bold text-black mb-3">Expériences professionnelles</h3>
                <div className="relative border-l-[1.5px] border-black ml-1.5 space-y-4">

                  {/* 1 – helloTana */}
                  <ExpEntry
                    title="Développeur, service informatique"
                    period="Depuis 2023"
                    company="helloTana / Hellopro.fr"
                    location="Antsahavola, Antananarivo - Madagascar"
                    intro={
                      <>
                        <p>Participation au <strong>développement</strong>, à la <strong>maintenance</strong> et à l'<strong>optimisation de la plateforme Hellopro</strong>, afin d'améliorer les processus internes et l'expérience utilisateur.</p>
                        <p className="font-bold mt-1">Responsabilités :</p>
                        <ul className="list-disc list-outside ml-5 space-y-0.5 mt-0.5 text-gray-700">
                          <li>Maintenance et amélioration des plateformes <a href="https://hellopro.fr" className="text-blue-700 underline font-semibold">hellopro.fr</a>, <a href="https://bo.hellopro.fr" className="text-blue-700 underline font-semibold">bo.hellopro.fr</a>, <a href="https://mc.hellopro.fr" className="text-blue-700 underline font-semibold">mc.hellopro.fr</a> et <a href="https://mca.hellopro.fr" className="text-blue-700 underline font-semibold">mca.hellopro.fr</a>.</li>
                          <li>Rédaction de <strong>fiches techniques</strong> de projets informatiques afin de formaliser les besoins fonctionnels et techniques.</li>
                          <li>Conception et développement de <strong>projets d'amélioration des espaces clients</strong>.</li>
                          <li>Intégration de <strong>catalogues produits</strong> via différents flux (Salesforce, flux automatisés ou intégrations ponctuelles).</li>
                          <li>Collaboration avec les <strong>équipes métiers</strong> pour analyser les besoins et proposer des solutions techniques adaptées.</li>
                          <li>Participation à <strong>la mise en place et à l'évolution du système de gestion de bases de données</strong>.</li>
                          <li>Optimisation <strong>des performances des applications web</strong> pour réduire les temps de chargement.</li>
                          <li>Conception et développement d'un <strong>outil de scraping</strong> pour l'extraction automatisée de fiches produits.</li>
                        </ul>
                      </>
                    }
                    tech="PHP, JavaScript (jQuery), HTML, CSS, Python, MySQL."
                  />

                  {/* 2 – KOROBO */}
                  <ExpEntry
                    title="Développeur Full Stack – KOROBO (Projet en Attente)"
                    period="Depuis février 2024"
                    company="Team Androy"
                    location="Antananarivo"
                    intro={
                      <p>Développement d'une <strong>plateforme de gestion et de suivi de maintenance photovoltaïque</strong> destinée aux entreprises exploitant des sites de panneaux solaires.</p>
                    }
                    fonctionnalites={[
                      <li key="k1">Gestion des <strong>entreprises prospects</strong></li>,
                      <li key="k2">Gestion des <strong>utilisateurs</strong> (administrateurs d'entreprise et intervenants techniques)</li>,
                      <li key="k3">Gestion des <strong>sites photovoltaïques</strong></li>,
                      <li key="k4">Gestion des <strong>matériels et équipements</strong></li>,
                      <li key="k5">Gestion des <strong>données techniques des matériaux</strong></li>,
                      <li key="k6">Planification et gestion du <strong>calendrier d'interventions</strong></li>,
                    ]}
                    tech={<>Frontend : React.js, Tailwind CSS<br />Backend : Node.js, Sequelize, PostgreSQL</>}
                  />

                  {/* 3 – LasyNet */}
                  <ExpEntry
                    title="Développeur Web – LasyNet"
                    period="De septembre 2025 à janvier 2026"
                    company="LasyNET"
                    location="Antananarivo"
                    intro={
                      <p>Conception et développement d'une application web de gestion de cyber café.</p>
                    }
                    fonctionnalites={[
                      <li key="l1">Implémentation du suivi des sessions, du calcul automatique du temps et de la facturation.</li>,
                      <li key="l2">Développement du dashboard administrateur avec statistiques et gestion des postes.</li>,
                      <li key="l3">Conception de la base de données et développement des API backend.</li>,
                      <li key="l4">Maintenance et amélioration continue de l'application.</li>,
                    ]}
                    tech="Python, FASTAPI, SQLAlchemy, React TS, Tailwind css"
                  />

                  {/* 4 – Mon ambassadeur Virtuel */}
                  <ExpEntry
                    title="Développeur freelance"
                    period="De décembre 2024 à février 2025"
                    company="Mon ambassadeur Virtuel"
                    location="- basé à Antananarivo"
                    intro={
                      <p>Participation au développement et à l'amélioration de la <strong>plateforme Elyone Entreprise</strong>.</p>
                    }
                    responsibilities="Responsabilités :"
                    items={[
                      <li key="m1">Conception et développement de <strong>microservices</strong> pour les espaces clients (Back Office et Front Office)</li>,
                      <li key="m2">Développement d'un <strong>outil d'intégration automatisée</strong> permettant la synchronisation des produits entre <strong>HubSpot CRM et Sage</strong></li>,
                      <li key="m3">Amélioration des processus d'intégration et de gestion des données</li>,
                    ]}
                    tech="PHP, Node.js, Python"
                  />

                  {/* 5 – SPAT (Ge Carburant) */}
                  <ExpEntry
                    title="Développement d'une application web Ge-Carbu (Stage)"
                    period="De juin 2023 à novembre 2023"
                    company="SPAT – Société du Port à Gestion Autonome de Toamasina"
                    location="Toamasina - Madagascar"
                    intro={
                      <p>Conception et réalisation d'une application web dédiée à la gestion des attributions et au suivi de la consommation de carburant des employés.</p>
                    }
                    fonctionnalites={[
                      <li key="s1">Gestion des attributions de carburant par employé</li>,
                      <li key="s2">Suivi des consommations et des historiques</li>,
                      <li key="s3">Gestion des employés et des véhicules</li>,
                      <li key="s4">Système de validation des demandes (workflow)</li>,
                      <li key="s5">Tableau de bord avec indicateurs clés (consommation, quotas, anomalies)</li>,
                      <li key="s6">Génération de rapports et statistiques</li>,
                      <li key="s7">Authentification sécurisée et gestion des rôles (admin, gestionnaire)</li>,
                      <li key="s8">Interface utilisateur moderne et responsive</li>,
                      <li key="s9">Optimisation et sécurisation des accès aux données</li>,
                    ]}
                    tech={<>Backend : JAVA (Spring Boot),<br />Frontend : React JS, Material UI<br />SGBD : PostgreSQL,<br />Sécurité : JWT</>}
                  />

                  {/* 6 – DBA */}
                  <ExpEntry
                    title="Projet DBA (Database Administration)"
                    period="De mars 2023 à avril 2023"
                    company="ENI Fianarantsoa (Ecole Nationale d'Informatique - Université de Fianarantsoa)"
                    location="Fianarantsoa - Madagascar"
                    intro={
                      <p>Réalisation d'une application web avec surveillance de la base de données pour la gestion de bibliothèques</p>
                    }
                    fonctionnalites={[
                      <li key="d1">Gestion complète des livres (ajout, modification, suppression, disponibilité)</li>,
                      <li key="d2">Gestion des utilisateurs (adhérents, administrateurs)</li>,
                      <li key="d3">Système d'emprunt et de retour des livres</li>,
                      <li key="d4">Suivi des retards et pénalités</li>,
                      <li key="d5">Journalisation automatique des actions (logs en base de données)</li>,
                      <li key="d6">Surveillance de la base de données (insertion, mise à jour, suppression)</li>,
                      <li key="d7">
                        Mise en place de <strong>triggers MySQL</strong> pour :
                        <ul className="list-disc list-outside ml-5 mt-0.5 space-y-0.5">
                          <li>historiser les modifications des données</li>
                          <li>contrôler l'intégrité des données</li>
                          <li>automatiser certaines règles métiers (ex : mise à jour du stock après emprunt)</li>
                        </ul>
                      </li>,
                      <li key="d8">Tableaux de bord avec statistiques (livres disponibles, emprunts, retards)</li>,
                      <li key="d9">Interface utilisateur dynamique et responsive</li>,
                      <li key="d10">Gestion des rôles et authentification</li>,
                    ]}
                    tech="Node.js, Express.js, Sequelize, MySQL, React JS"
                  />

                  {/* 7 – Projet RO */}
                  <ExpEntry
                    title="Projet Recherche opérationnelle (RO)"
                    period="De mai 2022 à octobre 2022"
                    company="ENI Fianarantsoa (Ecole Nationale d'Informatique - Université de Fianarantsoa)"
                    location="Fianarantsoa - Madagascar"
                    intro={
                      <p>Conception et développement d'une application desktop dédiée à l'ordonnancement et à la planification de tâches à l'aide de diagrammes de Gantt.</p>
                    }
                    fonctionnalites={[
                      <li key="r1">Création et gestion des tâches (durée, priorité, dépendances)</li>,
                      <li key="r2">Planification automatique des tâches selon les contraintes</li>,
                      <li key="r3">Visualisation des plannings via diagramme de Gantt</li>,
                      <li key="r4">Gestion des dépendances entre tâches (prédécesseurs / successeurs)</li>,
                      <li key="r5">Calcul des dates de début et de fin optimales</li>,
                      <li key="r6">Identification du chemin critique</li>,
                      <li key="r7">Interface graphique interactive pour la manipulation des tâches</li>,
                      <li key="r8">Mise à jour dynamique du planning en fonction des modifications</li>,
                    ]}
                    tech="Java Swing, NetBeans"
                  />

                  {/* 8 – Cyber MAKER */}
                  <ExpEntry
                    title="Développement du site web « Hi-PUP » (Stage)"
                    period="D'avril 2021 à juin 2021"
                    company="Cyber MAKER / Teesh Maker"
                    location="Toamasina - Madagascar"
                    intro={
                      <p>Conception et développement d'un site web dédié à la gestion et à la diffusion des publicités pour des entreprises commerciales.</p>
                    }
                    fonctionnalites={[
                      <li key="c1">Gestion des campagnes publicitaires (création, modification, suppression)</li>,
                      <li key="c2">Publication et affichage des annonces sur la plateforme</li>,
                      <li key="c3">Gestion des comptes utilisateurs (annonceurs / administrateurs)</li>,
                      <li key="c4">Tableau de bord pour le suivi des publicités</li>,
                      <li key="c5">Interface responsive adaptée aux différents supports (web/mobile)</li>,
                      <li key="c6">Intégration d'éléments visuels (icônes, mises en page dynamiques)</li>,
                      <li key="c7">Organisation et catégorisation des annonces</li>,
                    ]}
                    tech="PHP, Bootstrap 3, Font Awesome, Ionic"
                  />

                  {/* 9 – Projet JAVA / RH */}
                  <ExpEntry
                    title="Projet Développement d'une application de gestion des RH (Partie Employés)"
                    period="De janvier 2021 à février 2021"
                    company="ENI Fianarantsoa (Ecole Nationale d'Informatique - Université de Fianarantsoa)"
                    location="Fianarantsoa - Madagascar"
                    intro={
                      <p>Conception et développement d'une application desktop dédiée à la gestion des ressources humaines, avec un focus sur la gestion des employés.</p>
                    }
                    fonctionnalites={[
                      <li key="j1">Gestion complète des employés (ajout, modification, suppression)</li>,
                      <li key="j2">Gestion des départements et des postes</li>,
                      <li key="j3">Système de recherche et filtrage avancé</li>,
                      <li key="j4">Affichage des données via un tableau interactif (JTable)</li>,
                      <li key="j5">Visualisation des statistiques à l'aide de graphiques</li>,
                      <li key="j6">Authentification sécurisée avec gestion des rôles (admin / utilisateur)</li>,
                      <li key="j7">Génération de rapports (employés, salaires, activités)</li>,
                      <li key="j8">Interface utilisateur intuitive et ergonomique</li>,
                      <li key="j9">Structuration et gestion des données en base relationnelle</li>,
                    ]}
                    tech="Java Swing, MySQL, JTable, JFreeChart"
                  />

                  {/* 10 – OML SALT */}
                  <ExpEntry
                    title="Développement d'une application web (Stage)"
                    period="De novembre 2019 à janvier 2020"
                    company="OML (Oniversite Martin Lotera) - SALT Ivory Avaratra"
                    location="Fianarantsoa - Madagascar"
                    intro={
                      <p>Conception et développement d'une application web dédiée à la gestion des activités et des publications de la gazette "Feony ny SALT" (Voix de la SALT), assurant la diffusion des informations de la SALT et de l'Église Luthérienne Malagasy (FLM).</p>
                    }
                    fonctionnalites={[
                      <li key="o1">Gestion et publication des articles et actualités</li>,
                      <li key="o2">Organisation et classification des contenus (catégories, thèmes)</li>,
                      <li key="o3">Gestion des utilisateurs (rédacteurs / administrateurs)</li>,
                      <li key="o4">Système de validation et de publication des contenus</li>,
                      <li key="o5">Gestion et stockage des données en base relationnelle</li>,
                    ]}
                    tech="PHP, Bootstrap, MySQL"
                  />

                </div>
              </section>
            </div>
          </main>

        </div>
      </div>

      {/* ── Footer strip ── */}
      <div className="w-full max-w-[210mm] mt-6 mb-8 print:hidden">
        <div
          className="rounded-2xl px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
        >
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-slate-800">Intéressé par mon profil ?</p>
            <p className="text-xs text-slate-500 mt-0.5">N'hésitez pas à me contacter directement.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              style={{ background: 'linear-gradient(135deg, #D08B2A, #e6a03a)' }}
            >
              <FiMail size={14} />
              {profile.email}
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-slate-900 transition-all duration-200 hover:-translate-y-0.5 border border-slate-200 hover:border-slate-300 bg-white shadow-sm hover:shadow-md"
            >
              <FiArrowLeft size={14} />
              Voir le portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvPage;

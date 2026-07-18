'use client'
import { useEffect, useRef, useState } from 'react'

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&family=Sarabun:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f5f3ef; --white: #ffffff; --border: #e8e4de;
  --text: #1a1a1a; --muted: #888880; --dim: #d0ccc4;
  --accent: #1a7a5e; --accent2: #2a6496;
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans: 'Sarabun', 'DM Sans', sans-serif;
  --mono: 'DM Mono', monospace;
}

html { scroll-behavior: smooth; }
body {
  background: var(--bg); color: var(--text);
  font-family: var(--sans); font-size: 15px;
  line-height: 1.8; overflow-x: hidden; cursor: none;
}

.cursor-dot {
  position: fixed; top: 0; left: 0; z-index: 9999;
  width: 8px; height: 8px; background: var(--accent);
  border-radius: 50%; pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 0.1s, width 0.3s, height 0.3s;
}
.cursor-ring {
  position: fixed; top: 0; left: 0; z-index: 9998;
  width: 36px; height: 36px; border: 1.5px solid var(--accent);
  border-radius: 50%; pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.35s cubic-bezier(.4,0,.2,1), height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.3s;
  opacity: 0.5;
}
.cursor-ring.hovered { width: 60px; height: 60px; opacity: 0.25; }
@media (hover: none) { .cursor-dot, .cursor-ring { display: none; } body { cursor: auto; } }

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--dim); }

.scroll-progress {
  position: fixed; top: 0; left: 0; z-index: 200;
  height: 2px; background: var(--accent); width: 0%;
  transition: width 0.1s linear;
}

/* NAV */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 48px;
  border-bottom: 1px solid transparent;
  transition: border-color 0.4s, background 0.4s, backdrop-filter 0.4s, padding 0.4s;
  gap: 20px;
}
nav.scrolled {
  border-color: var(--border);
  background: rgba(245,243,239,0.92);
  backdrop-filter: blur(20px);
  padding-top: 14px; padding-bottom: 14px;
}
.nav-logo {
  font-family: var(--serif); font-size: 22px; font-weight: 400;
  color: var(--text); text-decoration: none; transition: color 0.2s;
}
.nav-logo:hover { color: var(--accent); }
.nav-links { display: flex; gap: 32px; list-style: none; flex: 1; justify-content: center; }
.nav-links a {
  font-size: 13px; font-weight: 500; letter-spacing: 0.04em;
  color: var(--muted); text-decoration: none; transition: color 0.2s;
  position: relative;
}
.nav-links a::after {
  content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
  height: 1px; background: var(--accent);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.nav-links a:hover { color: var(--text); }
.nav-links a:hover::after, .nav-links a.active::after { transform: scaleX(1); }
.nav-links a.active { color: var(--text); }

/* LANG TOGGLE */
.lang-toggle {
  display: flex; align-items: center;
  border: 1px solid var(--border); border-radius: 100px;
  overflow: hidden; flex-shrink: 0;
  font-family: var(--mono); font-size: 11px;
}
.lang-toggle button {
  padding: 5px 14px; background: none; border: none;
  color: var(--muted); cursor: none;
  transition: background 0.2s, color 0.2s;
  font-family: var(--mono); font-size: 11px;
  letter-spacing: 0.05em;
}
.lang-toggle button.active {
  background: var(--accent); color: var(--white);
}
.lang-toggle button:not(.active):hover { color: var(--text); }

/* HAMBURGER */
.hamburger {
  display: none; flex-direction: column; gap: 5px;
  padding: 4px; background: none; border: none; z-index: 110; cursor: pointer;
}
.hamburger span {
  display: block; width: 24px; height: 1.5px;
  background: var(--text); border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s;
}
.hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

.mobile-menu {
  position: fixed; inset: 0; z-index: 99; background: var(--bg);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 36px; opacity: 0; pointer-events: none;
  transition: opacity 0.35s cubic-bezier(.4,0,.2,1);
}
.mobile-menu.open { opacity: 1; pointer-events: all; }
.mobile-menu a {
  font-size: clamp(32px, 8vw, 48px); font-weight: 300;
  color: var(--text); text-decoration: none;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.35s, transform 0.35s, color 0.2s;
}
.mobile-menu.open a { opacity: 1; transform: none; }
.mobile-menu.open a:nth-child(1) { transition-delay: 0.05s; }
.mobile-menu.open a:nth-child(2) { transition-delay: 0.1s; }
.mobile-menu.open a:nth-child(3) { transition-delay: 0.15s; }
.mobile-menu.open a:nth-child(4) { transition-delay: 0.2s; }
.mobile-menu a:hover { color: var(--accent); }
.mobile-lang {
  display: flex; gap: 12px;
}
.mobile-lang button {
  font-size: 20px; font-family: var(--mono);
  color: var(--muted); background: none; border: 1px solid var(--border);
  border-radius: 100px; padding: 6px 20px; cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.mobile-lang button.active { background: var(--accent); color: var(--white); border-color: var(--accent); }

@media (max-width: 768px) {
  nav { padding: 16px 20px; }
  .hamburger { display: flex; }
  .nav-links { display: none; }
  .lang-toggle { display: none; }
}

/* HERO */
.hero {
  min-height: 100vh; display: flex;
  background: var(--bg); position: relative; overflow: hidden;
}
.hero::before {
  content: ''; position: absolute; inset: 0; z-index: 0; opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  pointer-events: none;
}
.hero-left {
  display: flex; flex-direction: column; justify-content: center;
  padding: 120px 64px 80px; position: relative; z-index: 1;
}
.hero-tag {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 500; letter-spacing: 0.08em;
  color: var(--muted); margin-bottom: 48px;
  opacity: 0; animation: fadeUp 0.7s 0.1s forwards;
}
.hero-tag::before { content: ''; width: 28px; height: 1px; background: var(--dim); }
.hero-title {
  font-size: clamp(32px, 5.5vw, 72px);
  font-weight: 300; line-height: 1.15; letter-spacing: -0.01em;
  margin-bottom: 32px; color: var(--text);
  opacity: 0; animation: fadeUp 0.7s 0.2s forwards;
}
.hero-title em { font-style: normal; color: var(--accent); font-weight: 500; }
.hero-name {
  font-family: var(--serif); font-size: 22px; font-weight: 500;
  color: var(--text); margin-bottom: 10px;
  opacity: 0; animation: fadeUp 0.7s 0.32s forwards;
}
.hero-bio {
  font-size: 15px; color: var(--muted);
  max-width: 500px; line-height: 1.9; margin-bottom: 10px;
  opacity: 0; animation: fadeUp 0.7s 0.4s forwards;
}
.hero-avail {
  font-family: var(--mono); font-size: 11px; color: var(--accent);
  letter-spacing: 0.05em; margin-top: 16px; margin-bottom: 48px;
  opacity: 0; animation: fadeUp 0.7s 0.48s forwards;
}
.hero-avail::before { content: '▸ '; opacity: 0.6; }
.hero-btns {
  display: flex; gap: 12px; flex-wrap: wrap;
  opacity: 0; animation: fadeUp 0.7s 0.56s forwards;
}

/* LANG FADE TRANSITION */
.lang-fade { transition: opacity 0.25s ease; }
.lang-fade.switching { opacity: 0; }

.typed-cursor {
  display: inline-block; width: 2px; height: 0.85em;
  background: var(--accent); margin-left: 2px; vertical-align: middle;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.btn-primary {
  padding: 13px 28px; background: var(--text); color: var(--white);
  border: none; border-radius: 100px;
  font-family: var(--sans); font-size: 14px; font-weight: 500;
  text-decoration: none; cursor: none;
  transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
  display: inline-flex; align-items: center; gap: 6px;
}
.btn-primary:hover { background: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,122,94,0.25); }
.btn-outline {
  padding: 13px 28px; background: transparent; color: var(--muted);
  border: 1px solid var(--border); border-radius: 100px;
  font-family: var(--sans); font-size: 14px; font-weight: 500;
  text-decoration: none; cursor: none;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}
.btn-outline:hover { border-color: var(--text); color: var(--text); transform: translateY(-2px); }

/* STATS */
.stats-row {
  max-width: 860px; margin: 0 auto; padding: 44px 48px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
}
.stat-item { position: relative; overflow: hidden; }
.stat-number {
  font-family: var(--serif); font-size: clamp(48px, 5vw, 72px);
  font-weight: 300; line-height: 1; color: var(--text);
  margin-bottom: 6px; letter-spacing: -0.02em; transition: color 0.3s;
}
.stat-item:hover .stat-number { color: var(--accent); }
.stat-label { font-size: 14px; color: var(--muted); }
.stat-bar { margin-top: 12px; height: 1px; background: var(--border); position: relative; overflow: hidden; }
.stat-bar::after {
  content: ''; position: absolute; top: 0; left: -100%;
  height: 100%; width: 100%; background: var(--accent);
  transition: left 1s cubic-bezier(.4,0,.2,1);
}
.stat-item.visible .stat-bar::after { left: 0; }

/* SECTIONS */
.section { max-width: 860px; margin: 0 auto; padding: 56px 48px; }
.section-eyebrow { font-size: 12px; font-weight: 500; letter-spacing: 0.06em; color: var(--muted); margin-bottom: 6px; }
.section-title {
  font-size: clamp(28px, 3.5vw, 44px); font-weight: 400;
  line-height: 1.2; margin-bottom: 28px; color: var(--text);
}
.section-title span { display: inline-block; border-bottom: 2px solid var(--accent); padding-bottom: 2px; }
.divider { width: 100%; height: 1px; background: var(--border); }

/* EDU */
.edu-card {
  padding: 36px 0; border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: start;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1);
}
.edu-card.visible { opacity: 1; transform: none; }
.edu-degree { font-size: 18px; font-weight: 500; margin-bottom: 3px; }
.edu-school { color: var(--muted); font-size: 13px; margin-bottom: 16px; }
.edu-period {
  font-family: var(--mono); font-size: 11px; color: var(--muted);
  white-space: nowrap; padding: 5px 12px;
  border: 1px solid var(--border); border-radius: 100px; height: fit-content;
}
.edu-details { list-style: none; }
.edu-details li { font-size: 13px; color: var(--muted); line-height: 1.8; padding: 3px 0 3px 14px; position: relative; }
.edu-details li::before { content: '–'; position: absolute; left: 0; color: var(--dim); }

/* EXP */
.exp-card {
  padding: 36px 0; border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: 160px 1fr; gap: 40px;
  opacity: 0; transform: translateX(-20px);
  transition: opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1);
}
.exp-card.visible { opacity: 1; transform: none; }
.exp-card:hover { background: rgba(26,122,94,0.02); }
.exp-period { font-family: var(--mono); font-size: 11px; color: var(--accent); margin-bottom: 6px; }
.exp-org { font-size: 12px; color: var(--muted); line-height: 1.5; }
.exp-title { font-size: 17px; font-weight: 500; margin-bottom: 14px; }
.exp-bullets { list-style: none; }
.exp-bullets li {
  font-size: 13px; color: var(--muted); line-height: 1.8;
  padding: 2px 0 2px 14px; position: relative; transition: color 0.2s;
}
.exp-bullets li::before { content: '–'; position: absolute; left: 0; color: var(--dim); }
.exp-card:hover .exp-bullets li { color: #666; }
.exp-link {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 14px;
  padding: 7px 18px; border: 1px solid var(--border); border-radius: 100px;
  font-size: 12px; font-weight: 500; letter-spacing: 0.04em;
  color: var(--muted); text-decoration: none; background: none;
  font-family: var(--sans);
  transition: border-color 0.2s, color 0.2s, transform 0.2s; cursor: none;
}
.exp-link:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }
.exp-link svg { flex-shrink: 0; }

/* SKILLS */
.skills-grid { display: flex; flex-direction: column; }
.skill-row {
  display: grid; grid-template-columns: 200px 1fr; gap: 32px;
  padding: 20px 0; border-bottom: 1px solid var(--border); align-items: start;
  opacity: 0; transform: translateY(12px); transition: opacity 0.5s, transform 0.5s;
}
.skill-row.visible { opacity: 1; transform: none; }
.skill-label { font-size: 12px; font-weight: 500; letter-spacing: 0.04em; color: var(--muted); padding-top: 4px; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag {
  padding: 5px 14px; border: 1px solid var(--border); border-radius: 100px;
  font-size: 12px; color: var(--text); background: var(--white); cursor: default;
  transition: border-color 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.skill-tag:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(26,122,94,0.12); }

/* LANG CARDS */
.lang-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px; }
.lang-card {
  background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 20px 16px;
  opacity: 0; transform: translateY(12px) scale(0.98); cursor: default;
  transition: opacity 0.5s, transform 0.5s, border-color 0.2s, box-shadow 0.3s;
}
.lang-card.visible { opacity: 1; transform: none; }
.lang-card:hover { border-color: var(--accent); box-shadow: 0 8px 24px rgba(26,122,94,0.1); transform: translateY(-4px) !important; }
.lang-name { font-family: var(--serif); font-size: 18px; font-weight: 500; margin-bottom: 4px; }
.lang-fluent .lang-name { color: var(--accent); }
.lang-level { font-size: 11px; color: var(--muted); font-family: var(--mono); }

/* CERTS */
.cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cert-card {
  background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 20px;
  font-size: 13px; color: var(--muted); line-height: 1.6; cursor: default;
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.5s, transform 0.5s, border-color 0.2s, box-shadow 0.3s;
}
.cert-card.visible { opacity: 1; transform: none; }
.cert-card:hover { border-color: var(--accent); box-shadow: 0 8px 24px rgba(26,122,94,0.1); transform: translateY(-3px) !important; }
.cert-card-img {
  width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 6px;
  margin-bottom: 12px; display: block; cursor: zoom-in;
  transition: transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s;
}
.cert-card:hover .cert-card-img { opacity: 0.88; transform: scale(1.02); }
.cert-card-label { font-size: 13px; color: var(--muted); line-height: 1.5; }

/* LIGHTBOX */
.lightbox-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(10,10,10,0.88); display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; backdrop-filter: blur(8px); cursor: zoom-out;
  transition: opacity 0.3s cubic-bezier(.4,0,.2,1);
}
.lightbox-overlay.open { opacity: 1; pointer-events: all; }
.lightbox-img {
  max-width: 90vw; max-height: 88vh; border-radius: 6px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5); transform: scale(0.92);
  transition: transform 0.35s cubic-bezier(.4,0,.2,1); object-fit: contain; cursor: default;
}
.lightbox-overlay.open .lightbox-img { transform: scale(1); }
.lightbox-close {
  position: absolute; top: 24px; right: 28px; color: rgba(255,255,255,0.7);
  font-size: 28px; background: none; border: none; cursor: pointer;
  line-height: 1; transition: color 0.2s; font-family: var(--sans);
}
.lightbox-close:hover { color: #fff; }

/* CONTACT */
.contact-section { max-width: 860px; margin: 0 auto; padding: 64px 48px; text-align: center; }
.contact-title { font-size: clamp(36px, 4.5vw, 56px); font-weight: 300; line-height: 1.2; margin-bottom: 16px; }
.contact-title em { font-style: normal; color: var(--accent); font-weight: 500; }
.contact-sub { color: var(--muted); font-size: 15px; margin-bottom: 40px; }
.contact-links { display: flex; gap: 12px; justify-content: center; }

footer {
  border-top: 1px solid var(--border); padding: 28px 48px;
  display: flex; align-items: center; justify-content: space-between;
}
.footer-name { font-family: var(--serif); font-size: 14px; color: var(--muted); }
.footer-note { font-size: 12px; color: var(--dim); font-family: var(--mono); }

.back-top {
  position: fixed; bottom: 32px; right: 32px; z-index: 100;
  width: 44px; height: 44px; background: var(--text); color: var(--white);
  border: none; border-radius: 50%; font-size: 18px; cursor: none;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: translateY(12px) scale(0.9);
  transition: opacity 0.3s, transform 0.3s, background 0.25s; pointer-events: none;
}
.back-top.show { opacity: 1; transform: none; pointer-events: all; }
.back-top:hover { background: var(--accent); transform: translateY(-2px) !important; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

@media (max-width: 768px) {
  .hero-left { padding: 96px 24px 40px; }
  .stats-row { grid-template-columns: 1fr; gap: 28px; padding: 40px 24px; }
  .section { padding: 40px 20px; }
  .edu-card { grid-template-columns: 1fr; gap: 8px; }
  .edu-period { order: -1; display: inline-flex; width: fit-content; }
  .exp-card { grid-template-columns: 1fr; gap: 8px; }
  .skill-row { grid-template-columns: 1fr; gap: 10px; }
  .lang-grid { grid-template-columns: repeat(3, 1fr); }
  .cert-grid { grid-template-columns: 1fr; }
  .contact-section { padding: 48px 20px; }
  footer { flex-direction: column; gap: 8px; text-align: center; padding: 24px 20px; }
  .back-top { bottom: 20px; right: 20px; }
}
@media (max-width: 400px) {
  .hero-title { font-size: clamp(28px, 9vw, 44px); }
}
`
// ── ALL CONTENT ──────────────────────────────────────────────
const content = {
  en: {
    navItems: [
      { id: 'education', label: 'Education' },
      { id: 'experience', label: 'Experience' },
      { id: 'skills', label: 'Skills' },
      { id: 'contact', label: 'Contact' },
    ],
    logo: 'Ploy',
    heroTag: 'Medical Engineering · Chemical Engineering',
    heroLine1: 'Engineering at the',
    heroLine2: <>intersection of <em>science</em></>,
    heroLine3: 'and ',
    typedPhrases: ['data & information.', 'health & impact.'],
    heroName: 'Waraitip Laosangprateep',
    heroBio1: "Master's in Medical Engineering at University of Auckland, with a foundation in Chemical Engineering from Thammasat University (SIIT). Research experience across New Zealand, Taiwan, and Thailand.",
    heroBio2: 'Bilingual communicator — native in Thai and proficient in English, with basic knowledge of Japanese and Korean. Passionate about cross-cultural collaboration.',
    heroAvail: 'Available from August 2026 · Open to Thailand, Korea, Singapore & beyond',
    heroBtn1: 'View my work →',
    heroBtn2: 'Get in touch',
    stats: [
      { number: '2', label: 'Engineering degrees' },
      { number: '3', label: 'Countries researched in' },
      { number: '2 + 2', label: 'Languages spoken' },
    ],
    eduEyebrow: 'Academic background',
    eduTitle: 'Education',
    edu: [
      {
        
      degree: 'Master of Medical Engineering',
      school: 'University of Auckland · New Zealand',
      period: '2025 – 2026',

      gpa: '7.00 / 9.00',

      thesis:
        'Quantitative mechanical characterisation of neonatal growth plate tissue using nanoindentation and microindentation.',

    details: [
    {
      title: "Master's Thesis",
      subtitle: 'Materials Characterisation & Data Analysis',

      link: 'https://profiles.auckland.ac.nz/ashvin-thambyah',
      linkLabel: 'Referee / Supervisor ↗',

      bullets: [
        'Designed and executed a systematic microindentation workflow to quantitatively characterise neonatal growth plate tissue.',
        'Applied statistical analysis to high-variance datasets and reconciled experimental findings with published literature.',
        'Managed the complete experimental pipeline, including cryogenic sample preparation, precision instrumentation, data acquisition, outlier investigation, and publication-quality reporting.'
       ],

        expertise: [
          'Materials Characterisation',
          'Microindentation',
          'Experimental Design',
          'Statistical Analysis',
          'Python',
          'Research'
      ]
      },

      {
      title: 'Academic Highlights',

        bullets: [
          'Built and validated supervised machine learning (SVM) models in Python for spectral classification.',
          'Completed postgraduate coursework in Advanced Functional Materials, Semiconductor & Materials Science, Medical Device Development, Advanced Imaging (OCT, MRI), Machine Learning, and Engineering Project Management.'
        ],

        expertise: [
          'Semiconductor',
          'Medical Devices',
          'Machine Learning',
          'Advanced Materials',
          'Engineering Management'
        ]
        }
        ]
      }
      {
        degree: 'Bachelor of Engineering — Chemical Engineering',
        school: 'Thammasat University (Sirindhorn International Institute of Technology (SIIT)) · Thailand',
        period: '2020 – 2024',
        details: [
          'GPA: 3.22 / 4.00 · International Programme, full English instruction',
          'Senior Project: Theoretical study on butylone inclusion complexes with β-cyclodextrin — presented at PACCON 2024',
         'Coursework: Chemical Reaction Engineering · Process Design · Plant Design · Thermodynamics · Heat & Mass Transfer · Fluid Mechanics · Environmental Engineering · Wastewater Treatment · Food Science · Safety in Chemical Operations · Analytical and Instrumental (XRD, FTIR, UV-Vis, Raman, XRF, NMR, AAS, ICP-OES, SEM, TEM, TGA, BET, GC, GC-MS, HPLC, LC-MS) · Computational Chemistry · Molecular Docking',
        ],
      },
    ],
    expEyebrow: 'Work & Research',
    expTitle: 'Experience',
    exp: [
      {
        period: 'Jun – Jul 2023', org: 'Academia Sinica, Taiwan',
        title: 'Research Intern — SWCNTs Defect Characterisation',
        link: 'https://www.iams.sinica.edu.tw/iip/intern_experience',
        bullets: [
          'Conducted independent experiments on SWCNTs using absorbance and fluorescence spectroscopy for cancer diagnostic applications',
          'Designed and executed DOE-style experiments; analysed spectral data using Origin Lab',
          'Gained proficiency in nanomaterial characterisation, medical imaging principles, and precision instrumentation',
        ],
      },
      {
        period: '2024 – 2026', org: 'Auckland, New Zealand',
        title: 'Customer Service & Operations', link: null,
        bullets: [
          "Retail and food service across Lily's Collection, Blue Elephant, Mi&Chi, Khao San Eatery, and The Coffee Club",
          'Maintained consistent performance across multiple customer-facing roles while completing a full-time postgraduate degree — demonstrating punctuality, reliability, multitasking, effective time management, and practical problem-solving under pressure.',
          'Operated POS systems, cash handling, and inter-departmental cooperation',
        ],
      },
    ],
    skillsEyebrow: 'Capabilities',
    skillsTitle: 'Skills',
    skills: [
      { label: 'Data & Computing', tags: ['Python', 'Machine Learning', 'Data Analysis', 'Statistical Analysis', 'SQL', 'Power BI', 'Origin Lab', 'Excel', 'Word', 'PowerPoint'] },
      { label: 'Engineering & Process', tags: ['Chemical Engineering', 'Process Engineering', 'P&ID', 'Process Flow Diagrams (PFD)', 'HAZOP / Process Safety', 'Mass & Energy Balances', 'Thermodynamics', 'Heat & Mass Transfer', 'Aspen Plus', 'HYSYS', 'Environmental Engineering', 'Wastewater Treatment', 'Food Science', 'Waste Management', 'Product Stewardship'] },
      { label: 'Biomedical & Lab', tags: ['Nanoindentation', 'Microindentation', 'Fluorescence Spectroscopy', 'Absorbance Spectroscopy', 'Medical Imaging', 'OCT', 'Functional Materials', 'Semiconductor', 'Nanotechnology', 'Nanomaterials', 'Biomedical Devices', 'Lab Skills'] },
      { label: 'Computational', tags: ['Computational Chemistry', 'Computational Modelling', 'Autodock', 'Gaussian / GaussView', 'Discovery Studio', 'Drug Discovery', 'Drug Disposition & Kinetics'] },
      { label: 'Quality & Regulatory', tags: ['GMP', 'ISO 13485', 'ISO 14971', 'IEC 60601', 'IEC 62366', 'FMEA', 'Fault Tree Analysis', 'CAPA', 'Six Sigma', 'Lean / Kaizen', 'DOE', 'SPC','ESG', 'LCA'] },
      { label: 'Project & Leadership', tags: ['Project Management', 'Cross-functional Leadership', 'Critical Thinking', 'Problem Solving', 'Time Management', 'Cross-Cultural Communication', 'Teamwork'] },
    ],
    langEyebrow: 'Languages',
    languages: [
      { name: 'Thai', level: 'Native', fluent: true },
      { name: 'English', level: 'IELTS 6.5 · TOEIC 830', fluent: true },
      { name: '日本語', level: 'Elementary', fluent: false },
      { name: '한국어', level: 'Elementary', fluent: false },
    ],
    certEyebrow: 'Credentials',
    certTitle: 'Certifications',
    certs: [
      { label: 'SQL Foundations', img: '/sql1.png' },
      { label: 'Data Manipulation and Transactions in SQL Server', img: '/sql2.png' },
      { label: 'Introduction to Semiconductor Process 1', img: '/kaist1.png' },
      { label: 'Introduction to Semiconductor Process 2', img: '/kaist2.png' },
      { label: 'Google Data Analysis with Python Specialization', img: '/google.jpeg' },
      { label: 'Poster Presentation — PACCON 2024 (Pure and Applied Chemistry International Conference)', img: '/paccon.jpeg' },
      { label: 'Internship Certificate — Academia Sinica, Institute of Atomic and Molecular Sciences, Taiwan', img: '/sinica.jpeg' },
    ],
    certBtn: 'View Certificate',
    visitBtn: 'Visit Programme',
    contactEyebrow: "Let's connect",
    contactTitle: <>Let&apos;s <em>work</em> together</>,
    contactSub: 'Open to opportunities in Thailand, Korea, Singapore, and beyond · Available from August 2026',
    emailBtn: 'Email me →',
    downloadCV: 'Download CV ↓',
    cvFile: '/CV_Waraitip_full.pdf',
    footerNote: 'Auckland, New Zealand · 2026',
  },
  th: {
    navItems: [
      { id: 'education', label: 'การศึกษา' },
      { id: 'experience', label: 'ประสบการณ์' },
      { id: 'skills', label: 'ทักษะ' },
      { id: 'contact', label: 'ติดต่อ' },
    ],
    logo: 'พลอย',
    heroTag: 'วิศวกรรมการแพทย์ · วิศวกรรมเคมี',
    heroLine1: 'วิศวกรรมศาสตร์ที่',
    heroLine2: <>จุดบรรจบของ<em>วิทยาศาสตร์</em></>,
    heroLine3: 'และ ',
    typedPhrases: ['ข้อมูลและสารสนเทศ', 'สุขภาพและนวัตกรรม'],
    heroName: 'วลัยทิพย์ เหล่าแสงประทีป',
    heroBio1: 'กำลังศึกษาระดับปริญญาโท สาขาวิศวกรรมการแพทย์ มหาวิทยาลัยออคแลนด์ ประเทศนิวซีแลนด์ จบการศึกษาปริญญาตรีสาขาวิศวกรรมเคมี จากมหาวิทยาลัยธรรมศาสตร์ (SIIT)',
    heroBio2: 'พูดไทยและอังกฤษได้คล่อง มีความรู้ภาษาญี่ปุ่นและเกาหลีเบื้องต้น ชื่นชอบการสื่อสารและทำงานข้ามวัฒนธรรม',
    heroAvail: 'พร้อมทำงานตั้งแต่ สิงหาคม 2569 · เปิดรับโอกาสในไทย เกาหลี สิงคโปร์ และทั่วโลก',
    heroBtn1: 'ดูผลงาน →',
    heroBtn2: 'ติดต่อฉัน',
    stats: [
      { number: '2', label: 'ปริญญาวิศวกรรม' },
      { number: '3', label: 'ประเทศที่มีประสบการณ์วิจัย' },
      { number: '2 + 2', label: 'ภาษาที่ใช้งานได้' },
    ],
    eduEyebrow: 'พื้นฐานทางวิชาการ',
    eduTitle: 'การศึกษา',
    edu: [
      {
        degree: 'ปริญญาโท วิศวกรรมการแพทย์',
        school: 'มหาวิทยาลัยออคแลนด์ (University of Auckland) · นิวซีแลนด์',
        period: '2568 – 2569',
        details: [
          'เกรดเฉลี่ย 7.00 / 9.00',
          'วิทยานิพนธ์: การศึกษาโครงสร้างระดับจุลภาค (Microstructural) และคุณสมบัติทางกล (Mechanical characterization) ของกระดูกอ่อน (cartilage) และแนวสร้างกระดูก (growth plate) ในลูกแกะแรกเกิด',
          'วิชาเรียน: วัสดุฟังก์ชันขั้นสูง · วิทยาศาสตร์เซมิคอนดักเตอร์ · การพัฒนาอุปกรณ์การแพทย์ · การถ่ายภาพขั้นสูง (OCT, MRI, อัลตราซาวด์) · Machine Learning สำหรับชีวการแพทย์ · การจัดการโครงการ · Drug Disposition & Kinetics · การจัดการของเสีย · Product Stewardship',
        ],
      },
      {
        degree: 'ปริญญาตรี วิศวกรรมเคมี',
        school: 'มหาวิทยาลัยธรรมศาสตร์ (Sirindhorn International Institute of Technology (SIIT)) · ประเทศไทย',
        period: '2563 – 2567',
        details: [
          'เกรดเฉลี่ย 3.22 / 4.00 · หลักสูตรนานาชาติ สอนเป็นภาษาอังกฤษทั้งหมด',
          'โปรเจกต์จบ: การศึกษาเชิงทฤษฎีของ inclusion complex ระหว่าง butylone กับ β-cyclodextrin — นำเสนอที่ PACCON 2024',
         'วิชาเรียน: Chemical Reaction Engineering · Process Design · Plant Design · เทอร์โมไดนามิกส์ · การถ่ายเทความร้อนและมวล · กลศาสตร์ของไหล · วิศวกรรมสิ่งแวดล้อม · บำบัดน้ำเสีย · วิทยาศาสตร์อาหาร ·ความปลอดภัยในการปฏิบัติการทางเคมี · การวิเคราะห์และเครื่องมือวัด (XRD, FTIR, UV-Vis, Raman, XRF, NMR, AAS, ICP-OES, SEM, TEM, TGA, BET, GC, GC-MS, HPLC, LC-MS) · Computational Chemistry · Molecular Docking',
        ],
      },
    ],
    expEyebrow: 'งานและการวิจัย',
    expTitle: 'ประสบการณ์',
    exp: [
      {
        period: '2568 – ปัจจุบัน', org: 'มหาวิทยาลัยออคแลนด์',
        title: 'วิทยานิพนธ์ระดับปริญญาโท', link: 'https://profiles.auckland.ac.nz/ashvin-thambyah',
        linkLabel: 'อาจารย์ที่ปรึกษา / ผู้รับรอง ↗',
        bullets: [
          'ทดสอบสมบัติทางกลด้วย microindentation บนตัวอย่างเนื้อเยื่อชีวภาพใน articular cartilage และ growth plate sub-structures',
          'วิเคราะห์และประเมินข้อมูลเชิงปริมาณ เพื่อสรุปผลจากหลักฐานเชิงประจักษ์',
          'พัฒนาความเชี่ยวชาญด้านเครื่องมือวัดละเอียด การเตรียมตัวอย่าง และการตีความข้อมูล',
        ],
      },
      {
        period: 'มิ.ย. – ก.ค. 2566', org: 'Academia Sinica ไต้หวัน',
        title: 'นักศึกษาฝึกงานวิจัย — การตรวจสอบข้อบกพร่องของ SWCNTs',
        link: 'https://www.iams.sinica.edu.tw/iip/intern_experience',
        bullets: [
          'ทำการทดลองอิสระบน SWCNTs ด้วย absorbance และ fluorescence spectroscopy สำหรับการวินิจฉัยมะเร็ง',
          'ออกแบบและดำเนินการทดลองแบบ DOE และวิเคราะห์ข้อมูลสเปกตรัมด้วย Origin Lab',
          'เพิ่มพูนทักษะด้านการตรวจสอบนาโนวัสดุ หลักการ medical imaging และเครื่องมือวัดความละเอียดสูง',
        ],
      },
      {
        period: '2567 – 2569', org: 'ออคแลนด์ นิวซีแลนด์',
        title: 'บริการลูกค้าและปฏิบัติการ', link: null,
        bullets: [
          "ทำงานในร้านค้าปลีกและอาหารในออคแลนด์ — Lily's Collection, Blue Elephant, Mi&Chi, Khao San Eatery และ The Coffee Club",
          'รักษาผลการปฏิบัติงานที่สม่ำเสมอในหลายบทบาทด้านการบริการลูกค้า ควบคู่กับการศึกษาระดับปริญญาโทเต็มเวลา — แสดงให้เห็นถึงความตรงต่อเวลา ความน่าเชื่อถือ การทำงานหลายอย่างพร้อมกัน การบริหารเวลา และการแก้ปัญหาเฉพาะหน้าภายใต้แรงกดดัน',
          'ใช้งานระบบ POS จัดการเงินสด และประสานงานระหว่างแผนก',
        ],
      },
    ],
    skillsEyebrow: 'ความสามารถ',
    skillsTitle: 'ทักษะ',
    skills: [
      { label: 'ข้อมูลและคอมพิวเตอร์', tags: ['Python', 'Machine Learning', 'วิเคราะห์ข้อมูล', 'สถิติ', 'SQL', 'Power BI', 'Origin Lab', 'Excel', 'Word', 'PowerPoint'] },
      { label: 'วิศวกรรมและกระบวนการ', tags: ['วิศวกรรมเคมี', 'วิศวกรรมกระบวนการ', 'P&ID', 'Process Flow Diagrams (PFD)', 'HAZOP / Process Safety', 'Mass & Energy Balances', 'เทอร์โมไดนามิกส์', 'การถ่ายเทความร้อนและมวล', 'Aspen Plus', 'HYSYS', 'วิศวกรรมสิ่งแวดล้อม', 'บำบัดน้ำเสีย', 'วิทยาศาสตร์อาหาร', 'การจัดการของเสีย', 'Product Stewardship'] },
      { label: 'ชีวการแพทย์และห้องปฏิบัติการ', tags: ['Nanoindentation', 'Microindentation', 'Fluorescence Spectroscopy', 'Absorbance Spectroscopy', 'Medical Imaging', 'OCT', 'วัสดุฟังก์ชัน', 'Semiconductor', 'Nanotechnology', 'Nanomaterials', 'อุปกรณ์การแพทย์', 'ทักษะห้องปฏิบัติการ'] },
      { label: 'การคำนวณ', tags: ['Computational Chemistry', 'Computational Modelling', 'Autodock', 'Gaussian / GaussView', 'Discovery Studio', 'Drug Discovery', 'Drug Disposition & Kinetics'] },
      { label: 'คุณภาพและกฎระเบียบ', tags: ['GMP', 'ISO 13485', 'ISO 14971', 'IEC 60601', 'IEC 62366', 'FMEA', 'Fault Tree Analysis', 'CAPA', 'Six Sigma', 'Lean / Kaizen', 'DOE', 'SPC','ESG','LCA'] },
      { label: 'การจัดการและภาวะผู้นำ', tags: ['การบริหารโครงการ', 'นำทีมข้ามสายงาน', 'คิดวิเคราะห์', 'แก้ปัญหา', 'บริหารเวลา', 'สื่อสารข้ามวัฒนธรรม', 'ทำงานเป็นทีม'] },
    ],
    langEyebrow: 'ภาษา',
    languages: [
      { name: 'ไทย', level: 'ภาษาแม่', fluent: true },
      { name: 'English', level: 'IELTS 6.5 · TOEIC 830', fluent: true },
      { name: '日本語', level: 'ระดับต้น', fluent: false },
      { name: '한국어', level: 'ระดับต้น', fluent: false },
    ],
    certEyebrow: 'ใบรับรอง',
    certTitle: 'เกียรติบัตรและประกาศนียบัตร',
    certs: [
      { label: 'SQL Foundations', img: '/sql1.png' },
      { label: 'Data Manipulation and Transactions in SQL Server', img: '/sql2.png' },
      { label: 'Introduction to Semiconductor Process 1', img: '/kaist1.png' },
      { label: 'Introduction to Semiconductor Process 2', img: '/kaist2.png' },
      { label: 'Google Data Analysis with Python Specialization', img: '/google.jpeg' },
      { label: 'Poster Presentation — PACCON 2024 (การประชุมเคมีนานาชาติ Pure and Applied Chemistry)', img: '/paccon.jpeg' },
      { label: 'ใบรับรองการฝึกงาน — Academia Sinica สถาบันวิทยาศาสตร์อะตอมและโมเลกุล ไต้หวัน', img: '/sinica.jpeg' },
    ],
    certBtn: 'ดูใบรับรอง',
    visitBtn: 'เยี่ยมชมโครงการ',
    contactEyebrow: 'มาทำงานด้วยกัน',
    contactTitle: <>พร้อม<em>ร่วมงาน</em>กับคุณ</>,
    contactSub: 'เปิดรับโอกาสในไทย เกาหลี สิงคโปร์ และทั่วโลก · พร้อมทำงานตั้งแต่สิงหาคม 2569',
    emailBtn: 'ส่งอีเมล →',
    downloadCV: 'ดาวน์โหลด CV ↓',
    cvFile: '/CV_Waraitip_full.pdf',
    footerNote: 'ออคแลนด์ นิวซีแลนด์ · 2569',
  },
} as const

type Lang = 'en' | 'th'

export default function Home() {
  const [lang, setLang] = useState<Lang>('en')
  const [switching, setSwitching] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const switchLang = (next: Lang) => {
    if (next === lang) return
    setSwitching(true)
    setTimeout(() => { setLang(next); setSwitching(false) }, 250)
  }

  const t = content[lang]

  useEffect(() => {
    if (typingRef.current) clearTimeout(typingRef.current)
    const el = document.getElementById('typed-text')
    if (el) el.textContent = ''
    const phrases = t.typedPhrases
    let pi = 0, ci = 0, deleting = false
    const type = () => {
      if (!el) return
      const phrase = phrases[pi]
      if (!deleting) {
        el.textContent = phrase.slice(0, ++ci)
        if (ci === phrase.length) { deleting = true; typingRef.current = setTimeout(type, 1800); return }
      } else {
        el.textContent = phrase.slice(0, --ci)
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length }
      }
      typingRef.current = setTimeout(type, deleting ? 60 : 90)
    }
    typingRef.current = setTimeout(type, lang === 'en' ? 1200 : 300)
    return () => { if (typingRef.current) clearTimeout(typingRef.current) }
  }, [lang])

  useEffect(() => {
    const bar = document.getElementById('scroll-bar')
    const handleScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (bar) bar.style.width = `${pct * 100}%`
      document.getElementById('main-nav')?.classList.toggle('scrolled', window.scrollY > 40)
      document.getElementById('back-top')?.classList.toggle('show', window.scrollY > 400)
      const ids = ['education', 'experience', 'skills', 'contact']
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(id); break }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

    const dot = cursorDotRef.current
    const ring = cursorRingRef.current
    const moveCursor = (e: MouseEvent) => {
      if (dot) { dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px` }
      if (ring) { ring.style.left = `${e.clientX}px`; ring.style.top = `${e.clientY}px` }
    }
    const onEnter = () => ring?.classList.add('hovered')
    const onLeave = () => ring?.classList.remove('hovered')
    const addHovers = () => document.querySelectorAll('a,button,.skill-tag,.lang-card,.cert-card,.exp-card').forEach(el => {
      el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave)
    })
    window.addEventListener('mousemove', moveCursor)
    addHovers(); setTimeout(addHovers, 800)

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxSrc(null) }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.remove('visible'); observer.observe(el)
    })
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('visible'))
    }, 600)
    return () => observer.disconnect()
  }, [lang])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="cursor-dot" ref={cursorDotRef} />
      <div className="cursor-ring" ref={cursorRingRef} />
      <div className="scroll-progress" id="scroll-bar" />
      <button className="back-top" id="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>

      {lightboxSrc && (
        <div className="lightbox-overlay open" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
          <img className="lightbox-img" src={lightboxSrc} alt="Certificate" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {t.navItems.map(n => (
          <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)}>{n.label}</a>
        ))}
        <div className="mobile-lang">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => { switchLang('en'); setMenuOpen(false) }}>EN</button>
          <button className={lang === 'th' ? 'active' : ''} onClick={() => { switchLang('th'); setMenuOpen(false) }}>TH</button>
        </div>
      </div>

      <nav id="main-nav">
        <a href="#" className="nav-logo">{t.logo}</a>
        <ul className="nav-links">
          {t.navItems.map(n => (
            <li key={n.id}><a href={`#${n.id}`} className={activeSection === n.id ? 'active' : ''}>{n.label}</a></li>
          ))}
        </ul>
        <div className="lang-toggle">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => switchLang('en')}>EN</button>
          <button className={lang === 'th' ? 'active' : ''} onClick={() => switchLang('th')}>TH</button>
        </div>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`lang-fade${switching ? ' switching' : ''}`}>
        {/* HERO */}
        <section className="hero">
          <div className="hero-left">
            <div className="hero-tag">{t.heroTag}</div>
            <h1 className="hero-title">
              {t.heroLine1}<br />
              {t.heroLine2}<br />
              {t.heroLine3}<span id="typed-text" /><span className="typed-cursor" />
            </h1>
            <p className="hero-name">{t.heroName}</p>
            <p className="hero-bio">{t.heroBio1}</p>
            <p className="hero-bio">{t.heroBio2}</p>
            <p className="hero-avail">{t.heroAvail}</p>
            <div className="hero-btns">
              <a href="#experience" className="btn-primary">{t.heroBtn1}</a>
              <a href="#contact" className="btn-outline">{t.heroBtn2}</a>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats-row">
          {t.stats.map((s, i) => (
            <div key={i} className="stat-item animate-on-scroll" style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-bar" />
            </div>
          ))}
        </div>
        <div className="divider" />

        {/* EDUCATION */}
        <section className="section" id="education">
          <p className="section-eyebrow">{t.eduEyebrow}</p>
          <h2 className="section-title"><span>{t.eduTitle}</span></h2>
          {t.edu.map((e, i) => (
            <div key={i} className="edu-card animate-on-scroll" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div>
                <h3 className="edu-degree">{e.degree}</h3>
                <p className="edu-school">{e.school}</p>
                <ul className="edu-details">{e.details.map((d, j) => <li key={j}>{d}</li>)}</ul>
              </div>
              <span className="edu-period">{e.period}</span>
            </div>
          ))}
        </section>
        <div className="divider" />

        {/* EXPERIENCE */}
        <section className="section" id="experience">
          <p className="section-eyebrow">{t.expEyebrow}</p>
          <h2 className="section-title"><span>{t.expTitle}</span></h2>
          {t.exp.map((e, i) => (
            <div key={i} className="exp-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div><p className="exp-period">{e.period}</p><p className="exp-org">{e.org}</p></div>
              <div>
                <h3 className="exp-title">{e.title}</h3>
                <ul className="exp-bullets">{e.bullets.map((b, j) => <li key={j} dangerouslySetInnerHTML={{ __html: b }} />)}</ul>
                {e.link && (
                  <a href={e.link} target="_blank" rel="noreferrer" className="exp-link">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M10 2H5M10 2V7" /></svg>
                    {(e as any).linkLabel ?? t.visitBtn}
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>
        <div className="divider" />

        {/* SKILLS */}
        <section className="section" id="skills">
          <p className="section-eyebrow">{t.skillsEyebrow}</p>
          <h2 className="section-title"><span>{t.skillsTitle}</span></h2>
          <div className="skills-grid">
            {t.skills.map((row, i) => (
              <div key={i} className="skill-row animate-on-scroll" style={{ transitionDelay: `${i * 0.06}s` }}>
                <span className="skill-label">{row.label}</span>
                <div className="skill-tags">{row.tags.map(tag => <span key={tag} className="skill-tag">{tag}</span>)}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <p className="section-eyebrow" style={{ marginBottom: 8 }}>{t.langEyebrow}</p>
            <div className="lang-grid">
              {t.languages.map((l, i) => (
                <div key={i} className={`lang-card animate-on-scroll${l.fluent ? ' lang-fluent' : ''}`} style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="lang-name">{l.name}</div>
                  <div className="lang-level">{l.level}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="divider" />

        {/* CERTIFICATIONS */}
        <section className="section">
          <p className="section-eyebrow">{t.certEyebrow}</p>
          <h2 className="section-title"><span>{t.certTitle}</span></h2>
          <div className="cert-grid">
            {t.certs.map((c, i) => (
              <div key={i} className="cert-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
                <img className="cert-card-img" src={c.img} alt={c.label} onClick={() => setLightboxSrc(c.img)} />
                <div className="cert-card-label">{c.label}</div>
                <button className="exp-link" style={{ marginTop: 14 }} onClick={() => setLightboxSrc(c.img)}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 1h5v5M11 1L5 7M2 4H1v7h7v-1" /></svg>
                  {t.certBtn}
                </button>
              </div>
            ))}
          </div>
        </section>
        <div className="divider" />

        {/* CONTACT */}
        <section className="contact-section" id="contact">
          <p className="section-eyebrow" style={{ marginBottom: 16 }}>{t.contactEyebrow}</p>
          <h2 className="contact-title">{t.contactTitle}</h2>
          <p className="contact-sub">{t.contactSub}</p>
          <div className="contact-links">
            <a href="mailto:Waraitip.l26@gmail.com" className="btn-primary">{t.emailBtn}</a>
            <a href="https://www.linkedin.com/in/waraitip-laosangprateep-b33933388" target="_blank" rel="noreferrer" className="btn-outline">LinkedIn ↗</a>
            <a href={t.cvFile} download className="btn-outline">{t.downloadCV}</a>
          </div>
        </section>

        <footer>
          <span className="footer-name">{t.heroName}</span>
          <span className="footer-note">{t.footerNote}</span>
        </footer>
      </div>
    </>
  )
}

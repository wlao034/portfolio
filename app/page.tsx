'use client'
import { useEffect, useRef, useState } from 'react'

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f5f3ef;
  --white: #ffffff;
  --border: #e8e4de;
  --text: #1a1a1a;
  --muted: #888880;
  --dim: #d0ccc4;
  --accent: #1a7a5e;
  --accent2: #2a6496;
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans: 'DM Sans', sans-serif;
  --mono: 'DM Mono', monospace;
}

html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.7;
  overflow-x: hidden;
  cursor: none;
}

/* CUSTOM CURSOR */
.cursor-dot {
  position: fixed; top: 0; left: 0; z-index: 9999;
  width: 8px; height: 8px;
  background: var(--accent);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 0.1s, width 0.3s, height 0.3s, background 0.3s;
}
.cursor-ring {
  position: fixed; top: 0; left: 0; z-index: 9998;
  width: 36px; height: 36px;
  border: 1.5px solid var(--accent);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 0.08s linear, width 0.35s cubic-bezier(.4,0,.2,1), height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.3s;
  opacity: 0.5;
}
.cursor-ring.hovered { width: 60px; height: 60px; opacity: 0.25; }
@media (hover: none) {
  .cursor-dot, .cursor-ring { display: none; }
  body { cursor: auto; }
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--dim); }

/* PROGRESS BAR */
.scroll-progress {
  position: fixed; top: 0; left: 0; z-index: 200;
  height: 2px; background: var(--accent);
  width: 0%; transition: width 0.1s linear;
}

/* NAV */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 48px;
  border-bottom: 1px solid transparent;
  transition: border-color 0.4s, background 0.4s, backdrop-filter 0.4s, padding 0.4s;
}
nav.scrolled {
  border-color: var(--border);
  background: rgba(245,243,239,0.92);
  backdrop-filter: blur(20px);
  padding-top: 14px; padding-bottom: 14px;
}
.nav-logo {
  font-family: var(--serif);
  font-size: 22px; font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--text); text-decoration: none;
  transition: color 0.2s;
}
.nav-logo:hover { color: var(--accent); }
.nav-links { display: flex; gap: 36px; list-style: none; }
.nav-links a {
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--muted); text-decoration: none;
  transition: color 0.2s;
  position: relative;
}
.nav-links a::after {
  content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
  height: 1px; background: var(--accent);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.nav-links a:hover { color: var(--text); }
.nav-links a:hover::after { transform: scaleX(1); }
.nav-links a.active { color: var(--text); }
.nav-links a.active::after { transform: scaleX(1); }

/* HAMBURGER */
.hamburger {
  display: none; flex-direction: column; gap: 5px; cursor: pointer;
  padding: 4px; background: none; border: none; z-index: 110;
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
  position: fixed; inset: 0; z-index: 99;
  background: var(--bg);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 40px;
  opacity: 0; pointer-events: none;
  transition: opacity 0.35s cubic-bezier(.4,0,.2,1);
}
.mobile-menu.open { opacity: 1; pointer-events: all; }
.mobile-menu a {
  font-family: var(--serif);
  font-size: clamp(36px, 8vw, 52px);
  font-weight: 300;
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

@media (max-width: 768px) {
  nav { padding: 16px 20px; }
  .hamburger { display: flex; }
  .nav-links { display: none; }
}

/* HERO */
.hero {
  min-height: 100vh;
  display: flex;
  background: var(--bg);
  position: relative;
  overflow: hidden;
}
/* animated grain overlay */
.hero::before {
  content: '';
  position: absolute; inset: 0; z-index: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  pointer-events: none;
}
.hero-left {
  display: flex; flex-direction: column; justify-content: center;
  padding: 120px 64px 80px 64px;
  position: relative; z-index: 1;
}
.hero-tag {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 48px;
  opacity: 0; animation: fadeUp 0.7s 0.1s forwards;
}
.hero-tag::before { content: ''; width: 28px; height: 1px; background: var(--dim); }
.hero-title {
  font-family: var(--serif);
  font-size: clamp(36px, 6vw, 80px);
  font-weight: 300; line-height: 1.05;
  letter-spacing: -0.01em; margin-bottom: 32px;
  color: var(--text);
  opacity: 0; animation: fadeUp 0.7s 0.2s forwards;
}
.hero-title em { font-style: italic; color: var(--accent); font-weight: 300; }
.hero-name {
  font-family: var(--serif);
  font-size: 22px; font-weight: 500;
  color: var(--text); margin-bottom: 10px;
  opacity: 0; animation: fadeUp 0.7s 0.32s forwards;
}
.hero-bio {
  font-size: 14px; color: var(--muted);
  max-width: 420px; line-height: 1.85; margin-bottom: 10px;
  opacity: 0; animation: fadeUp 0.7s 0.4s forwards;
}
.hero-avail {
  font-family: var(--mono); font-size: 11px;
  color: var(--accent); letter-spacing: 0.05em;
  margin-top: 16px; margin-bottom: 48px;
  opacity: 0; animation: fadeUp 0.7s 0.48s forwards;
}
.hero-avail::before {
  content: '▸ '; opacity: 0.6;
}
.hero-btns {
  display: flex; gap: 12px; flex-wrap: wrap;
  opacity: 0; animation: fadeUp 0.7s 0.56s forwards;
}

/* TYPING CURSOR */
.typed-cursor {
  display: inline-block;
  width: 2px; height: 0.85em;
  background: var(--accent);
  margin-left: 2px; vertical-align: middle;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.btn-primary {
  padding: 13px 28px;
  background: var(--text); color: var(--white);
  border: none; border-radius: 100px;
  font-family: var(--sans); font-size: 13px; font-weight: 500;
  text-decoration: none; cursor: none;
  transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
  display: inline-flex; align-items: center; gap: 6px;
}
.btn-primary:hover {
  background: var(--accent); transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(26,122,94,0.25);
}
.btn-outline {
  padding: 13px 28px;
  background: transparent; color: var(--muted);
  border: 1px solid var(--border); border-radius: 100px;
  font-family: var(--sans); font-size: 13px; font-weight: 500;
  text-decoration: none; cursor: none;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}
.btn-outline:hover { border-color: var(--text); color: var(--text); transform: translateY(-2px); }



/* STATS */
.stats-row {
  max-width: 860px; margin: 0 auto;
  padding: 44px 48px;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.stat-item { position: relative; overflow: hidden; }
.stat-number {
  font-family: var(--serif);
  font-size: clamp(48px, 5vw, 72px);
  font-weight: 300; line-height: 1;
  color: var(--text); margin-bottom: 6px;
  letter-spacing: -0.02em;
  transition: color 0.3s;
}
.stat-item:hover .stat-number { color: var(--accent); }
.stat-label { font-size: 13px; color: var(--muted); }
.stat-bar {
  margin-top: 12px;
  height: 1px; background: var(--border);
  position: relative; overflow: hidden;
}
.stat-bar::after {
  content: '';
  position: absolute; top: 0; left: -100%;
  height: 100%; width: 100%; background: var(--accent);
  transition: left 1s cubic-bezier(.4,0,.2,1);
}
.stat-item.visible .stat-bar::after { left: 0; }

/* SECTIONS */
.section { max-width: 860px; margin: 0 auto; padding: 56px 48px; }
.section-eyebrow {
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 6px;
}
.section-title {
  font-family: var(--serif);
  font-size: clamp(32px, 3.5vw, 48px);
  font-weight: 400; line-height: 1.15;
  margin-bottom: 28px; color: var(--text);
}
.section-title span {
  display: inline-block;
  border-bottom: 2px solid var(--accent);
  padding-bottom: 2px;
}
.divider { width: 100%; height: 1px; background: var(--border); }

/* EDUCATION */
.edu-card {
  padding: 36px 0; border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: 1fr auto;
  gap: 24px; align-items: start;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1);
}
.edu-card.visible { opacity: 1; transform: none; }
.edu-degree { font-family: var(--serif); font-size: 20px; font-weight: 500; margin-bottom: 3px; }
.edu-school { color: var(--muted); font-size: 13px; margin-bottom: 16px; }
.edu-period {
  font-family: var(--mono); font-size: 11px; color: var(--muted);
  white-space: nowrap;
  padding: 5px 12px; border: 1px solid var(--border); border-radius: 100px;
  height: fit-content;
}
.edu-details { list-style: none; }
.edu-details li {
  font-size: 13px; color: var(--muted); line-height: 1.7;
  padding: 3px 0 3px 14px; position: relative;
}
.edu-details li::before { content: '–'; position: absolute; left: 0; color: var(--dim); }

/* EXPERIENCE */
.exp-card {
  padding: 36px 0; border-bottom: 1px solid var(--border);
  display: grid; grid-template-columns: 160px 1fr; gap: 40px;
  opacity: 0; transform: translateX(-20px);
  transition: opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1);
  cursor: default;
}
.exp-card.visible { opacity: 1; transform: none; }
.exp-card:hover { background: rgba(26,122,94,0.02); }
.exp-period { font-family: var(--mono); font-size: 11px; color: var(--accent); margin-bottom: 6px; }
.exp-org { font-size: 12px; color: var(--muted); line-height: 1.5; }
.exp-title { font-family: var(--serif); font-size: 19px; font-weight: 500; margin-bottom: 14px; }
.exp-bullets { list-style: none; }
.exp-bullets li {
  font-size: 13px; color: var(--muted); line-height: 1.7;
  padding: 2px 0 2px 14px; position: relative;
  transition: color 0.2s;
}
.exp-bullets li::before { content: '–'; position: absolute; left: 0; color: var(--dim); }
.exp-card:hover .exp-bullets li { color: #666; }

/* SKILLS */
.skills-grid { display: flex; flex-direction: column; }
.skill-row {
  display: grid; grid-template-columns: 200px 1fr;
  gap: 32px; padding: 20px 0;
  border-bottom: 1px solid var(--border); align-items: start;
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.5s, transform 0.5s;
}
.skill-row.visible { opacity: 1; transform: none; }
.skill-label { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding-top: 4px; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag {
  padding: 5px 14px;
  border: 1px solid var(--border); border-radius: 100px;
  font-size: 12px; color: var(--text);
  background: var(--white);
  transition: border-color 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
  cursor: default;
}
.skill-tag:hover {
  border-color: var(--accent); color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26,122,94,0.12);
}

/* LANGUAGES */
.lang-grid {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 16px; margin-top: 32px;
}
.lang-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px 16px;
  opacity: 0; transform: translateY(12px) scale(0.98);
  transition: opacity 0.5s, transform 0.5s, border-color 0.2s, box-shadow 0.3s;
  cursor: default;
}
.lang-card.visible { opacity: 1; transform: none; }
.lang-card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 24px rgba(26,122,94,0.1);
  transform: translateY(-4px) !important;
}
.lang-name { font-family: var(--serif); font-size: 18px; font-weight: 500; margin-bottom: 4px; }
.lang-fluent .lang-name { color: var(--accent); }
.lang-level { font-size: 11px; color: var(--muted); font-family: var(--mono); }

/* CERTIFICATIONS */
.cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cert-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px;
  font-size: 13px; color: var(--muted); line-height: 1.6;
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.5s, transform 0.5s, border-color 0.2s, box-shadow 0.3s;
  cursor: default;
}
.cert-card.visible { opacity: 1; transform: none; }
.cert-card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 24px rgba(26,122,94,0.1);
  transform: translateY(-3px) !important;
}

/* CONTACT */
.contact-section {
  max-width: 860px; margin: 0 auto;
  padding: 64px 48px; text-align: center;
}
.contact-title {
  font-family: var(--serif);
  font-size: clamp(40px, 4.5vw, 60px);
  font-weight: 300; line-height: 1.1; margin-bottom: 16px;
}
.contact-title em { font-style: italic; color: var(--accent); }
.contact-sub { color: var(--muted); font-size: 14px; margin-bottom: 40px; }
.contact-links { display: flex; gap: 12px; justify-content: center; }

/* FOOTER */
footer {
  border-top: 1px solid var(--border);
  padding: 28px 48px;
  display: flex; align-items: center; justify-content: space-between;
}
.footer-name { font-family: var(--serif); font-size: 14px; color: var(--muted); }
.footer-note { font-size: 12px; color: var(--dim); font-family: var(--mono); }

/* ANIMATIONS */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: none; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* TOOLTIP */
.skill-tag[data-tip]:hover::before {
  content: none;
}


/* LIGHTBOX */
.lightbox-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(10,10,10,0.88);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s cubic-bezier(.4,0,.2,1);
  backdrop-filter: blur(8px);
  cursor: zoom-out;
}
.lightbox-overlay.open { opacity: 1; pointer-events: all; }
.lightbox-img {
  max-width: 90vw; max-height: 88vh;
  border-radius: 6px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5);
  transform: scale(0.92);
  transition: transform 0.35s cubic-bezier(.4,0,.2,1);
  object-fit: contain;
  cursor: default;
}
.lightbox-overlay.open .lightbox-img { transform: scale(1); }
.lightbox-close {
  position: absolute; top: 24px; right: 28px;
  color: rgba(255,255,255,0.7); font-size: 28px;
  background: none; border: none; cursor: pointer;
  line-height: 1; transition: color 0.2s;
  font-family: var(--sans);
}
.lightbox-close:hover { color: #fff; }

/* CERT CARD clickable */
.cert-card { cursor: zoom-in; }
.cert-card-img {
  width: 100%; aspect-ratio: 4/3; object-fit: cover;
  border-radius: 6px; margin-bottom: 12px;
  display: block;
  transition: opacity 0.3s;
}
.cert-card:hover .cert-card-img { opacity: 0.88; }
.cert-card-label { font-size: 13px; color: var(--muted); line-height: 1.5; }

/* VISIT LINK button inside exp-card */
.exp-link {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 14px;
  padding: 7px 18px;
  border: 1px solid var(--border); border-radius: 100px;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--muted); text-decoration: none;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}
.exp-link:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }
.exp-link svg { flex-shrink: 0; }

/* BACK TO TOP */
.back-top {
  position: fixed; bottom: 32px; right: 32px; z-index: 100;
  width: 44px; height: 44px;
  background: var(--text); color: var(--white);
  border: none; border-radius: 50%;
  font-size: 18px; cursor: none;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: translateY(12px) scale(0.9);
  transition: opacity 0.3s, transform 0.3s, background 0.25s;
  pointer-events: none;
}
.back-top.show { opacity: 1; transform: none; pointer-events: all; }
.back-top:hover { background: var(--accent); transform: translateY(-2px) !important; }

/* MOBILE */
@media (max-width: 768px) {
  .hero { flex-direction: column; }
  .stats-row { grid-template-columns: 1fr; gap: 28px; padding: 48px 24px; }
  .section { padding: 40px 20px; }
  .edu-card { grid-template-columns: 1fr; gap: 8px; }
  .edu-period { order: -1; display: inline-flex; width: fit-content; }
  .exp-card { grid-template-columns: 1fr; gap: 8px; }
  .skill-row { grid-template-columns: 1fr; gap: 10px; }
  .lang-grid { grid-template-columns: repeat(2, 1fr); }
  .cert-grid { grid-template-columns: 1fr; }
  .contact-section { padding: 64px 20px; }
  footer { flex-direction: column; gap: 8px; text-align: center; padding: 24px 20px; }
  .back-top { bottom: 20px; right: 20px; }
}
@media (max-width: 400px) {
  .lang-grid { grid-template-columns: 1fr 1fr; }
  .hero-title { font-size: clamp(30px, 9vw, 50px); }
}
`

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [lightboxSrc, setLightboxSrc] = useState<string|null>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Scroll progress bar
    const bar = document.getElementById('scroll-bar')
    const handleScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (bar) bar.style.width = `${pct * 100}%`

      // Nav
      document.getElementById('main-nav')?.classList.toggle('scrolled', window.scrollY > 40)

      // Back to top
      document.getElementById('back-top')?.classList.toggle('show', window.scrollY > 400)

      // Active nav section
      const sections = ['education','experience','skills','contact']
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id); break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Scroll observer
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      })
    }, { threshold: 0.08 })
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

    // Typing effect for hero title
    const phrases = ['science & data.', 'health & impact.', 'nations & culture.']
    let pi = 0, ci = 0, deleting = false
    const el = document.getElementById('typed-text')
    const type = () => {
      if (!el) return
      const phrase = phrases[pi]
      if (!deleting) {
        el.textContent = phrase.slice(0, ++ci)
        if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return }
      } else {
        el.textContent = phrase.slice(0, --ci)
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length }
      }
      setTimeout(type, deleting ? 50 : 80)
    }
    setTimeout(type, 1200)

    // Cursor
    const dot = cursorDotRef.current
    const ring = cursorRingRef.current
    let rx = 0, ry = 0
    const moveCursor = (e: MouseEvent) => {
      if (dot) { dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px` }
      rx += (e.clientX - rx) * 0.12
      ry += (e.clientY - ry) * 0.12
      if (ring) { ring.style.left = `${e.clientX}px`; ring.style.top = `${e.clientY}px` }
    }
    const hoverEls = () => document.querySelectorAll('a,button,.skill-tag,.lang-card,.cert-card,.exp-card')
    const onEnter = () => ring?.classList.add('hovered')
    const onLeave = () => ring?.classList.remove('hovered')
    window.addEventListener('mousemove', moveCursor)
    const addHovers = () => hoverEls().forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave) })
    addHovers()
    setTimeout(addHovers, 1000)

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxSrc(null) }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const skills = [
    { label: 'Data & Computing', tags: ['Python', 'Machine Learning', 'Data Analysis', 'Statistical Analysis', 'Tableau', 'Power BI', 'Origin Lab', 'Excel', 'Word', 'PowerPoint'] },
    { label: 'Engineering & Process', tags: ['Chemical Engineering', 'Process Engineering', 'Thermodynamics', 'Heat & Mass Transfer', 'Aspen Plus', 'Environmental Engineering', 'Wastewater Treatment', 'Food Science', 'Waste Management', 'Product Stewardship'] },
    { label: 'Biomedical & Lab', tags: ['Nanoindentation', 'Microindentation', 'Fluorescence Spectroscopy', 'Absorbance Spectroscopy', 'Medical Imaging', 'OCT', 'Functional Materials', 'Semiconductor', 'Nanotechnology', 'Nanomaterials', 'Biomedical Devices', 'Lab Skills'] },
    { label: 'Computational', tags: ['Computational Chemistry', 'Computational Modelling', 'Autodock', 'Gaussian / GaussView', 'Discovery Studio', 'Drug Discovery', 'Drug Disposition & Kinetics'] },
    { label: 'Quality & Regulatory', tags: ['GMP', 'ISO 13485', 'ISO 14971', 'IEC 60601', 'IEC 62366', 'FMEA', 'Fault Tree Analysis', 'CAPA', 'Six Sigma', 'Lean / Kaizen', 'DOE', 'SPC'] },
    { label: 'Project & Leadership', tags: ['Project Management', 'Cross-functional Leadership', 'Critical Thinking', 'Problem Solving', 'Time Management', 'Cross-Cultural Communication', 'Teamwork'] },
  ]

  const languages = [
    { name: 'Thai', level: 'Native', fluent: true },
    { name: 'English', level: 'IELTS 6.5 · TOEIC 830', fluent: true },
    { name: 'Korean', level: 'Elementary', fluent: false },
    { name: 'Japanese', level: 'Elementary', fluent: false },
    { name: 'Chinese', level: 'Elementary', fluent: false },
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Custom cursor */}
      <div className="cursor-dot" ref={cursorDotRef} />
      <div className="cursor-ring" ref={cursorRingRef} />

      {/* Lightbox */}
      {lightboxSrc && (
        <div className={`lightbox-overlay open`} onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
          <img className="lightbox-img" src={lightboxSrc} alt="Certificate" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Scroll progress */}
      <div className="scroll-progress" id="scroll-bar" />

      {/* Back to top */}
      <button className="back-top" id="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {['education','experience','skills','contact'].map(s => (
          <a key={s} href={`#${s}`} onClick={() => setMenuOpen(false)} style={{ textTransform: 'capitalize' }}>{s}</a>
        ))}
      </div>

      <nav id="main-nav">
        <a href="#" className="nav-logo">Ploy</a>
        <ul className="nav-links">
          {['education','experience','skills','contact'].map(s => (
            <li key={s}><a href={`#${s}`} className={activeSection === s ? 'active' : ''} style={{ textTransform: 'capitalize' }}>{s}</a></li>
          ))}
        </ul>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">Medical Engineering · Chemical Engineering</div>
          <h1 className="hero-title" ref={heroTitleRef}>
            Engineering at the<br />
            <em>intersection</em> of<br />
            <span id="typed-text"></span><span className="typed-cursor" />
          </h1>
          <p className="hero-name">Waraitip Laosangprateep</p>
          <p className="hero-bio">
            Master&apos;s in Medical Engineering at University of Auckland,
            with a foundation in Chemical Engineering from Thammasat University (SIIT).
            Research experience across New Zealand, Taiwan, and Thailand.
          </p>
          <p className="hero-bio">
            Trilingual communicator — fluent in Thai and English,
            with conversational Korean. Passionate about cross-cultural collaboration.
          </p>
          <p className="hero-avail">
            Available from 16 August 2026 · Open to Thailand, Singapore &amp; beyond
          </p>
          <div className="hero-btns">
            <a href="#experience" className="btn-primary">View my work →</a>
            <a href="#contact" className="btn-outline">Get in touch</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-row">
        {[
          { number: '2', label: 'Engineering degrees', w: 100 },
          { number: '3', label: 'Countries researched in', w: 100 },
          { number: '2 + 3', label: 'Languages spoken', w: 100 },
        ].map((s, i) => (
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
        <p className="section-eyebrow">Academic background</p>
        <h2 className="section-title"><span>Education</span></h2>
        <div className="edu-card animate-on-scroll">
          <div>
            <h3 className="edu-degree">Master of Medical Engineering</h3>
            <p className="edu-school">University of Auckland · New Zealand</p>
            <ul className="edu-details">
              <li>Thesis: Mechanical characterisation of growth plate structures using microindentation techniques</li>
              <li>Coursework: Advanced Functional Materials · Semiconductor &amp; Materials Science · Medical Device &amp; Technology Development · Advanced Imaging (OCT, MRI, Ultrasound) · Machine Learning for Biomedical Applications · Engineering Project Management · Drug Disposition &amp; Kinetics · Waste Management · Product Stewardship</li>
            </ul>
          </div>
          <span className="edu-period">2025 – 2026</span>
        </div>
        <div className="edu-card animate-on-scroll" style={{ transitionDelay: '0.12s' }}>
          <div>
            <h3 className="edu-degree">Bachelor of Engineering — Chemical Engineering</h3>
            <p className="edu-school">Thammasat University (SIIT) · Thailand</p>
            <ul className="edu-details">
              <li>GPA: 3.22 / 4.00 · International Programme, full English instruction</li>
              <li>Senior Project: Theoretical study on butylone inclusion complexes with β-cyclodextrin — presented at PACCON 2024</li>
              <li>Coursework: Chemical Reaction Engineering · Process Design · Thermodynamics · Heat &amp; Mass Transfer · Fluid Mechanics · Environmental Engineering · Wastewater Treatment · Food Science · Aspen Plus · Computational Chemistry · Molecular Docking</li>
            </ul>
          </div>
          <span className="edu-period">2020 – 2024</span>
        </div>
      </section>

      <div className="divider" />

      {/* EXPERIENCE */}
      <section className="section" id="experience">
        <p className="section-eyebrow">Work &amp; Research</p>
        <h2 className="section-title"><span>Experience</span></h2>
        {[
          {
            period: '2025 – Present', org: 'University of Auckland',
            title: "Master's Thesis Researcher",
            bullets: [
              'Performed nanoindentation and microindentation mechanical testing on biological tissue samples across growth plate sub-structures',
              'Applied critical analysis to reconcile conflicting experimental data and form evidence-based conclusions',
              'Developed expertise in precision instrumentation, sample preparation, and quantitative data interpretation',
            ]
          },
          {
            period: 'Jun – Jul 2023', org: 'Academia Sinica, Taiwan',
            title: 'Research Intern — SWCNTs Defect Characterisation',
            link: 'https://www.iams.sinica.edu.tw/iip/intern_experience',
            bullets: [
              'Conducted independent experiments on SWCNTs using absorbance and fluorescence spectroscopy for cancer diagnostic applications',
              'Designed and executed DOE-style experiments; analysed spectral data using Origin Lab',
              'Gained proficiency in nanomaterial characterisation, medical imaging principles, and precision instrumentation',
            ]
          },
          {
            period: '2024 – 2026', org: 'Auckland, New Zealand',
            title: 'Customer Service & Operations',
            bullets: [
              "Retail and food service across Lily's Collection, Blue Elephant, Mi&Chi, Khao San Eatery, and The Coffee Club",
              'Developed cross-cultural communication, multitasking, and creative problem-solving in fast-paced environments',
              'Operated POS systems, cash handling, and inter-departmental cooperation',
            ]
          },
        ].map((exp: any, i: number) => (
          <div key={i} className="exp-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div><p className="exp-period">{exp.period}</p><p className="exp-org">{exp.org}</p></div>
            <div>
              <h3 className="exp-title">{exp.title}</h3>
              <ul className="exp-bullets">
                {exp.bullets.map((b: string, j: number) => <li key={j} dangerouslySetInnerHTML={{ __html: b }} />)}
              </ul>
              {exp.link && (
                <a href={exp.link} target="_blank" rel="noreferrer" className="exp-link">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M10 2H5M10 2V7"/></svg>
                  Visit Programme
                </a>
              )}
            </div>
          </div>
        ))}
      </section>

      <div className="divider" />

      {/* SKILLS */}
      <section className="section" id="skills">
        <p className="section-eyebrow">Capabilities</p>
        <h2 className="section-title"><span>Skills</span></h2>
        <div className="skills-grid">
          {skills.map((row, i) => (
            <div key={i} className="skill-row animate-on-scroll" style={{ transitionDelay: `${i * 0.06}s` }}>
              <span className="skill-label">{row.label}</span>
              <div className="skill-tags">
                {row.tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div style={{ marginTop: 40 }}>
          <p className="section-eyebrow" style={{ marginBottom: 8 }}>Languages</p>
          <div className="lang-grid">
            {languages.map((l, i) => (
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
        <p className="section-eyebrow">Credentials</p>
        <h2 className="section-title"><span>Certifications</span></h2>
        <div className="cert-grid">
          {[
            { label: 'Google Data Analysis with Python Specialization', img: '/google.jpeg' },
            { label: 'Poster Presentation — PACCON 2024 (Pure and Applied Chemistry International Conference)', img: '/paccon.jpeg' },
            { label: 'Internship Certificate — Academia Sinica, Institute of Atomic and Molecular Sciences, Taiwan', img: '/sinica.jpeg' },
          ].map((c, i) => (
            <div key={i} className="cert-card animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }} onClick={() => setLightboxSrc(c.img)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setLightboxSrc(c.img)}>
              <img className="cert-card-img" src={c.img} alt={c.label} />
              <div className="cert-card-label">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <p className="section-eyebrow" style={{ marginBottom: '16px' }}>Let&apos;s connect</p>
        <h2 className="contact-title">Let&apos;s <em>work</em> together</h2>
        <p className="contact-sub">Open to opportunities in Thailand, Singapore, and beyond · Available from August 2026</p>
        <div className="contact-links">
          <a href="mailto:Waraitip.l26@gmail.com" className="btn-primary">Email me →</a>
          <a href="https://www.linkedin.com/in/waraitip-laosangprateep-b33933388" target="_blank" rel="noreferrer" className="btn-outline">LinkedIn ↗</a>
        </div>
      </section>

      <footer>
        <span className="footer-name">Waraitip Laosangprateep</span>
        <span className="footer-note">Auckland, New Zealand · 2026</span>
      </footer>
    </>
  )
}
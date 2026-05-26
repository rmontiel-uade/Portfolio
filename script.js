/* =============================================
   PORTFOLIO — script.js
   ============================================= */

// ─── Nav Scroll Effect ────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── Scroll Reveal ────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// Hero elements visible on load
window.addEventListener('load', () => {
  setTimeout(() => {
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 80);
});

// ─── Language Toggle ──────────────────────────
let currentLang = 'es';
const langToggle = document.getElementById('langToggle');
const langEs = langToggle.querySelector('.lang-es');
const langEn = langToggle.querySelector('.lang-en');

function setLang(lang) {
  currentLang = lang;
  langEs.classList.toggle('active', lang === 'es');
  langEn.classList.toggle('active', lang === 'en');
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });
  document.title = lang === 'es'
    ? 'Renata Montiel — Diseño & Estrategia Digital'
    : 'Renata Montiel — Design & Digital Strategy';
}

langToggle.addEventListener('click', () => setLang(currentLang === 'es' ? 'en' : 'es'));

// ─── Project Card Tilt ────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => card.style.transition = '', 500);
  });
});

// ─── Hero Parallax ────────────────────────────
const heroContent = document.querySelector('.hero-content');
const heroStats = document.querySelector('.hero-stats');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (sy < window.innerHeight && heroContent) {
    heroContent.style.transform = `translateY(${sy * 0.16}px)`;
    heroContent.style.opacity = Math.max(0, 1 - sy / (window.innerHeight * 0.7));
    if (heroStats) heroStats.style.transform = `translateY(${sy * 0.08}px)`;
  }
}, { passive: true });

// ─── Modal System ─────────────────────────────
function openModal(id) {
  const backdrop = document.getElementById(`modal-${id}`);
  if (!backdrop) return;
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Re-translate modal content if not in ES
  if (currentLang !== 'es') {
    backdrop.querySelectorAll('[data-es][data-en]').forEach(el => {
      el.textContent = el.getAttribute(`data-${currentLang}`);
    });
  }
}

function closeModal(id) {
  const backdrop = document.getElementById(`modal-${id}`);
  if (!backdrop) return;
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// Open via card click
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Don't open if clicking a link inside
    if (e.target.closest('a')) return;
    const projectId = card.dataset.project;
    if (projectId) openModal(projectId);
  });
});

// Close via X button
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

// Close via backdrop click
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      const id = backdrop.id.replace('modal-', '');
      closeModal(id);
    }
  });
});

// Close via Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(backdrop => {
      const id = backdrop.id.replace('modal-', '');
      closeModal(id);
    });
  }
});

// ─── Supabase config ─────────────────────────────────────────────────
// Public keys — safe to commit. RLS restricts to INSERT on subscribers only.
const SUPABASE_URL      = 'https://vgvhekneuykkxnpotsvr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndmhla25ldXlra3hucG90c3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjc5MjMsImV4cCI6MjA4OTYwMzkyM30.VwGi34BZskgayGcOzcHb1AOuxqn-JzXw6OOFmr45TQg';
const STORAGE_KEY       = 'sweta_portfolio_access';

// ─── Helpers ─────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Scroll fade (Intersection Observer) ─────────────────────────────
function initScrollFade() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-section').forEach(el => observer.observe(el));
}

// ─── Inline email CTA ─────────────────────────────────────────────────
function initEmailCTA() {
  const ctaEl  = document.getElementById('email-cta');
  if (!ctaEl) return;

  // Hide for returning visitors who already submitted
  if (localStorage.getItem(STORAGE_KEY)) {
    ctaEl.classList.add('hidden');
    return;
  }

  const btn     = document.getElementById('cta-btn');
  const input   = document.getElementById('cta-email');
  const errorEl = document.getElementById('cta-error');

  function showError(msg) {
    errorEl.textContent = msg;
    input.classList.add('input-error');
    input.focus();
  }

  function clearError() {
    errorEl.textContent = '';
    input.classList.remove('input-error');
  }

  input.addEventListener('input', clearError);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });

  btn.addEventListener('click', async () => {
    const email = input.value.trim();

    if (!isValidEmail(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Just a moment…';
    clearError();

    try {
      const { createClient } = supabase;
      const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { error } = await db.from('subscribers').insert({ email });
      // 23505 = unique_violation (duplicate email) — treat as success
      if (error && error.code !== '23505') throw error;
    } catch (err) {
      console.warn('Supabase unavailable (non-blocking):', err);
    }

    localStorage.setItem(STORAGE_KEY, '1');
    btn.textContent = 'You\'re in ✦';

    setTimeout(() => {
      ctaEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      ctaEl.style.opacity    = '0';
      ctaEl.style.transform  = 'translateY(-8px)';
      setTimeout(() => ctaEl.classList.add('hidden'), 400);
    }, 900);
  });
}

// ─── Case study sticky nav active state ──────────────────────────────
function initCSNav() {
  const navLinks = document.querySelectorAll('.cs-nav-link');
  const sections = document.querySelectorAll('.cs-section');
  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.cs-nav-link[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35, rootMargin: '-10% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ─── Init ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollFade();
  initEmailCTA();
  initCSNav();
});

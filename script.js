// ─── Supabase config ─────────────────────────────────────────────────
// These are PUBLIC keys — safe to commit. The anon key only has the
// permissions granted by your RLS policies (INSERT on subscribers only).
const SUPABASE_URL      = 'https://vgvhekneuykkxnpotsvr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndmhla25ldXlra3hucG90c3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjc5MjMsImV4cCI6MjA4OTYwMzkyM30.VwGi34BZskgayGcOzcHb1AOuxqn-JzXw6OOFmr45TQg';

// ─── Constants ───────────────────────────────────────────────────────
const STORAGE_KEY = 'sweta_portfolio_access';

// ─── Helpers ─────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function revealPortfolio() {
  const gate   = document.getElementById('gate');
  const main   = document.querySelector('main');
  const footer = document.querySelector('footer');

  gate.classList.add('hiding');

  setTimeout(() => {
    gate.style.display = 'none';
    main.classList.add('revealed');
    footer.classList.add('revealed');
  }, 650);
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

// ─── Gate logic ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Returning visitor — skip gate immediately
  if (localStorage.getItem(STORAGE_KEY)) {
    document.getElementById('gate').style.display = 'none';
    document.querySelector('main').classList.add('revealed');
    document.querySelector('footer').classList.add('revealed');
    initScrollFade();
    return;
  }

  const btn     = document.getElementById('gate-btn');
  const input   = document.getElementById('gate-email');
  const errorEl = document.getElementById('gate-error');

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
      // Non-blocking: log the error but always let the visitor through
      console.warn('Supabase unavailable (non-blocking):', err);
    }

    localStorage.setItem(STORAGE_KEY, '1');
    btn.textContent = 'Welcome! ✦';

    setTimeout(() => {
      revealPortfolio();
      initScrollFade();
    }, 520);
  });
});

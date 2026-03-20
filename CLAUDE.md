# My Portfolio — CLAUDE.md

## What this is
A personal portfolio website for Sweta Swain. Built with plain HTML, CSS, and vanilla JavaScript only. No frameworks, no React, no Tailwind, no build tools.

## About me
- **Name:** Sweta Swain
- **Location:** Frankfurt, Germany
- **Role:** Product Engineer with a background in automotive ADAS
- **Focus:** Solving the right problems, building impactful products, experimenting with AI
- **LinkedIn:** https://www.linkedin.com/in/sweta-swain-611a3a73/
- **Email:** shwetaswain13november@gmail.com

---

## Tech constraints
- Plain HTML + CSS + vanilla JavaScript ONLY
- Supabase JS client loaded via CDN (no npm)
- No build steps, no bundlers — works by opening index.html in a browser

## File structure
- `index.html` — full page markup including email gate and all sections
- `styles.css` — all styles
- `script.js` — email gate logic + scroll fade (Intersection Observer)
- `photo.jpg` — profile photo
- `.gitignore` — excludes .DS_Store, node_modules, .env, etc.

---

## Design system
- **Palette:** warm cream `#f8f6f3` background, white `#ffffff` cards, near-black `#1c1917` accent, stone grey `#78716c` for muted text
- **Fonts:** DM Serif Display (headings, quotes), DM Sans (body)
- **Cards:** `border-radius: 20px`, `border: 1px solid rgba(28,25,23,0.07)`, subtle shadow
- **Sections:** max-width 900px, centered, fade in on scroll via Intersection Observer
- **Hero:** full-width (`min-height: 100vh`), photo left + text right, separated from sections by hairline border

---

## Page sections (in order)
1. **Email gate** — dark full-screen overlay (see below)
2. **Hero** — full-width, photo + name + tagline + intro + tags + buttons
3. **Case Studies** — 2-col grid: Micro-PM Residency (live on Vercel) + Hi-Drive HMI
4. **Skills & Tools** — 2×2 grid: Automotive & ADAS / Software & Full Stack / Product & Methods / AI & Vibe Coding
5. **My Story** — narrative card with pull quote, 3 paragraphs on journey from ADAS to PM
6. **Work Experience** — timeline: FERCHAU → Luxoft → Bosch GmbH → Bosch RBEI → Wipro
7. **Education** — M.Sc. Frankfurt UAS (2020–2023) + B.E. Silicon Institute (2009–2013)
8. **Beyond Work** — hobbies grid: AI tinkering, reading, travelling, design exploration, painting, hiking
9. **Get in Touch** — contact card with email + LinkedIn buttons

---

## Email gate
- Full-screen dark overlay (`#1c1917`) shown to first-time visitors
- Collects email → saves to Supabase `subscribers` table
- On success: localStorage flag set (`sweta_portfolio_access`), gate fades out, portfolio fades in
- Returning visitors skip gate automatically (localStorage check on load)
- Non-blocking: if Supabase fails or email is duplicate (code `23505`), visitor still gets through
- Supabase CDN: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`

## Supabase config (public keys — safe to commit)
- **Project URL:** `https://vgvhekneuykkxnpotsvr.supabase.co`
- **Anon key:** in `script.js` (public key, RLS-restricted to INSERT on subscribers only)
- **Table:** `subscribers` — column: `email` (text, unique)
- **RLS:** enabled — policy: `Allow anonymous inserts` (INSERT, anon role, `WITH CHECK: true`)

---

## Custom slash commands
- `/improve` — reviews and makes 3 design improvements (typography, spacing, color, details)
- `/add-section` — prompts for section type then builds it matching the design language
- `/mobile-check` — audits and fixes mobile responsiveness issues

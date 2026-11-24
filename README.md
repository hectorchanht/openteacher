# OpenTeacher

**Everything you want to learn, handed to you.**

OpenTeacher is the teaching hall of OpenSchool (Dawn Studio): a teaching engine that turns any verified canon into a learnable path. AI as teacher, not answer machine — the one measure is *are you smarter afterwards?*

**Live:** https://openteacher.dawnstudio.app/

## v2 — Svelte

A single-page, offline-first static app built with **Svelte 5 + Vite** (no trackers). The build output in `dist/` is uploaded as-is to the Cloudflare Pages project `openteacher`; the custom domain is `openteacher.dawnstudio.app`.

```bash
npm install
npm run build   # → dist/
```

Deployed == GitHub: everything needed to reproduce the deployed site is in this repo (source in `src/`, static assets in `public/`, content in `src/lib/data.js`).

- **The first path — "The OpenTeacher Way"**: the six Dawn teaching rules from the pedagogy playbook, each as a short teach card followed by a check. Wrong answers get a hint and a retry — never a punishment. Checks carry the affordance treatment: a "Your move — tap one answer" pill, A/B/C/D letter chips, press states, and a "Needs your answer" marker until answered.
- **Boss gate**: a mixed 3-question check drawn from all six steps (interleaved teach-back). One shot each; clear all three or retry until you do — the gate visibly opens (spring animation) when you clear it. Failure is part of the design.
- **Progress map** persisted in `localStorage` (same key/shape as v1 — progress carries over); bilingual EN / 繁中 toggle. Map nodes light up with spring motion; all animation collapses to instant under `prefers-reduced-motion`.
- **Subjects coming, honestly labelled**: Bible (OpenBible), Law (OpenLaw), Health (OpenHealth), Papers, Buddha, Earth.

## v1

Was a single-file static page (no build step). v2 carries its content, behaviour and chrome over exactly, and adds the Svelte animation/interaction layer.

Doctrine: `~/workspace/openteacher/pedagogy-playbook-v1.md` (the constitution) — teach-back, spaced + mixed checks, honesty labels, level from the learner never from age, discovery first.

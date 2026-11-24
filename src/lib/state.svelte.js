import { I18N } from './data.js';

// Same localStorage key + shape as v1, so existing students keep their progress.
export const KEY = 'openteacher-v1-progress';

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && s.steps) return { steps: s.steps, boss: !!s.boss, lang: s.lang || 'en' };
  } catch (e) { /* fresh start */ }
  return { steps: [false, false, false, false, false, false], boss: false, lang: 'en' };
}

export const store = $state(load());

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ steps: store.steps, boss: store.boss, lang: store.lang }));
  } catch (e) { /* private mode etc. — progress just won't persist */ }
}

export function T() { return I18N[store.lang]; }
export function allSteps() { return store.steps.every(Boolean); }

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

// When the OS asks for reduced motion, every animation collapses to instant.
export const reduced =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Shared duration helper: full motion normally, 0 under reduced motion.
export const dur = (ms) => (reduced ? 0 : ms);

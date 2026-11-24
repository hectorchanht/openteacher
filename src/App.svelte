<script>
  import { spring } from 'svelte/motion';
  import { fly } from 'svelte/transition';
  import { store, save, T, reduced, dur } from './lib/state.svelte.js';
  import { STEPS, SUBJECTS } from './lib/data.js';
  import ProgressMap from './lib/ProgressMap.svelte';
  import StepCard from './lib/StepCard.svelte';
  import BossGate from './lib/BossGate.svelte';

  const t = $derived(T());

  // Six link segments in the progress map: seg j<5 joins step j→j+1,
  // seg 5 joins step 6→boss. Each fill is a spring 0..1 (draws itself alight).
  const segDone = (j) => (j < 5 ? store.steps[j] && store.steps[j + 1] : store.steps[5] && store.boss);
  const fills = Array.from({ length: 6 }, (_, j) =>
    spring(segDone(j) ? 1 : 0, { stiffness: 0.13, damping: 0.72, precision: 0.002 })
  );
  const fillVals = $state([0, 0, 0, 0, 0, 0]);
  fills.forEach((f, j) => f.subscribe((v) => (fillVals[j] = v)));
  $effect(() => {
    fills.forEach((f, j) => {
      if (reduced) f.set(segDone(j) ? 1 : 0, { hard: true });
      else f.set(segDone(j) ? 1 : 0);
    });
  });

  $effect(() => {
    document.documentElement.lang = store.lang === 'zh' ? 'zh-Hant' : 'en';
  });

  function setLang(l) {
    if (l !== store.lang) {
      store.lang = l;
      save();
    }
  }
  function reset() {
    store.steps = [false, false, false, false, false, false];
    store.boss = false;
    save();
  }
</script>

<div class="wrap" id="top">
  <header class="utility">
    <a class="brand" href="#top" aria-label="OpenTeacher home">
      <img src="/icon-192.png" alt="OpenTeacher logo" width="40" height="40">
      <span>OpenTeacher</span> <span class="hall">{t.hall}</span>
    </a>
    <div class="lang-switch" role="group" aria-label="Language">
      <button type="button" aria-pressed={store.lang === 'en'} onclick={() => setLang('en')}>EN</button>
      <button type="button" aria-pressed={store.lang === 'zh'} onclick={() => setLang('zh')}>繁中</button>
    </div>
  </header>

  <div class="hero">
    <img class="mark" src="/icon-192.png" alt="OpenTeacher mark — Dawn sun over an open book">
    <h1>OpenTeacher</h1>
    <p class="promise">{t.promise}</p>
    <p class="measure">{@html t.measure}</p>
  </div>

  <ProgressMap {fillVals} />

  <section class="path">
    <h2>{t.pathTitle}</h2>
    <p class="sub">{t.pathSub}</p>
    {#key store.lang}
      <div>
        {#each STEPS as step, idx}
          <div in:fly={{ y: 18, duration: dur(480), delay: dur(idx * 80) }}>
            <StepCard {step} {idx} />
          </div>
        {/each}
      </div>
      <BossGate />
    {/key}
  </section>

  <section class="subjects">
    <h2>{t.subjTitle}</h2>
    <p class="sub">{t.subjSub}</p>
    <div class="chips">
      {#each SUBJECTS as s}
        <span class="chip">
          <span>{s.zh === s.en ? s.en : store.lang === 'zh' ? `${s.zh} · ${s.note.zh}` : `${s.en} · ${s.note.en}`}</span>
          <span class="tag">{t.coming}</span>
        </span>
      {/each}
    </div>
  </section>

  <p class="freenote"><span>{t.foot1}</span>
    · <button class="reset" type="button" onclick={reset}>{t.reset}</button></p>

  <footer>
    <p>{t.footStudio}</p>
    <div class="links">
      <a class="footer-legal" href="https://dawnstudio.app/examples">Examples</a>
      <a class="footer-legal" href="https://dawnstudio.app/changelog">Changelog</a>
      <a class="footer-legal" href="https://dawnstudio.app/blog">Blog</a>
      <a class="footer-legal" href="https://dawnstudio.app/canon">Canon</a>
      <a class="footer-legal" href="https://dawnstudio.app/privacy.html">Privacy</a>
      <a class="back-top" href="#top" aria-label="Back to top"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7 8 2.5 12.5 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="sr-only">Back to top</span></a>
    </div>
  </footer>
</div>

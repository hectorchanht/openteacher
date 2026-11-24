<script>
  import { fly } from 'svelte/transition';
  import { spring } from 'svelte/motion';
  import { store, save, T, allSteps, shuffle, reduced, dur } from './state.svelte.js';
  import { BOSS } from './data.js';
  import OptionButton from './OptionButton.svelte';

  const t = $derived(T());
  const ready = $derived(allSteps());

  // The gate: two door panels driven by one spring (0 = shut, 1 = open).
  const gate = spring(store.boss ? 1 : 0, { stiffness: 0.11, damping: 0.68 });
  $effect(() => {
    if (reduced) gate.set(store.boss ? 1 : 0, { hard: true });
    else gate.set(store.boss ? 1 : 0);
  });

  let run = $state(null); // { qs: [BOSS indices], pos, score }
  let order = $state([]); // shuffled option order for the current question
  let picked = $state(-1); // tapped option index for the current question
  let pickedRight = $state(false);
  let failScore = $state(null); // set after a failed run (boss shell fail state)
  let settle = $state(false); // gentle gate settle animation after a fail

  function startBoss() {
    failScore = null;
    picked = -1;
    run = { qs: shuffle(BOSS.map((_, i) => i)).slice(0, 3), pos: 0, score: 0 };
    deal();
  }
  function deal() {
    order = shuffle(BOSS[run.qs[run.pos]].opts.map((_, i) => i));
    picked = -1;
  }
  function answer(oi) {
    if (!run || picked >= 0) return;
    picked = oi;
    pickedRight = oi === BOSS[run.qs[run.pos]].ans;
    if (pickedRight) run.score++;
    setTimeout(() => {
      if (!run) return;
      run.pos++;
      if (run.pos >= run.qs.length) finish();
      else deal();
    }, dur(650) || 650);
  }
  function finish() {
    const score = run.score;
    run = null;
    if (score === 3) {
      store.boss = true;
      save();
    } else {
      failScore = score;
      settle = true;
      setTimeout(() => (settle = false), 600);
    }
  }
  const q = $derived(run ? BOSS[run.qs[run.pos]] : null);
</script>

<div class="boss {store.boss ? 'cleared' : ''}">
  <div class="kicker" style="color:var(--accent-soft);font-size:.78rem;text-transform:uppercase;letter-spacing:.13em;font-weight:700">{t.bossKicker}</div>
  <h3>{t.bossTitle}</h3>

  <div class="gate {store.boss ? 'cleared' : ''} {ready || store.boss ? '' : 'locked'} {settle ? 'settle' : ''}" aria-hidden="true">
    <div class="gate-frame">
      <div class="gate-glow" style="opacity:{0.25 + $gate * 0.75}"></div>
      <div class="door left" style="transform:translateX({-$gate * 102}%)"></div>
      <div class="door right" style="transform:translateX({$gate * 102}%)"></div>
      <div class="gate-emblem" style="opacity:{1 - $gate}">{store.boss ? '✓' : '⚔'}</div>
    </div>
  </div>

  <p>{t.bossIntro}</p>
  <div class="bossbody">
    {#if store.boss}
      <p class="state" in:fly={{ y: 10, duration: dur(400) }}>{t.bossClearedState} {t.bossPass}</p>
    {:else if !ready}
      <p class="state">{t.bossLocked}</p>
    {:else if failScore !== null && !run}
      <div in:fly={{ y: 10, duration: dur(350) }}>
        <p class="state"><span class="score">{t.bossScore(failScore)}</span>{t.bossFail}</p>
        <button type="button" class="bossbtn" onclick={startBoss}>{t.bossRetry}</button>
      </div>
    {:else if !run}
      <button type="button" class="bossbtn" onclick={startBoss}>{t.bossStart}</button>
    {:else}
      {#key run.pos}
        <div in:fly={{ x: 26, duration: dur(320) }}>
          <div class="check-head">
            <span class="check-label">{t.qOf(run.pos + 1, run.qs.length)}</span>
            <span class="needs {picked >= 0 ? 'cleared' : ''}">
              <span class="needs-dot"></span><span>{t.needsAnswer}</span>
            </span>
          </div>
          <div class="bossq">{q.q[store.lang]}</div>
          <div class="move-pill {picked >= 0 ? 'gone' : ''}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0l-5.5-5.5M12 15l5.5-5.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 21h16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>
            <span>{t.movePill}</span>
          </div>
          <div class="opts">
            {#each order as oi, pos}
              <OptionButton
                letter={'ABCD'.charAt(pos)}
                text={q.opts[oi][store.lang]}
                picked={picked === oi ? (pickedRight ? 'sel picked-good' : 'sel picked-bad') : ''}
                disabled={picked >= 0}
                onclick={() => answer(oi)}
              />
            {/each}
          </div>
        </div>
      {/key}
    {/if}
  </div>
</div>

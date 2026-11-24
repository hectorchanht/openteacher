<script>
  import { fly } from 'svelte/transition';
  import { store, save, T, shuffle, dur } from './state.svelte.js';
  import OptionButton from './OptionButton.svelte';

  let { step, idx } = $props();
  const t = $derived(T());
  const done = $derived(store.steps[idx]);
  const kicker = $derived(store.lang === 'zh' ? `第 ${idx + 1} 步` : `Step ${idx + 1} of 6`);

  // Option order is shuffled once per mount (v1 behaviour: per render / per language).
  const order = shuffle(step.opts.map((_, i) => i));
  let wrong = $state(new Set());
  let tapped = $state(new Set()); // any tap clears the "needs your answer" marker (fix behaviour)
  let feedback = $state(null); // { kind: 'good' | 'bad' }
  let glow = $state(false);

  function pick(oi) {
    if (done) return;
    tapped.add(oi);
    tapped = new Set(tapped);
    if (oi === step.ans) {
      feedback = { kind: 'good' };
      store.steps[idx] = true;
      save();
      glow = true;
      setTimeout(() => (glow = false), 1500);
    } else {
      wrong.add(oi);
      wrong = new Set(wrong);
      feedback = { kind: 'bad' };
    }
  }

  function pickedClass(oi) {
    let c = '';
    if (tapped.has(oi)) c += 'sel ';
    if (feedback && feedback.kind === 'good' && oi === step.ans) c += 'picked-good';
    else if (wrong.has(oi)) c += 'picked-bad';
    return c.trim();
  }
</script>

<article class="step {done ? 'done' : ''} {glow ? 'glow' : ''}">
  <div class="kicker"><span>{kicker}</span><span class="badge">{done ? t.doneBadge : t.notYet}</span></div>
  <h3>{step.t[store.lang]}</h3>
  <div class="teach">{step.teach[store.lang]}</div>
  <div class="check">
    <div class="check-head">
      <span class="check-label">{t.checkLabel}</span>
      <span class="needs {done || tapped.size > 0 ? 'cleared' : ''}">
        <span class="needs-dot"></span><span>{t.needsAnswer}</span>
      </span>
    </div>
    <div class="q">{step.q[store.lang]}</div>
    <div class="move-pill {done || (feedback && feedback.kind === 'good') ? 'gone' : ''}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0l-5.5-5.5M12 15l5.5-5.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 21h16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>
      <span>{t.movePill}</span>
    </div>
    <div class="opts">
      {#each order as oi, pos}
        <OptionButton
          letter={'ABCD'.charAt(pos)}
          text={step.opts[oi][store.lang]}
          picked={pickedClass(oi)}
          disabled={done || wrong.has(oi)}
          onclick={() => pick(oi)}
        />
      {/each}
    </div>
    {#if feedback}
      <div class="feedback show" role="status" in:fly={{ y: 8, duration: dur(280) }}>
        {#if feedback.kind === 'good'}
          {step.good[store.lang]}
        {:else}
          <div>{step.bad[store.lang]}</div>
          <div class="hintline">{t.hintWord}{step.hint[store.lang]}</div>
        {/if}
      </div>
    {/if}
  </div>
</article>

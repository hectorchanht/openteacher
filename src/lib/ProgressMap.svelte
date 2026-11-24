<script>
  import { fly } from 'svelte/transition';
  import { store, T, dur } from './state.svelte.js';
  import { STEPS } from './data.js';

  // The progress map: six step nodes + the boss node, joined by link segments
  // whose accent fill is spring-driven (App owns the springs, passes values).
  let { fillVals } = $props();
  const t = $derived(T());
  const doneCount = $derived(store.steps.filter(Boolean).length);
  const note = $derived(
    store.boss ? t.mapDone : doneCount === 6 ? t.mapReady : doneCount === 0 ? t.mapStart : t.mapMid(doneCount)
  );
</script>

<div class="mapbox" aria-label="Progress map">
  <h2>{t.mapTitle}</h2>
  <div class="map">
    {#each store.steps as done, i}
      {#if i > 0}
        <div class="link"><div class="link-fill" style="width:{fillVals[i - 1] * 100}%"></div></div>
      {/if}
      <div class="node {done ? 'done' : ''}">
        <div class="dot">
          {#if done}
            <span class="check-in" in:fly={{ y: 6, duration: dur(300), delay: dur(60) }}>✓</span>
          {:else}
            {i + 1}
          {/if}
        </div>
        <div class="lbl">{STEPS[i].t[store.lang]}</div>
      </div>
    {/each}
    <div class="link"><div class="link-fill" style="width:{fillVals[5] * 100}%"></div></div>
    <div class="node boss {store.boss ? 'done' : ''} {store.boss || doneCount === 6 ? '' : 'locked'}">
      <div class="dot">
        {#if store.boss}
          <span class="check-in" in:fly={{ y: 6, duration: dur(300), delay: dur(60) }}>✓</span>
        {:else}
          ⚔
        {/if}
      </div>
      <div class="lbl">{t.bossNode}</div>
    </div>
  </div>
  <p class="mapnote">{note}</p>
</div>

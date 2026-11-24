<script>
  // One answer option, exactly as the affordance fix built it:
  // filled A/B/C/D letter chip, label, radio ring, press + selected states.
  let { letter, text, picked = '', disabled = false, onclick } = $props();
</script>

<button type="button" class="opt {picked}" {disabled} {onclick}>
  <span class="opt-letter">{letter}</span>
  <span class="opt-text">{text}</span>
  <span class="opt-ring" aria-hidden="true"></span>
</button>

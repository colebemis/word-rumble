<script lang="ts">
  import { clsx } from "clsx";
  import { LETTER_VALUES } from "../utils";

  let {
    letter,
    selected,
    onclick,
  }: {
    letter: string;
    selected: boolean;
    onclick: () => void;
  } = $props();

  const value = $derived(LETTER_VALUES[letter]);
</script>

<button
  ontouchstart={() => {
    // This is a hack to get iOS Safari to respect the active state
    // https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari
  }}
  class={clsx(
    "aspect-square rounded-lg border-2 [container-type:size] transition-[transform,color,background-color] will-change-transform active:scale-95 relative border-b-4",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-11",
    selected
      ? "border-accent-8 text-accent-12 bg-accent-3 hover:bg-accent-4 active:bg-accent-5"
      : "border-border bg-bg-tile hover:bg-neutral-3 active:bg-neutral-4",
  )}
  {onclick}
>
  <span class="text-[40cqw] font-semibold leading-none cursor-[inherit]">{letter}</span>
  <span class="absolute bottom-1.5 right-1.5 text-sm leading-none font-medium cursor-[inherit]"
    >{value}</span
  >
</button>

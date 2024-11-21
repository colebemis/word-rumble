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
  class={clsx(
    "aspect-square rounded-lg border-2 [container-type:size] transition-all will-change-transform active:scale-95 relative border-b-4",
    selected
      ? "border-accent-8 text-accent-12 bg-accent-3 hover:bg-accent-4 active:bg-accent-5"
      : "border-border bg-bg-tile hover:border-accent-6 hover:bg-accent-2 active:bg-accent-3 hover:text-accent-11",
  )}
  {onclick}
>
  <span class="text-[40cqw] font-semibold leading-none cursor-[inherit]">{letter}</span>
  <span class="absolute bottom-1.5 right-1.5 text-sm leading-none font-medium cursor-[inherit]"
    >{value}</span
  >
</button>

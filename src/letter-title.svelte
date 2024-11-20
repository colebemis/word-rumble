<script lang="ts">
  import { clsx } from "clsx";
  import { LETTER_VALUES } from "./utils";

  let {
    letter,
    selected,
    disabled,
    onclick,
  }: {
    letter: string;
    selected: boolean;
    disabled: boolean;
    onclick: () => void;
  } = $props();

  const value = $derived(LETTER_VALUES[letter]);
</script>

<button
  class={clsx(
    "aspect-square border-2 rounded-lg [container-type:size] transition-transform active:scale-95 relative disabled:opacity-50 disabled:cursor-not-allowed border-b-4 ",
    selected ? "border-accent-8 text-accent-12 bg-accent-3" : "border-border bg-bg-tile",
  )}
  {disabled}
  {onclick}
>
  <span class="text-[40cqw] font-semibold leading-none">{letter}</span>
  <span class="absolute bottom-1.5 right-1.5 text-sm leading-none font-medium">{value}</span>
</button>

<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";
  import type { ColorName } from "./types";

  let { color, children, ...rest }: SvelteHTMLElements["div"] & { color: ColorName } = $props();
</script>

<div
  {...rest}
  style:--accent-1={`var(--${color}-1)`}
  style:--accent-2={`var(--${color}-2)`}
  style:--accent-3={`var(--${color}-3)`}
  style:--accent-4={`var(--${color}-4)`}
  style:--accent-5={`var(--${color}-5)`}
  style:--accent-6={`var(--${color}-6)`}
  style:--accent-7={`var(--${color}-7)`}
  style:--accent-8={`var(--${color}-8)`}
  style:--accent-9={`var(--${color}-9)`}
  style:--accent-10={`var(--${color}-10)`}
  style:--accent-11={`var(--${color}-11)`}
  style:--accent-12={`var(--${color}-12)`}
  style:--accent-contrast={`var(--${color}-contrast)`}
>
  {@render children?.()}
</div>

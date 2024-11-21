<script lang="ts">
  import { clsx } from "clsx";
  import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    variant = "secondary",
    children,
    ...rest
  }: HTMLButtonAttributes & { variant?: "primary" | "secondary" } = $props();
</script>

<button
  {...rest}
  class={clsx(
    "font-semibold rounded-full p-4 disabled:opacity-50 disabled:cursor-not-allowed transition-transform [&:not(:disabled)]:active:scale-95",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-11",
    variant === "primary" && !rest.disabled
      ? "bg-accent-11 text-bg"
      : "ring-2 ring-inset ring-border",
    rest.class,
  )}
>
  {@render children?.()}
</button>

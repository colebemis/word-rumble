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
    "font-semibold rounded-full p-4 disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:not(:disabled):scale-95",
    variant === "primary" && !rest.disabled
      ? "bg-accent-11 text-bg"
      : "ring-2 ring-inset ring-border",
    rest.class,
  )}
>
  {@render children?.()}
</button>

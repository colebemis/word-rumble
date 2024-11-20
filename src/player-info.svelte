<script lang="ts">
  import { clsx } from "clsx";
  import type { Player } from "./types";
  import AccentProvider from "./accent-provider.svelte";
  import { calculatePlayerScore, calculateWordValue, WINNING_SCORE } from "./utils";

  const {
    player,
    current,
    align = "start",
  }: { player: Player; current: boolean; align: "start" | "end" } = $props();
  const score = $derived(calculatePlayerScore(player.moves));
</script>

<AccentProvider color={player.color}>
  <div class={clsx("flex flex-col w-full", align === "end" && "items-end")}>
    <span class="text-xl font-semibold leading-none mb-3">{player.name}</span>
    <span class="text-5xl font-light leading-none mb-3">
      {#if current && align === "end"}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          class="inline-block align-middle text-accent-11"
        >
          <polygon points="16,8 0,0 0,16" fill="currentColor" />
        </svg>
      {/if}
      {score}
      {#if current && align === "start"}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          class="inline-block align-middle text-accent-11"
        >
          <polygon points="0,8 16,0 16,16" fill="currentColor" />
        </svg>
      {/if}
    </span>
    <div class={clsx("w-full py-3 border-border", align === "end" ? "border-l" : "border-r")}>
      <div
        class={clsx("h-1 w-full bg-border flex overflow-hidden", align === "end" && "justify-end")}
      >
        <div class="h-full bg-accent-11" style:width={`${(score / WINNING_SCORE) * 100}%`}></div>
      </div>
    </div>

    <ul class={clsx("flex flex-col gap-4 mt-5 empty:hidden", align === "end" && "items-end")}>
      {#each player.moves.filter((move) => move.type === "submit-word") as move}
        <li class="text-xl leading-none">
          <span class="[user-select:auto]">{move.word}</span>
          <sub class="font-medium">{calculateWordValue(move.word)}</sub>
        </li>
      {/each}
    </ul>
  </div>
</AccentProvider>

<script lang="ts">
  import clsx from "clsx";
  import AccentProvider from "./components/accent-provider.svelte";
  import Button from "./components/button.svelte";
  import LetterTile from "./components/letter-title.svelte";
  import PlayerInfo from "./components/player-info.svelte";
  import type { GameState } from "./types";
  import {
    calculatePlayerScore,
    calculateWordValue,
    generateBoard,
    getRandomEmoji,
    getRandomPlayerColors,
    validateWord,
    WINNING_SCORE,
  } from "./utils";

  const LOCAL_STORAGE_KEY = "game_state";

  function getSavedGameState(): GameState | null {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }

  function getInitialGameState(): GameState {
    const randomPlayerColors = getRandomPlayerColors();
    return {
      board: generateBoard(),
      selectedIndexes: [],
      currentPlayerIndex: 0,
      players: [
        {
          name: "Player 1",
          color: randomPlayerColors[0],
          moves: [],
        },
        {
          name: "Player 2",
          color: randomPlayerColors[1],
          moves: [],
        },
      ],
    };
  }

  let gameState = $state(getSavedGameState() ?? getInitialGameState());

  // UI state
  let isLastSubmissionInvalid = $state(false);
  let isSubmitting = $state(false);

  // Derived values
  const currentPlayer = $derived(gameState.players[gameState.currentPlayerIndex]);
  const currentWord = $derived(gameState.selectedIndexes.map((i) => gameState.board[i]).join(""));
  const currentWordValue = $derived(calculateWordValue(currentWord));
  const winnerIndex = $derived(
    gameState.players.findIndex((player) => calculatePlayerScore(player.moves) >= WINNING_SCORE),
  );
  const isGameOver = $derived(winnerIndex !== -1);

  async function submitWord() {
    isSubmitting = true;

    const isValidWord = await validateWord(currentWord);
    isLastSubmissionInvalid = !isValidWord;

    if (!isValidWord) {
      gameState.selectedIndexes = [];
      isSubmitting = false;
      return;
    }

    // Save move
    gameState.players[gameState.currentPlayerIndex].moves.push({
      type: "submit-word",
      word: currentWord,
    });

    // Remove selected letters from board
    gameState.selectedIndexes.forEach((i) => (gameState.board[i] = null));

    // Reset selection
    gameState.selectedIndexes = [];

    // Switch to next player
    gameState.currentPlayerIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;

    isSubmitting = false;
  }

  function newBoard() {
    // Save move
    gameState.players[gameState.currentPlayerIndex].moves.push({
      type: "new-board",
    });

    // Generate new board
    gameState.board = generateBoard();

    // Reset selection
    gameState.selectedIndexes = [];

    // Switch to next player
    gameState.currentPlayerIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;

    // Reset invalid submission state
    isLastSubmissionInvalid = false;
  }

  function restartGame() {
    gameState = getInitialGameState();
    isLastSubmissionInvalid = false;
  }

  $effect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
  });

  // Update theme based on system preferences
  $effect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark-theme");
      }
    };

    darkModeQuery.addEventListener("change", updateTheme);
    updateTheme(darkModeQuery);

    return () => darkModeQuery.removeEventListener("change", updateTheme);
  });
</script>

<AccentProvider color={isGameOver ? gameState.players[winnerIndex].color : currentPlayer.color}>
  <div class="w-full min-h-[100svh] grid grid-rows-[auto_1fr]">
    <header class="flex items-center justify-between">
      <span class="font-semibold px-4 hover:animate-rumble will-change-transform">Word Rumble</span>

      <button
        aria-label="Restart Game"
        class="p-4"
        onclick={() => {
          if (confirm("Are you sure you want to restart the game?")) {
            restartGame();
          }
        }}
      >
        <svg class="text-fg-secondary" width="24" height="24" fill="currentColor"
          ><path
            d="M6.343 6.343A8 8 0 0 1 11.998 4a8.75 8.75 0 0 1 6.041 2.453l.547.547H15v2h7V2h-2v3.586l-.553-.553-.012-.012A10.75 10.75 0 0 0 12.004 2H12a10 10 0 0 0-9.75 7.778l-.222.975 1.95.444.222-.975a8 8 0 0 1 2.143-3.879ZM21.972 13.247l-.222.975A10.001 10.001 0 0 1 12 22h-.004a10.75 10.75 0 0 1-7.431-3.021l-.012-.012L4 18.414V22H2v-7h7v2H5.414l.547.547A8.75 8.75 0 0 0 12.001 20a8 8 0 0 0 7.799-6.222l.222-.975 1.95.444Z"
          /></svg
        >
      </button>
    </header>

    <div class="flex flex-col items-center">
      <div class="max-w-[30rem] w-full p-4 flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <div class="h-12 text-center leading-none grid place-items-center">
            {#if winnerIndex !== -1}
              <span class="text-2xl font-semibold">
                {gameState.players[winnerIndex].name} wins!&nbsp;&nbsp;{getRandomEmoji()}
              </span>
            {:else if currentWord}
              <span class={clsx(isSubmitting && "opacity-50 transition-opacity")}>
                <span class="text-4xl font-semibold [user-select:auto] cursor-text"
                  >{currentWord}</span
                >
                <sub class="text-base font-medium">{currentWordValue}</sub>
              </span>
            {:else}
              <span class="text-2xl font-semibold">
                {#if isLastSubmissionInvalid}
                  That&rsquo;s not a word. Try again.
                {:else}
                  {currentPlayer.name}, it&rsquo;s your turn!
                {/if}
              </span>
            {/if}
          </div>

          {#if isGameOver}
            <Button variant="primary" onclick={restartGame}>Play Again</Button>
          {:else}
            <div class="grid grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="primary"
                disabled={currentWord.length < 4 || isSubmitting}
                onclick={submitWord}
              >
                {#if isSubmitting}
                  Checking...
                {:else}
                  Submit Word
                {/if}
              </Button>
              <Button onclick={newBoard}>New Board</Button>
            </div>
          {/if}
        </div>

        {#if !isGameOver}
          <div class="grid grid-cols-5 gap-2 sm:gap-3">
            {#each gameState.board as letter, index (index)}
              {#if letter !== null}
                {@const selected = gameState.selectedIndexes.includes(index)}
                <LetterTile
                  {letter}
                  {selected}
                  onclick={() => {
                    if (selected) {
                      gameState.selectedIndexes = gameState.selectedIndexes.slice(
                        0,
                        gameState.selectedIndexes.indexOf(index),
                      );
                    } else {
                      gameState.selectedIndexes.push(index);
                    }
                  }}
                />
              {:else}
                <div class="aspect-square rounded-lg"></div>
              {/if}
            {/each}
          </div>
        {/if}

        <div class="grid grid-cols-2">
          <PlayerInfo
            player={gameState.players[0]}
            current={isGameOver ? winnerIndex === 0 : gameState.currentPlayerIndex === 0}
            align="start"
          />
          <PlayerInfo
            player={gameState.players[1]}
            current={isGameOver ? winnerIndex === 1 : gameState.currentPlayerIndex === 1}
            align="end"
          />
        </div>
      </div>
    </div>

    <footer class="p-4 text-center">
      <span class="text-fg-secondary group"
        >Made with
        <svg
          class="inline-block align-middle -mt-1 text-accent-11 will-change-transform group-hover:motion-safe:animate-heartbeat"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-label="love"
          role="img"
          ><path
            d="M8 3c1-1.5 3-2.8 5-2 5 2 1.5 8.5-5 14v.023c-6.5-5.5-10-12-5-14 2-.8 4 .5 5 2V3Z"
          /></svg
        > by Co&amp;Co</span
      >
    </footer>
  </div>
</AccentProvider>

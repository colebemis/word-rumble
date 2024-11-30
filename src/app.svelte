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
    getSuccessMessage,
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
  let isLastSubmissionInvalid = $state(false);
  let showSuccessMessage = $state(false);
  let currentSuccessMessage = $state("");
  let dialog: HTMLDialogElement;

  // Derived values
  const currentPlayer = $derived(gameState.players[gameState.currentPlayerIndex]);
  const currentWord = $derived(gameState.selectedIndexes.map((i) => gameState.board[i]).join(""));
  const currentWordValue = $derived(calculateWordValue(currentWord));
  const winnerIndex = $derived(
    gameState.players.findIndex((player) => calculatePlayerScore(player.moves) >= WINNING_SCORE),
  );
  const isGameOver = $derived(winnerIndex !== -1);

  async function submitWord() {
    const isValidWord = validateWord(currentWord);
    isLastSubmissionInvalid = !isValidWord;

    if (!isValidWord) {
      gameState.selectedIndexes = [];
      return;
    }

    // Show success message
    currentSuccessMessage = getSuccessMessage(currentWordValue);
    showSuccessMessage = true;
    setTimeout(() => {
      showSuccessMessage = false;
    }, 1500);

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

  let darkMode = $state(window.matchMedia("(prefers-color-scheme: dark)").matches);

  $effect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      darkMode = e.matches;
    };

    darkModeQuery.addEventListener("change", updateTheme);
    updateTheme(darkModeQuery);

    return () => darkModeQuery.removeEventListener("change", updateTheme);
  });

  $effect(() => {
    document.documentElement.classList.toggle("dark-theme", darkMode);
  });
</script>

<svelte:head>
  <meta name="theme-color" content={darkMode ? "#000000" : "#f9f9f9"} />
</svelte:head>

<AccentProvider color={isGameOver ? gameState.players[winnerIndex].color : currentPlayer.color}>
  <dialog
    bind:this={dialog}
    class="p-6 bg-bg-tile rounded-xl relative outline-none border-2 border-b-4 border-border w-[90vw] max-h-[90vh] max-w-xl backdrop:bg-[#ffffff88] dark:backdrop:bg-[#00000088] backdrop:backdrop-blur overflow-auto"
    aria-labelledby="how-to-play"
  >
    <button
      aria-label="Close dialog"
      class="p-4 rounded-full -outline-offset-8 focus-visible:outline-2 focus-visible:outline-accent-11 absolute top-2 right-2"
      onclick={() => {
        dialog.close();
      }}
    >
      <svg
        aria-hidden="true"
        class="text-fg-secondary"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M18 6 6 18" /><path d="m6 6 12 12" />
      </svg>
    </button>
    <h2 id="how-to-play" class="text-xl font-semibold mb-4">How to Play</h2>
    <div class="space-y-4">
      <div class="space-y-2">
        <h3 class="font-semibold">Goal</h3>
        <p>Be the first player to reach 50 points.</p>
      </div>
      <div class="space-y-2">
        <h3 class="font-semibold">Scoring</h3>
        <p>
          Create words using letters from the board. Each letter has a point value shown in its
          corner. Your word's score is the sum of its letters.
        </p>
      </div>
      <div class="space-y-2">
        <h3 class="font-semibold">Choosing letters</h3>
        <p>
          You can use any letters on the board—they don't need to be adjacent. Letters are removed
          from the board after being used in a word.
        </p>
      </div>
      <div class="space-y-2">
        <h3 class="font-semibold">Can't make a word?</h3>
        <p>You can click "New Board" to refresh the letters, but this will end your turn.</p>
      </div>
      <div class="space-y-2">
        <h3 class="font-semibold">Rules</h3>
        <p>Words must be at least 4 letters long.</p>
      </div>
    </div>
  </dialog>
  <div
    class="w-full min-h-[100svh] grid grid-rows-[auto_1fr] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
  >
    <header class="flex items-center justify-between">
      <span class="font-semibold px-4 hover:animate-rumble will-change-transform">Word Rumble</span>

      <div>
        <button
          aria-label="How to play"
          class="p-4 rounded-full -outline-offset-8 focus-visible:outline-2 focus-visible:outline-accent-11"
          onclick={() => {
            dialog.showModal();
          }}
        >
          <svg
            aria-hidden="true"
            class="text-fg-secondary"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            />
            <path
              d="M9.09 8.50001C9.3251 7.83167 9.78915 7.26811 10.4 6.90914C11.0108 6.55016 11.7289 6.41894 12.4272 6.53872C13.1255 6.65849 13.7588 7.02153 14.2151 7.56353C14.6713 8.10554 14.8973 8.79189 14.92 9.50001C14.984 11.5 12.4272 12 12 13.5"
            />
            <path d="M12 17H12.01" />
          </svg>
        </button>
        <button
          aria-label="Restart game"
          class="p-4 rounded-full -outline-offset-8 focus-visible:outline-2 focus-visible:outline-accent-11"
          onclick={() => {
            if (confirm("Are you sure you want to restart the game?")) {
              restartGame();
            }
          }}
        >
          <svg
            aria-hidden="true"
            class="text-fg-secondary"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path
              d="M21 3v5h-5"
            /></svg
          >
        </button>
      </div>
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
              <span>
                <span class="text-4xl font-semibold [user-select:auto] cursor-text"
                  >{currentWord}</span
                >
                <sub class="text-base font-medium">{currentWordValue}</sub>
              </span>
            {:else}
              <span class="text-2xl font-semibold">
                {#if showSuccessMessage}
                  {currentSuccessMessage}
                {:else if isLastSubmissionInvalid}
                  That&rsquo;s not a word. Try again.
                {:else}
                  <span class="text-accent-11">{currentPlayer.name}</span>, it&rsquo;s your turn!
                {/if}
              </span>
            {/if}
          </div>

          {#if isGameOver}
            <Button variant="primary" onclick={restartGame}>Play Again</Button>
          {:else}
            <div class="grid grid-cols-2 gap-2 sm:gap-3">
              <Button variant="primary" disabled={currentWord.length < 4} onclick={submitWord}>
                Submit Word
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

<style>
  dialog[open] {
    animation: scale-in 150ms ease-out;
  }

  dialog[open]::backdrop {
    animation: fade-in 150ms ease-out;
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

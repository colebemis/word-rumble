import type { Board, ColorName, GameMove } from "./types";
import words from "./words.txt?raw";

export const IS_HOLIDAY_SEASON = true;

const VOWELS = "AEIOU";
const CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ";
const VOWEL_RATIO = 0.4;
const GRID_SIZE = 5;
const COLORS: ColorName[] = ["red", "orange", "amber", "green", "blue", "purple", "pink"];

const REGULAR_EMOJI = [
  "🎉",
  "🎊",
  "🏆",
  "🥳",
  "🌟",
  "💯",
  "🔥",
  "👏",
  "🙌",
  "😎",
  "🚀",
  "💪",
  "🏅",
  "🎈",
  "🍾",
] as const;

const HOLIDAY_EMOJI = [
  "🎄",
  "🎅",
  "🦌",
  "⛄",
  "❄️",
  "✨",
  "🎁",
  "🔔",
  "🌟",
  "🧝",
  "🛷",
  "🍪",
  "☃️",
] as const;

const EMOJI = IS_HOLIDAY_SEASON ? HOLIDAY_EMOJI : REGULAR_EMOJI;

export const WINNING_SCORE = 50;
export const LETTER_VALUES: Record<string, number> = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
};

const REINDEER_NAMES = [
  "Dasher",
  "Dancer",
  "Prancer",
  "Vixen",
  "Comet",
  "Cupid",
  "Donner",
  "Blitzen",
  "Rudolph",
] as const;

export function generateBoard(): Board {
  const board = new Array(GRID_SIZE * GRID_SIZE);
  for (let i = 0; i < board.length; i++) {
    board[i] = getRandomLetter();
  }
  return board;
}

function getRandomLetter() {
  return Math.random() < VOWEL_RATIO ? getRandomVowel() : getRandomConsonant();
}

function getRandomVowel() {
  return VOWELS[Math.floor(Math.random() * VOWELS.length)];
}

function getRandomConsonant() {
  return CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
}

export function getRandomEmoji() {
  return EMOJI[Math.floor(Math.random() * EMOJI.length)];
}

export function calculateWordValue(word: string) {
  return word.split("").reduce((acc, letter) => acc + LETTER_VALUES[letter.toUpperCase()], 0);
}

export function calculatePlayerScore(moves: GameMove[]) {
  return moves.reduce((acc, move) => {
    if (move.type === "submit-word") {
      return acc + calculateWordValue(move.word);
    }

    return acc;
  }, 0);
}

export function getRandomPlayerColors(): [ColorName, ColorName] {
  if (IS_HOLIDAY_SEASON) {
    // During holiday season, always return red and green in random order
    return Math.random() < 0.5 ? ["red", "green"] : ["green", "red"];
  }

  // Regular color selection logic for non-holiday season
  const colors = [...COLORS];
  const firstIndex = Math.floor(Math.random() * colors.length);
  const firstColor = colors[firstIndex];
  colors.splice(firstIndex, 1);
  const secondColor = colors[Math.floor(Math.random() * colors.length)];
  return [firstColor, secondColor];
}

const validWords = new Set(words.split("\n").map((word) => word.trim().toLowerCase()));

export function validateWord(word: string): boolean {
  return validWords.has(word.toLowerCase());
}

const REGULAR_SUCCESS_MESSAGES = {
  small: [
    // 4-7 points
    "A word is a word, right?",
    "At least it's not zero!",
    "Small but mighty!",
    "It's a start. Keep going!",
    "Low score, high potential!",
    "Rome wasn't built in a day.",
    "Points are points... I guess.",
    "That word needs a growth spurt!",
  ],
  medium: [
    // 8-12 points
    "Now we're cookin'!",
    "You're making moves!",
    "Solid!",
    "Every letter counts!",
    "Climbing that word ladder!",
  ],
  large: [
    // 13-17 points
    "Bravo, wordsmith!",
    "Your brain is on fire! 🔥",
    "That's a word for the books!",
    "Vocabulary flex! 💪",
    "You're a word wizard, Harry! 🧙‍♂️",
    "One step closer to Linda status!",
    "Linda would approve!",
  ],
  huge: [
    // 18+ points
    "Linguistic legend! 👑",
    "Dropping knowledge bombs! 💣",
    "A+ in wordology! 💯",
    "Mic drop! 🎤",
    "Channeling your inner Linda?",
  ],
} as const;

const HOLIDAY_SUCCESS_MESSAGES = {
  small: [
    // 4-7 points
    "As cute as an elf! 🧝",
    "Like a tiny jingle bell! 🔔",
    "Every snowflake counts! ❄️",
    "Sweet as a sugar cookie! 🍪",
    "Warming up like hot cocoa! ☕",
  ],
  medium: [
    // 8-12 points
    "Dashing through the words! 🛷",
    "Merry and bright! ✨",
    "Ho ho ho! 🎅",
    "Festive and fabulous! 🎄",
    "Jingling all the way! 🔔",
  ],
  large: [
    // 13-17 points
    "Christmas magic in action! ✨",
    "Santa would be proud! 🎅",
    "Spreading holiday cheer! 🎄",
    "Like finding a present under the tree! 🎁",
    "Rudolph is giving you a high-five! 🦌",
  ],
  huge: [
    // 18+ points
    "Christmas miracle! 🌟",
    "You're the star on top of the tree! ⭐",
    "Santa's putting you on the Nice List! 📜",
    "Making the North Pole proud! 🎅",
    "Magical as Christmas Eve! 🎄",
  ],
} as const;

const SUCCESS_MESSAGES = IS_HOLIDAY_SEASON ? HOLIDAY_SUCCESS_MESSAGES : REGULAR_SUCCESS_MESSAGES;

export function getSuccessMessage(score: number): string {
  const getRandomMessage = (category: keyof typeof SUCCESS_MESSAGES) => {
    const messages = SUCCESS_MESSAGES[category];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (score >= 18) {
    return getRandomMessage("huge");
  }
  if (score >= 13) {
    return getRandomMessage("large");
  }
  if (score >= 8) {
    return getRandomMessage("medium");
  }
  return getRandomMessage("small");
}

export function getRandomReindeerNames(): [string, string] {
  const names = [...REINDEER_NAMES];
  const firstIndex = Math.floor(Math.random() * names.length);
  const firstName = names[firstIndex];
  names.splice(firstIndex, 1);
  const secondName = names[Math.floor(Math.random() * names.length)];
  return [firstName, secondName];
}

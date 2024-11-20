export type ColorName = "red" | "orange" | "amber" | "green" | "blue" | "purple" | "pink";

export type Board = (string | null)[];

export type GameMove = { type: "submit-word"; word: string } | { type: "new-board" };

export type Player = {
  name: string;
  color: ColorName;
  moves: GameMove[];
};

export type GameState = {
  board: Board;
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  selectedIndexes: number[];
};

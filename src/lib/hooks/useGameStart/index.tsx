import { create } from "zustand";

interface GAME_STATE {
  gameStart: boolean;
  setGameStart(state: boolean): void;
}

export const useGameStart = create<GAME_STATE>((set) => ({
  gameStart: false,
  setGameStart: (passedState: boolean) => set({ gameStart: passedState }),
}));

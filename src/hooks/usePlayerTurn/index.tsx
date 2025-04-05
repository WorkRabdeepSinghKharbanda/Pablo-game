import { create } from "zustand";

interface PLAYER_TURN {
  playerTurn: number;
  totalPlayer: number;
  setTurn: (passedPlayer: number) => void;
  setTotalPlayer: (totalPlayer: number) => void;
}

export const usePlayerTurn = create<PLAYER_TURN>((set) => ({
  playerTurn: -1,
  totalPlayer: -1,
  setTurn: (passedTurn: number) =>
    set((state) => ({ playerTurn: passedTurn % state.totalPlayer })),
  setTotalPlayer: (passedPlayer: number) => set({ totalPlayer: passedPlayer }),
}));

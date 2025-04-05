import { create } from "zustand";
import { CARD } from "../../types";
import { getAllCombinationData, getRandomIndex } from "../../helper";

interface PLAYER_TURN {
  playerCardData: Record<string, CARD[]>;
  setPlayerCardData: (playerCardData: Record<string, CARD[]>) => void;
  setInitialPlayerData: (noOfPlayer: number) => void;
}


// Set initial cards to all the player with total plauyer
const getInitailData = (totalPlayerNumber: number): Record<string, CARD[]> => {
  const allCombinationCardList = getAllCombinationData();

  // Store data of randomly store player cards data
  const tempPlayerCardsData: { [key: number]: CARD[] } = {};
  let distrubtePlayerTurn = 1;

  while (allCombinationCardList.length > 0) {
    const randomArrayIndex = getRandomIndex(allCombinationCardList.length);
    if (!tempPlayerCardsData[distrubtePlayerTurn]) {
      tempPlayerCardsData[distrubtePlayerTurn] = [];
    }
    tempPlayerCardsData[distrubtePlayerTurn].push(
      allCombinationCardList[randomArrayIndex]
    );
    allCombinationCardList.splice(randomArrayIndex, 1);
    distrubtePlayerTurn = (distrubtePlayerTurn + 1) % totalPlayerNumber;
  }
  return tempPlayerCardsData;
};

export const usePlayerCard = create<PLAYER_TURN>((set) => ({
  playerCardData: {} as Record<string, CARD[]>,
  setPlayerCardData: (passedPlayerCardData: Record<string,CARD[]>) => set({ playerCardData: passedPlayerCardData }),
  setInitialPlayerData: (passedNoOfPlayer: number) => set({ playerCardData: getInitailData(passedNoOfPlayer) }),
}));

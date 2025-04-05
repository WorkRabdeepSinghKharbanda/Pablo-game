import { RANK, SUIT } from "../constant";
import { CARD } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(obj:any) {
    if(obj === undefined || obj === null) return true;
    return false;
}

export const getRandomIndex = (arrLength: number) => {
  const index = Math.floor(Math.random() * arrLength);
  return index;
};

export const getAllCombinationData = () => {
    const tempICard: CARD[] = [];
    Object.values(SUIT).forEach((currentCardType) => {
      Object.values(RANK).forEach((currerntCardValue) => {
        tempICard.push({
          card_type: currentCardType as SUIT,
          card_values: currerntCardValue as RANK,
        });
      });
    });
    return tempICard;
  };
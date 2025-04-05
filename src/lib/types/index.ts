import { RANK, SUIT } from "../constant";

export interface CARD {
  card_type: SUIT;
  card_values: RANK;
}
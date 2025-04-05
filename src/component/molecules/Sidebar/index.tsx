import { useEffect, useState } from "react";
import { RANK, SUIT, VALID_INJECT_STATE } from "../../../lib/constant";
import { useCardTable, usePlayerTurn } from "../../../lib/hooks";
import Card from "../Card";
import styles from "./style.module.scss";
import { CARD } from "../../../lib/types";
import { usePlayerCard } from "../../../lib/hooks/usePlayerCardData";
import { isEmpty } from "../../../lib/helper";

const Sidebar = () => {
  const [disablePass, setDisablePass] = useState(true);
  const [distributeGameFirstChance, setDistributeGameFirstChance] = useState(true);

  const { playerCardData, setPlayerCardData } =
    usePlayerCard();
  const { tableData, setCardTypeToTableTop, setCardTypeToTableBottom } =
    useCardTable();
  const { playerTurn, setTurn } = usePlayerTurn();

  // const [playerCardData, setPlayerCardData] = useState<{
  //   [key: string]: CARD[];
  // }>({});


  // Disable pass button when have a valid card
  useEffect(() => {
    const tempPlayerCardData = playerCardData[playerTurn];
    if (tempPlayerCardData) {
      let isPassStateEnable = true;
      tempPlayerCardData.forEach((passedCardData: CARD) => {
        const isValidState = validateCardData(passedCardData);
        if (
          isValidState === VALID_INJECT_STATE.BOTTOM ||
          isValidState === VALID_INJECT_STATE.TOP
        ) {
          isPassStateEnable = false;
        }
      });
      setDisablePass(!isPassStateEnable);
    }
  }, [playerTurn]);

  const validateCardData = (passedCardDetails: CARD) => {
    const CARD_SUIT = passedCardDetails.card_type;
    const CARD_RANK = passedCardDetails.card_values;
    const suitRankArray = tableData[CARD_SUIT];

    if (isEmpty(suitRankArray)) {
      if (CARD_RANK != RANK.SEVEN) {
        return VALID_INJECT_STATE.INVALID;
      }
      return VALID_INJECT_STATE.BOTTOM;
    }

    const suitList: RANK[] = [
      RANK.ACE,
      RANK.TWO,
      RANK.THREE,
      RANK.FOUR,
      RANK.FIVE,
      RANK.SIX,
      RANK.SEVEN,
      RANK.EIGHT,
      RANK.NINE,
      RANK.TEN,
      RANK.JACK,
      RANK.QUEEN,
      RANK.KING,
    ];

    const FIRST_INDEX_RANK_ON_TABLE = suitList.indexOf(
      suitRankArray[0].card_values
    );
    const LAST_INDEX_RANK_ON_TABLE = suitList.indexOf(
      suitRankArray[suitRankArray.length - 1].card_values
    );

    const INDEX_RANK_OF_PLAYER_CARD = suitList.indexOf(CARD_RANK);

    if (INDEX_RANK_OF_PLAYER_CARD + 1 === FIRST_INDEX_RANK_ON_TABLE) {
      return VALID_INJECT_STATE.TOP;
    }
    if (INDEX_RANK_OF_PLAYER_CARD - 1 === LAST_INDEX_RANK_ON_TABLE) {
      return VALID_INJECT_STATE.BOTTOM;
    }
    return VALID_INJECT_STATE.INVALID;
  };

  const passUserTurn = () => {
    setTurn(playerTurn + 1);
  };

  const handleCardsSelect = (passedCardDetails: CARD) => {
    // after first card is selected
    if (distributeGameFirstChance) {
      setDistributeGameFirstChance(false);
    }

    // VALIDATION IS LEFT
    const isValidState = validateCardData(passedCardDetails);
    
    if (isValidState == VALID_INJECT_STATE.INVALID) {
      alert("RUN A VALID SUIT RANK CARD");
      return;
    }

    // REMOVE DATA FROM PLAYER DATA
    let indexToRemove = -1;
    const tempPlayerData = playerCardData;

    for (let key = 0; key < tempPlayerData[playerTurn].length; key++) {
      const cardData = tempPlayerData[playerTurn][key];
      if (
        cardData.card_values === passedCardDetails.card_values &&
        cardData.card_type === passedCardDetails.card_type
      ) {
        indexToRemove = key;
        break;
      }
    }

    if (tempPlayerData[playerTurn].length === 0) {
      alert(`PLAYER ${playerTurn} is winner`);
    }

    tempPlayerData[playerTurn].splice(indexToRemove, 1);
    setPlayerCardData(tempPlayerData);

    // ADD DATA TO TABLE DATA
    if (isValidState == VALID_INJECT_STATE.TOP) {
      setCardTypeToTableTop(passedCardDetails);
    }

    if (isValidState == VALID_INJECT_STATE.BOTTOM) {
      setCardTypeToTableBottom(passedCardDetails);
    }

    // Update player turn
    setTurn(playerTurn + 1);
  };

  const firstCardValidation = (passedCard: CARD) => {
    if ((passedCard.card_type === SUIT.HEARTS && passedCard.card_values === RANK.SEVEN) || !distributeGameFirstChance) {
      return false;
    }
    return true;
  };

  return (
    <div className={`${styles["sidebar"]}`}>
      <div>
        <p className="text-dark">PLAYER TURN: {playerTurn + 1}</p>
        <button
          disabled={disablePass}
          className={"btn btn-danger button"}
          onClick={passUserTurn}
        >
          Pass
        </button>
        <p className="text-dark pt-3">Select your card</p>
      </div>
      <div>
        {playerTurn.toString() &&
          playerCardData[playerTurn.toString()].map((currentCard,passedKey) => {
            return (
              <button
                key={passedKey}
                className={`btn btn-transparent mx-auto w-100 d-flex justify-content-center`}
                disabled={firstCardValidation(currentCard)}
                onClick={() => handleCardsSelect(currentCard)}
              >
                <Card
                  suit={currentCard.card_type}
                  rank={currentCard.card_values}
                />
              </button>
            );
          })}
      </div>
    </div>
  );
};
export default Sidebar;

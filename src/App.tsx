/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { SUIT, RANK, VALID_INJECT_STATE } from "./Utils/Constant";
import { usePlayerTurn, useCardTable } from "./hooks/index";
import Card from "./Component/Card";
import styles from "./style.module.scss";
import { isEmpty } from "./Utils/Attribution";

interface CARD {
  card_type: SUIT;
  card_values: RANK;
}

function App() {
  const [inputTotalPlayer, setInputTotalPlayer] = useState<number>(0);
  const [triggerDistributeCard, setTriggerDistributeCard] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [disablePass, setDisablePass] = useState(true);
  const [distributeGameFirstChance, setDistributeGameFirstChance] =
    useState(true);

  const [playerCardData, setPlayerCardData] = useState<{
    [key: string]: CARD[];
  }>({});

  // setCardTypeToTableTop
  const { playerTurn, setTurn, totalPlayer, setTotalPlayer } = usePlayerTurn();
  const { tableData, setCardTypeToTableTop, setCardTypeToTableBottom } =
    useCardTable();

  const getRandomIndex = (arrLength: number) => {
    const index = Math.floor(Math.random() * arrLength);
    return index;
  };

  // Disable pass button when have a valid card
  useEffect(()=> {
    const tempPlayerCardData = playerCardData[playerTurn];
    if(tempPlayerCardData) {
      let isPassStateEnable = true;
      tempPlayerCardData.forEach((passedCardData:CARD) => {
        const isValidState = validateCardData(passedCardData);
        if(isValidState === VALID_INJECT_STATE.BOTTOM || isValidState === VALID_INJECT_STATE.TOP) {
          isPassStateEnable = false;
        }
      })
      setDisablePass(!isPassStateEnable);
    }
  },[playerTurn])

  const getAllCombinationData = () => {
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

  useEffect(() => {
    if (triggerDistributeCard && totalPlayer >= 2) {
      // Get all permutaion of Deck 52
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
        distrubtePlayerTurn = (distrubtePlayerTurn + 1) % totalPlayer;
      }
      setPlayerCardData(tempPlayerCardsData);

      setTimeout(() => {
        setGameStart(true);
      }, 3000);
    }
  }, [triggerDistributeCard]);

  useEffect(() => {
    if (gameStart) {
      Object.keys(playerCardData).forEach((currentPlayerCardKey) => {
        playerCardData[currentPlayerCardKey].forEach((cardDetails) => {
          if (
            cardDetails.card_type == SUIT.HEARTS &&
            cardDetails.card_values == RANK.SEVEN
          ) {
            setTurn(parseInt(currentPlayerCardKey));
          }
        });
      });
    }
  }, [gameStart]);

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
    if (
      (passedCard.card_type === SUIT.HEARTS &&
        passedCard.card_values === RANK.SEVEN) ||
      !distributeGameFirstChance
    ) {
      return false;
    }
    return true;
  };

  const handleSetPlayer = () => {
    if (inputTotalPlayer >= 2) {
      setTotalPlayer(inputTotalPlayer);
    } else {
      alert("DONT ADD BELOW 2 player");
    }
  };

  const passUserTurn = () => {
    setTurn(playerTurn + 1);
  };

  return (
    <>
      <div>
        <h1>PABLO GAME</h1>

        {/* SET PLAYERS */}
        {totalPlayer === -1 && (
          <div>
            <div>
              <label>Total Player:</label>
              <input
                type="number"
                onChange={(e) => setInputTotalPlayer(Number(e.target.value))}
              />
            </div>
            <button
              className={`btn btn-primary px-3 py-2 mt-3 ${styles.button} w-auto`}
              onClick={() => handleSetPlayer()}
            >
              Set Total Player
            </button>
          </div>
        )}
        {totalPlayer <= 1 && (
          <div>
            <p>Select more than 1 players</p>
          </div>
        )}
        {/* DISTRIBUTING CARDS */}
        {totalPlayer >= 2 && !gameStart && (
          <div className="mx-3">
            <button
              className={`btn btn-primary px-3 py-2 ${styles.button}`}
              onClick={() => setTriggerDistributeCard(true)}
            >
              Distribute Cards
            </button>
            {triggerDistributeCard && (
              <p>Distributing Card between {totalPlayer}</p>
            )}

            {/* Display Player Data */}
            {!gameStart && (
              <div className="d-flex gap-3">
                {playerCardData &&
                  Object.keys(playerCardData).map(
                    (currentIndex: string, indexKey) => {
                      return (
                        <div
                          key={indexKey}
                          style={{ width: `${100 / totalPlayer}%` }}
                        >
                          <p>{currentIndex}</p>
                          {playerCardData[currentIndex].map(
                            (currentPlayerCard) => (
                              <Card
                                suit={currentPlayerCard.card_type}
                                rank={currentPlayerCard.card_values}
                              />
                            )
                          )}
                        </div>
                      );
                    }
                  )}
              </div>
            )}
          </div>
        )}

        {gameStart && playerTurn != -1 && (
          <div>
            <h2>PLAYER TURN: {playerTurn}</h2>

            {/* display CARDS */}
            <div
              className="d-flex justify-content-center w-100 overflow-scroll"
              style={{ height: "50vh" }}
            >
              <div className="d-flex gap-3">
                {Object.keys(tableData).map((currentIndex) => {
                  const suitIndex = currentIndex as SUIT;
                  return (
                    <div>
                      <h2>SUIT: {currentIndex}</h2>

                      <div style={{ minWidth: "120px" }}>
                        {tableData[suitIndex].map((suitItem) => (
                          <Card
                            suit={suitItem.card_type}
                            rank={suitItem.card_values}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`${styles["option-container"]}`}>
              <div>
                <p className="text-dark">PLAYER TURN: {playerTurn}</p>
                <button
                  disabled={disablePass}
                  className={'btn btn-danger button'}
                  onClick={passUserTurn}
                >
                  Pass
                </button>
              </div>
              <div>
                {playerTurn.toString() &&
                  playerCardData[playerTurn.toString()].map((currentCard) => {
                    return (
                      <div
                        className="text-center"
                        style={{ minWidth: "120px" }}
                      >
                        <Card
                          suit={currentCard.card_type}
                          rank={currentCard.card_values}
                        />
                        <button
                          className={`btn btn-primary mx-auto ${styles.button}`}
                          disabled={firstCardValidation(currentCard)}
                          onClick={() => handleCardsSelect(currentCard)}
                        >
                          SELECT CARD
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import { useGameStart, usePlayerCard, usePlayerTurn } from "../../../lib/hooks";
import styles from "./style.module.scss";
import Card from "../Card";
import { RANK, SUIT } from "../../../lib/constant";

const DistributionCard = () => {
  const { totalPlayer, setTurn } = usePlayerTurn();
  const { gameStart, setGameStart } = useGameStart();

  const [distributionClick, setDistributionClick] = useState(false);
  const { playerCardData, setInitialPlayerData } = usePlayerCard();
  const [triggerDistributeCard, setTriggerDistributeCard] = useState(false);

  const handleDistributionCard = () => {
    setTriggerDistributeCard(true);
    setInitialPlayerData(totalPlayer);
    setDistributionClick(true);
    
    setTimeout(() => {
      setGameStart(true);
    }, 300);
  };


  useEffect(()=> {
    if(playerCardData) {
      setStartingPlayer();
    }
  },[playerCardData]);
  
  const setStartingPlayer = () => {
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
  

  return (
    <div className="mx-3 pt-5">
      <h1>PABLO GAME</h1>
      <button
        disabled={distributionClick}
        className={`btn btn-primary px-3 py-2 ${styles.button} my-4`}
        onClick={handleDistributionCard}
      >
        Distribute Cards
      </button>
      {triggerDistributeCard && <p>Distributing Card between {totalPlayer}</p>}

      {/* Display Player Data */}
      {!gameStart && (
        <div
          className={`d-flex gap-3 overflow-scroll px-5 justify-content-center ${styles["distribution-container"]}`}
        >
          {playerCardData &&
            Object.keys(playerCardData).map(
              (currentIndex: string, indexKey) => {
                return (
                  <div
                    key={indexKey}
                    className="d-flex flex-column align-items-center mt-4"
                  >
                    <p>Player: {parseInt(currentIndex) + 1}</p>
                    {playerCardData[currentIndex].map((currentPlayerCard,cardIndexKey) => (
                      <Card
                        key={cardIndexKey}
                        suit={currentPlayerCard.card_type}
                        rank={currentPlayerCard.card_values}
                      />
                    ))}
                  </div>
                );
              }
            )}
        </div>
      )}
    </div>
  );
};
export default DistributionCard;

import { SUIT } from "../../../lib/constant";
import { useCardTable, usePlayerTurn } from "../../../lib/hooks";
import Card from "../Card";
import style from './style.module.scss';

const CardTable = () => {
  const { playerTurn  } = usePlayerTurn();
  const { tableData } = useCardTable();
  return (
    <div
      className={`float-right ${style["game-container"]} pt-5 ${style["game-info"]}`}
    >
      {/* display CARDS */}
      <h2>PABLO GAME</h2>
      <p>PLAYER TURN: {playerTurn + 1}</p>
      <div className="d-flex justify-content-center gap-4 w-100">
        {Object.keys(tableData).map((currentIndex) => {
          const suitIndex = currentIndex as SUIT;
          return (
            <div className="mt-5">
              <h3>
                SUIT: <span>{currentIndex}</span>
              </h3>

              <div style={{ minWidth: "120px" }}>
                {tableData[suitIndex].map((suitItem) => (
                  <Card suit={suitItem.card_type} rank={suitItem.card_values} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardTable;

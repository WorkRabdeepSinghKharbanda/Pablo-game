import { useState } from "react";
import { usePlayerTurn } from "../../../lib/hooks";
import styles from "./style.module.scss";
const SetupPlayer = () => {
  const [inputTotalPlayer, setInputTotalPlayer] = useState<number>(0);
  const { setTotalPlayer } = usePlayerTurn();

  const handleSetPlayer = () => {
    setTotalPlayer(inputTotalPlayer);
  };
  return (
    <div>
      <h1 className="pt-5">PABLO GAME</h1>
      <div>
        <div>
          <label>Total Player:</label>
          <input
            type="number"
            onChange={(e) => setInputTotalPlayer(Number(e.target.value))}
          />
        </div>
        <button
          className={`btn btn-primary px-3 py-2 mt-5 mb-3 ${styles.button} w-auto`}
          onClick={() => handleSetPlayer()}
        >
          Set Total Player
        </button>
      </div>

      {inputTotalPlayer <= 1 && (
        <div>
          <p>Select more than 1 players</p>
        </div>
      )}
    </div>
  );
};
export default SetupPlayer;

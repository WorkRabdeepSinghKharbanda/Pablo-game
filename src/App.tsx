/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./style.module.scss";
import { useGameStart, usePlayerTurn } from "./lib/hooks";
import SetupPlayer from "./component/molecules/SetupPlayer";
import DistributionCard from "./component/molecules/DistributionCard";
import Sidebar from "./component/molecules/Sidebar";
import CardTable from "./component/molecules/CardTable";

function App() {
  const { gameStart } = useGameStart();
  const { totalPlayer } = usePlayerTurn();

  return (
    <>
      <div>
        {/* SET PLAYERS */}
        {totalPlayer < 1 && (<SetupPlayer />)}

        {/* DISTRIBUTING CARDS */}
        {totalPlayer >= 2 && !gameStart && <DistributionCard />}

        {gameStart && (
          <div className={`d-flex ${styles["vh-100"]}`}>
            <Sidebar />
            <CardTable />
          </div>
        )}
      </div>
    </>
  );
}

export default App;

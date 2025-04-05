import { RANK, SUIT } from "../../../lib/constant";
import style from "./style.module.scss";

interface CardProps {
  suit: SUIT;
  rank: RANK;
}

const Card = ({ suit, rank }: CardProps) => {
  return (
    <div className={`${style.card} position-relative mb-4`} style={{zIndex: rank}}>
      <div className={style.first_value}>
        <p className="mx-auto">{rank}</p>
        <p>{suit}</p>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center top-50 start-50 translate-middle position-absolute">
        <div>
          <p>
            {suit} {suit}
          </p>
        </div>
        <div>
          <p>{suit}</p>
        </div>
        <div>
          <p>
            {suit} {suit}
          </p>
        </div>

      </div>

      <div className={style.last_value}>
        <p className="mx-auto">{rank}</p>
        <div>
          <p>{suit}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;

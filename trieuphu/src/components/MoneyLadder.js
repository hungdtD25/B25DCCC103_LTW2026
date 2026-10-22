import { PRIZES } from "../data";
import { formatMoney } from "../utils";

export default function MoneyLadder({
  current
}) {
  return (
    <aside className="ladder">
      <h3>Tiền thưởng</h3>

      {PRIZES.map((prize, i) => (
        <div
          key={prize}
          className={`ladder-row ${
            i + 1 === current ? "active" : ""
          } ${
            [5, 10, 15].includes(i + 1)
              ? "milestone"
              : ""
          }`}
        >
          <span>{i + 1}</span>
          <span>{formatMoney(prize)}</span>
        </div>
      )).reverse()}
    </aside>
  );
}
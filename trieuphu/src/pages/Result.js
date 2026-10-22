import {
  Link,
  useLocation
} from "react-router-dom";

import { formatMoney } from "../utils";

export default function Result() {
  const { state } = useLocation();

  if (!state) {
    return (
      <section className="panel center">
        <h1>Chưa có kết quả</h1>

        <Link
          className="primary inline"
          to="/"
        >
          Về trang chủ
        </Link>
      </section>
    );
  }

  const messages = {
    win: "Chúc mừng! Bạn đã trở thành triệu phú!",
    wrong: "Rất tiếc, bạn đã trả lời sai!",
    timeout: "Hết giờ!",
    stop: "Bạn đã dừng cuộc chơi."
  };

  return (
    <section className="panel center result">
      <div className="hero-star">★</div>

      <p className="eyebrow">
        KẾT QUẢ TRÒ CHƠI
      </p>

      <h1>
        {messages[state.reason] ||
          "Kết thúc lượt chơi"}
      </h1>

      <h2>{state.name}</h2>

      <div className="result-money">
        {formatMoney(state.prize)}
      </div>

      <p>
        Số câu trả lời đúng:{" "}
        <b>{state.correctCount}/15</b>
      </p>

      <div className="actions">
        <Link
          className="primary inline"
          to="/play"
        >
          Chơi lại
        </Link>

        <Link
          className="secondary inline"
          to="/"
        >
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
import { useNavigate } from "react-router-dom";

export default function Home({
  playerName,
  setPlayerName
}) {
  const navigate = useNavigate();

  const start = (event) => {
    event.preventDefault();

    if (playerName.trim()) {
      navigate("/play");
    }
  };

  return (
    <section className="hero">
      <div className="hero-star">★</div>

      <p className="eyebrow">
        THỬ THÁCH KIẾN THỨC
      </p>

      <h1>Ai là triệu phú?</h1>

      <p>
        15 câu hỏi · 30 giây mỗi câu ·
        Giải thưởng 250.000.000 đ
      </p>

      <ul className="rules">
        <li>
          Trả lời đúng để tăng tiền thưởng.
        </li>
        <li>
          Các câu 5, 10, 15 là mốc an toàn.
        </li>
        <li>
          Bạn có 3 quyền trợ giúp trong mỗi lượt chơi.
        </li>
      </ul>

      <form
        className="start-form"
        onSubmit={start}
      >
        <label htmlFor="player">
          Tên người chơi
        </label>

        <input
          id="player"
          value={playerName}
          onChange={(e) =>
            setPlayerName(e.target.value)
          }
          placeholder="Nhập tên của bạn"
          maxLength={40}
        />

        <button
          className="primary"
          disabled={!playerName.trim()}
        >
          Bắt đầu
        </button>
      </form>
    </section>
  );
}
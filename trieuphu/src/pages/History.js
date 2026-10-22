import { Link } from "react-router-dom";
import { formatMoney } from "../utils";

export default function History({
  history,
  setHistory
}) {
  const sorted = [...history].sort(
    (a, b) => b.prize - a.prize
  );

  const total = history.reduce(
    (sum, item) => sum + item.prize,
    0
  );

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">THỐNG KÊ</p>
        <h1>Lịch sử chơi</h1>
      </div>

      <div className="stats">
        <div>
          <span>Số lượt chơi</span>
          <b>{history.length}</b>
        </div>

        <div>
          <span>Tiền thưởng cao nhất</span>
          <b>
            {formatMoney(
              sorted[0]?.prize || 0
            )}
          </b>
        </div>

        <div>
          <span>Tổng tiền thưởng</span>
          <b>{formatMoney(total)}</b>
        </div>
      </div>

      {history.length ? (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Người chơi</th>
                  <th>Số câu đúng</th>
                  <th>Tiền thưởng</th>
                  <th>Lý do</th>
                  <th>Thời gian</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      {item.correctCount}/15
                    </td>
                    <td>
                      {formatMoney(item.prize)}
                    </td>
                    <td>{item.reason}</td>
                    <td>
                      {new Date(
                        item.playedAt
                      ).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="danger-button"
            onClick={() => {
              if (
                window.confirm(
                  "Bạn có chắc muốn xóa toàn bộ lịch sử?"
                )
              ) {
                setHistory([]);
              }
            }}
          >
            Xóa lịch sử
          </button>
        </>
      ) : (
        <div className="empty">
          <p>Chưa có lượt chơi nào.</p>

          <Link
            to="/"
            className="primary inline"
          >
            Chơi ngay
          </Link>
        </div>
      )}
    </section>
  );
}
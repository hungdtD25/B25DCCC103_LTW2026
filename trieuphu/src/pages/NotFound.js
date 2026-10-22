import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="panel center">
      <div className="not-found">
        404
      </div>

      <h1>Không tìm thấy trang</h1>

      <Link
        to="/"
        className="primary inline"
      >
        Về trang chủ
      </Link>
    </section>
  );
}
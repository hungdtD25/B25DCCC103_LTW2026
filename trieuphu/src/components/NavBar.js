import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
      <NavLink to="/">
        Trang chủ
      </NavLink>

      <NavLink to="/questions">
        Ngân hàng câu hỏi
      </NavLink>

      <NavLink to="/history">
        Lịch sử
      </NavLink>
    </nav>
  );
}
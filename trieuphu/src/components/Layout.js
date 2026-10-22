import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          ★ AI LÀ TRIỆU PHÚ
        </div>

        <NavBar />
      </header>

      <main className="container">
        {children}
      </main>

      <footer>
        Mini project ReactJS · Routing · Hooks · Axios · LocalStorage
      </footer>
    </div>
  );
}
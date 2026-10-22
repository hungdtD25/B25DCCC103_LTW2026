import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import axios from "axios";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Play from "./pages/Play";
import Result from "./pages/Result";
import History from "./pages/History";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";
import { getHistory } from "./utils";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerName, setPlayerName] = useState("");

  const [history, setHistory] = useState(
    () => getHistory()
  );

  // Tải câu hỏi từ file JSON
  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/data/questions.json", {
        signal: controller.signal
      })
      .then((response) => {
        setQuestions(response.data);
        setError("");
      })
      .catch((err) => {
        if (err.code !== "ERR_CANCELED") {
          setError("Không tải được câu hỏi");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // Lưu lịch sử mỗi khi state history thay đổi
  useEffect(() => {
    localStorage.setItem(
      "ltw_trieuphu_history",
      JSON.stringify(history)
    );
  }, [history]);

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
            />
          }
        />

        <Route
          path="/play"
          element={
            playerName.trim() ? (
              <Play
                questions={questions}
                loading={loading}
                loadError={error}
                playerName={playerName}
                setHistory={setHistory}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/result"
          element={<Result />}
        />

        <Route
          path="/history"
          element={
            <History
              history={history}
              setHistory={setHistory}
            />
          }
        />

        <Route
          path="/questions"
          element={
            <QuestionBank
              questions={questions}
              loading={loading}
              error={error}
            />
          }
        />

        <Route
          path="/questions/:id"
          element={
            <QuestionDetail
              questions={questions}
              loading={loading}
            />
          }
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Layout>
  );
}
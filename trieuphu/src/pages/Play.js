import {
  useCallback,
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import QuestionCard from "../components/QuestionCard";
import AnswerButton from "../components/AnswerButton";
import Timer from "../components/Timer";
import MoneyLadder from "../components/MoneyLadder";
import Lifelines from "../components/Lifelines";
import AudienceChart from "../components/AudienceChart";

import { PRIZES } from "../data";
import {
  calcPrize,
  formatMoney,
  shuffle
} from "../utils";

export default function Play({
  questions = [],
  loading = false,
  loadError = "",
  playerName,
  setHistory
}) {
  const navigate = useNavigate();

  const [roundQuestions, setRoundQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("answering");

  const [used, setUsed] = useState({
    fifty: false,
    audience: false
  });

  const [hidden, setHidden] = useState([]);
  const [audience, setAudience] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [runId] = useState(() => Date.now());

  // Chọn tối đa 5 câu ở mỗi mức độ.
  useEffect(() => {
    if (!Array.isArray(questions) || questions.length === 0) {
      setRoundQuestions([]);
      return;
    }

    const easy = shuffle(
      questions.filter((q) => q.level === "Dễ")
    ).slice(0, 5);

    const medium = shuffle(
      questions.filter(
        (q) => q.level === "Trung bình"
      )
    ).slice(0, 5);

    const hard = shuffle(
      questions.filter((q) => q.level === "Khó")
    ).slice(0, 5);

    setRoundQuestions([
      ...easy,
      ...medium,
      ...hard
    ]);

    setCurrent(0);
    setSelected(null);
    setStatus("answering");
    setCorrectCount(0);
    setHidden([]);
    setAudience(null);
    setUsed({
      fifty: false,
      audience: false
    });
  }, [questions]);

  // Lấy câu hỏi hiện tại trong lượt chơi.
  const question = roundQuestions[current];

  // Kết thúc lượt chơi và lưu kết quả.
  const finish = useCallback(
    (why, count = correctCount) => {
      const prize = calcPrize(
        count,
        why === "win"
          ? "win"
          : why === "stop"
            ? "stop"
            : why
      );

      const record = {
        id: Date.now(),
        name: playerName,
        prize,
        correctCount: count,
        reason: why,
        playedAt: new Date().toISOString()
      };

      if (typeof setHistory === "function") {
        setHistory((old = []) => [
          record,
          ...old
        ]);
      }

      navigate("/result", {
        replace: true,
        state: {
          ...record
        }
      });
    },
    [
      correctCount,
      navigate,
      playerName,
      setHistory
    ]
  );

  // Xử lý hết giờ.
  const timeout = useCallback(() => {
    if (status !== "answering") return;

    setStatus("revealed");

    setTimeout(() => {
      finish("timeout");
    }, 2000);
  }, [finish, status]);

  // Xử lý chọn đáp án.
  const choose = useCallback(
    (index) => {
      if (
        !question ||
        status !== "answering" ||
        hidden.includes(index)
      ) {
        return;
      }

      setSelected(index);
      setStatus("locked");

      const right = index === question.answer;

      if (right) {
        setCorrectCount((count) => count + 1);
      }

      setTimeout(() => {
        if (!right) {
          finish("wrong", correctCount);
        } else if (current === 14) {
          finish("win", 15);
        } else {
          setCurrent((value) => value + 1);
          setSelected(null);
          setHidden([]);
          setAudience(null);
          setStatus("answering");
        }
      }, 2000);
    },
    [
      question,
      status,
      hidden,
      correctCount,
      current,
      finish
    ]
  );

  // Phím tắt A, B, C, D.
  useEffect(() => {
    const handler = (event) => {
      const index = [
        "a",
        "b",
        "c",
        "d"
      ].indexOf(event.key.toLowerCase());

      if (index >= 0) {
        choose(index);
      }
    };

    window.addEventListener(
      "keydown",
      handler
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handler
      );
    };
  }, [choose]);

  // Quyền trợ giúp 50:50.
  const fifty = useCallback(() => {
    if (
      !question ||
      used.fifty ||
      status !== "answering"
    ) {
      return;
    }

    const wrong = shuffle(
      [0, 1, 2, 3].filter(
        (index) => index !== question.answer
      )
    ).slice(0, 2);

    setHidden(wrong);

    setUsed((value) => ({
      ...value,
      fifty: true
    }));
  }, [
    question,
    used.fifty,
    status
  ]);

  // Quyền trợ giúp hỏi khán giả.
  const askAudience = useCallback(() => {
    if (
      !question ||
      used.audience ||
      status !== "answering"
    ) {
      return;
    }

    const correctPercentage =
      40 + Math.floor(Math.random() * 31);

    let remaining = 100 - correctPercentage;

    const values = [0, 1, 2, 3].map(
      (index) =>
        index === question.answer
          ? correctPercentage
          : 0
    );

    const wrongIndexes = [
      0,
      1,
      2,
      3
    ].filter(
      (index) => index !== question.answer
    );

    wrongIndexes.forEach((index, position) => {
      const value =
        position === wrongIndexes.length - 1
          ? remaining
          : Math.floor(
              Math.random() * (remaining + 1)
            );

      values[index] = value;
      remaining -= value;
    });

    setAudience(values);

    setUsed((value) => ({
      ...value,
      audience: true
    }));
  }, [
    question,
    used.audience,
    status
  ]);

  // Dừng cuộc chơi.
  const stop = useCallback(
    () => finish("stop"),
    [finish]
  );

  // Tính tiền thưởng hiện tại.
  const prize = correctCount > 0
    ? PRIZES[
        Math.min(correctCount - 1, 14)
      ]
    : 0;

  // Kiểm tra trạng thái tải dữ liệu.
  if (loading) {
    return (
      <p className="notice">
        Đang tải câu hỏi...
      </p>
    );
  }

  // Hiển thị lỗi tải dữ liệu.
  if (loadError) {
    return (
      <p className="error">
        {loadError}
      </p>
    );
  }

  // Kiểm tra ngân hàng câu hỏi.
  if (
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    return (
      <div className="panel">
        <h2>Chưa có câu hỏi</h2>

        <p>
          Hãy kiểm tra file
          public/data/questions.json.
        </p>

        <button onClick={() => navigate("/")}>
          Về trang chủ
        </button>
      </div>
    );
  }

  // Chờ chọn câu hỏi cho lượt chơi.
  if (roundQuestions.length === 0) {
    return (
      <p className="notice">
        Đang chuẩn bị câu hỏi...
      </p>
    );
  }

  // Kiểm tra câu hỏi hiện tại.
  if (!question) {
    return (
      <div className="panel">
        <h2>Ngân hàng câu hỏi chưa đủ</h2>

        <p>
          Cần có câu hỏi ở các mức Dễ,
          Trung bình và Khó để tạo lượt chơi.
        </p>

        <button onClick={() => navigate("/")}>
          Về trang chủ
        </button>
      </div>
    );
  }

  // Kiểm tra cấu trúc đáp án.
  if (
    !Array.isArray(question.options) ||
    question.options.length !== 4
  ) {
    return (
      <div className="panel">
        <h2>Dữ liệu câu hỏi không hợp lệ</h2>

        <p>
          Câu hỏi hiện tại cần có đúng 4 đáp án
          trong thuộc tính options.
        </p>
      </div>
    );
  }

  // Giao diện chính của trò chơi.
  return (
    <div className="game-layout">
      <section className="game-main">

        <div className="game-top">
          <span>
            Người chơi: <b>{playerName}</b>
          </span>

          <Timer
            running={status === "answering"}
            resetKey={`${current}-${runId}`}
            onTimeout={timeout}
          />
        </div>

        <QuestionCard
          index={current}
          total={roundQuestions.length}
          question={question}
        />

        <div className="answers">
          {question.options.map(
            (option, index) => {
              let answerStatus = "";

              if (
                status === "locked" ||
                status === "revealed"
              ) {
                if (index === question.answer) {
                  answerStatus = "correct";
                } else if (index === selected) {
                  answerStatus = "incorrect";
                }
              }

              return (
                <AnswerButton
                  key={`${
                    question.id ?? current
                  }-${index}`}
                  index={index}
                  text={option}
                  disabled={
                    status !== "answering" ||
                    hidden.includes(index)
                  }
                  status={answerStatus}
                  onClick={() => choose(index)}
                />
              );
            }
          )}
        </div>

        <Lifelines
          used={used}
          locked={status !== "answering"}
          onFifty={fifty}
          onAudience={askAudience}
          onStop={stop}
        />

        {audience && (
          <section className="panel">
            <h3>Kết quả hỏi khán giả</h3>

            <AudienceChart
              percentages={audience}
            />
          </section>
        )}

        <p className="current-prize">
          Tiền thưởng hiện tại:{" "}
          <b>{formatMoney(prize)}</b>
        </p>

      </section>

      <MoneyLadder
        current={current + 1}
      />
    </div>
  );
}
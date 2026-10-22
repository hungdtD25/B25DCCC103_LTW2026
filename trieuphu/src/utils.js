import { MILESTONES, PRIZES } from "./data";

export function calcPrize(
  correctCount,
  reason = "stop"
) {
  const count = Math.max(
    0,
    Math.min(correctCount, PRIZES.length)
  );

  // Trả lời đúng toàn bộ 15 câu
  if (reason === "win") {
    return PRIZES[PRIZES.length - 1];
  }

  // Trả lời sai hoặc hết thời gian
  if (
    reason === "wrong" ||
    reason === "timeout"
  ) {
    const safe = MILESTONES.filter(
      (n) => n <= count
    );

    return safe.length
      ? PRIZES[safe[safe.length - 1] - 1]
      : 0;
  }

  // Người chơi chủ động dừng
  return count > 0
    ? PRIZES[count - 1]
    : 0;
}

export function formatMoney(amount) {
  return (
    new Intl.NumberFormat("vi-VN").format(
      amount || 0
    ) + " đ"
  );
}

export function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [copy[i], copy[j]] = [
      copy[j],
      copy[i]
    ];
  }

  return copy;
}

export function getHistory() {
  try {
    return JSON.parse(
      localStorage.getItem(
        "ltw_trieuphu_history"
      ) || "[]"
    );
  } catch {
    return [];
  }
}
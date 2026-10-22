import { useEffect, useState } from "react";

export default function Timer({
  running,
  resetKey,
  onTimeout
}) {
  const [seconds, setSeconds] = useState(30);

  // Đặt lại đồng hồ khi chuyển câu
  useEffect(() => {
    setSeconds(30);
  }, [resetKey]);

  // Đếm ngược
  useEffect(() => {
    if (!running) return undefined;

    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          onTimeout();
          return 0;
        }

        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running, resetKey, onTimeout]);

  return (
    <div
      className={`timer ${
        seconds <= 10 ? "danger" : ""
      }`}
    >
      ⏱ Còn {seconds} giây
    </div>
  );
}
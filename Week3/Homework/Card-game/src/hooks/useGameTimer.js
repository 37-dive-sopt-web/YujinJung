import { useEffect, useRef, useState } from "react";

// status가 'playing'일 때 10ms 간격으로 0.01초씩 감소
export default function useGameTimer(status, onTimeUp) {
  const [leftSeconds, setLeftSeconds] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    if (status !== "playing") return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setLeftSeconds((s) => {
        if (s <= 0.01) {
          clearInterval(timerRef.current);
          onTimeUp?.(); // 시간 종료 콜백 (예: setStatus("lost"))
          return 0;
        }
        return +(s - 0.01).toFixed(2);
      });
    }, 10);

    return () => clearInterval(timerRef.current);
  }, [status, onTimeUp]);

  return { leftSeconds, setLeftSeconds, timerRef };
}

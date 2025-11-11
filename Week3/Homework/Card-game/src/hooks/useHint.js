import { useEffect, useRef, useState } from "react";

export default function useHint() {
  const [hint, setHint] = useState("");
  const timerRef = useRef();

  const showHint = (msg, ms = 1000) => {
    clearTimeout(timerRef.current);
    setHint(String(msg || ""));
    if (msg) timerRef.current = setTimeout(() => setHint(""), ms);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { hint, showHint, clearHint: () => setHint("") };
}
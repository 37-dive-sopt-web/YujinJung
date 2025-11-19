import { useEffect, useMemo, useRef, useState } from "react";
import { LEVELS, buildDeck } from "../utils/deck";
import useHint from "../hooks/useHint";
import useGameTimer from "../hooks/useGameTimer";
import useWinAuto from "../hooks/useWinAuto";

// GameView 내부에서만 쓰는 로컬 게임 로직 훅
export default function useGameEngine(initialLevel = 1) {
  const [level, setLevel] = useState(initialLevel);
  const [deck, setDeck] = useState([]);
  const [status, setStatus] = useState("idle");
  const [opened, setOpened] = useState([]);
  const [history, setHistory] = useState([]);

  // 안내 플래그 제어
  const isFirstRound = useRef(true);   // 첫 세트(첫 매치 시도) 여부
  const isFirstGame  = useRef(true);   // 앱 첫 진입 후 첫 게임 여부

  // 잠금 & 타이머
  const lock = useRef(false);
  const { leftSeconds, setLeftSeconds } = useGameTimer(status, () => setStatus("lost"));

  // 힌트 훅
  const { hint, showHint, clearHint } = useHint();

  // 레벨에 따른 그리드 정보
  const grid = useMemo(() => LEVELS[level], [level]);

  // Game (전체 초기화/재시작)
  const resetGame = (lv = level) => {
    const data = buildDeck(lv).map((c) => ({ ...c, state: "back" }));
    setDeck(data);
    setOpened([]);
    setStatus("playing");
    setLevel(lv);
    setLeftSeconds(LEVELS[lv].limit);  // 타이머 초기화
    setHistory([]);
    isFirstRound.current = true;
    clearHint();
  };
  const softReset = () => resetGame(level); // 같은 레벨로만 재시작

  // First Mount (앱 첫 진입 시 한 번): 초기 레벨로 게임 시작
  useEffect(() => { resetGame(initialLevel);}, []);

  // 승리 자동 판정(모든 카드 매치)
  useWinAuto({ deck, status, level, leftSeconds, setStatus });

  // Action: 카드 열기 & 판정
  const openCard = (id) => {
    if (status !== "playing" || lock.current) return;

    const index = deck.findIndex((c) => c.id === id);
    const card = deck[index];
    if (!card) return;

    if (card.state !== "back") {
      showHint("이미 선택한 카드예요.", 900);
      return;
    }

    // 1) 선택 카드를 앞면으로 뒤집기
    const next = deck.slice();
    next[index] = { ...card, state: "front" };
    setDeck(next);

    // 2) 열린 카드 목록에 추가
    const nextOpened = [...opened, id];
    setOpened(nextOpened);

    // 3) 두 장이 되면 매치 판정
    if (nextOpened.length === 2) {
      lock.current = true;
      const [id1, id2] = nextOpened;
      const c1 = next.find((c) => c.id === id1);
      const c2 = next.find((c) => c.id === id2);

      if (c1.value === c2.value) {
        showHint("성공!", 900);
        setTimeout(() => {
          setDeck((d) =>
            d.map((c) => (id1 === c.id || id2 === c.id ? { ...c, state: "matched" } : c))
          );
          setHistory((h) => [{ type: "success", pair: c1.value }, ...h].slice(0, 10));
          setOpened([]);
          lock.current = false;
          isFirstRound.current = false;
          isFirstGame.current = false;
        }, 150);
      } else {
        showHint("실패!", 900);
        setTimeout(() => {
          setDeck((d) =>
            d.map((c) => (id1 === c.id || id2 === c.id ? { ...c, state: "back" } : c))
          );
          setHistory((h) => [{ type: "fail", a: c1.value, b: c2.value }, ...h].slice(0, 10));
          setOpened([]);
          lock.current = false;
          isFirstRound.current = false;
          isFirstGame.current = false;
        }, 700);
      }
    }
  };

  return {
    // state
    grid, level, deck, status, leftSeconds, opened, history, hint,
    // flags
    isFirstRound, isFirstGame,
    // actions
    setLevel, resetGame, softReset, openCard, showHint,
  };
}
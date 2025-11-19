import { useEffect } from "react";
import { LEVELS } from "../utils/deck";
import useGameEngine from "../hooks/useGameEngine";
import LevelSelect from "../components/LevelSelect";
import HUD from "../components/HUD";
import History from "../components/History";
import Card from "../components/Card";
import Modal from "../components/Modal";

export default function GameView() {
  const {
    grid, level, deck, status, leftSeconds, opened, history, hint,
    isFirstRound, isFirstGame,
    setLevel, resetGame, softReset, openCard, showHint,
  } = useGameEngine(1);

  // 승/패 시 3초 후 자동 초기화
  useEffect(() => {
    if (status === "won" || status === "lost") {
      const t = setTimeout(() => softReset(), 3000);
      return () => clearTimeout(t);
    }
  }, [status, softReset]);

  const cols = grid.cols;
  const cell = cols >= 6 ? 64 : 72;

  // 안내 메시지 계산 (hint가 우선)
  const defaultMsg =
    status !== "playing" ? "" :
    (opened.length === 0 && isFirstGame.current)
      ? "카드를 눌러 게임을 시작해주세요."
      : (opened.length === 1 && isFirstRound.current)
        ? "카드를 하나 더 선택해주세요."
        : "잠시만 기다려주세요.";

  const message = hint || defaultMsg;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 grid lg:grid-cols-[1fr_320px] gap-6">
      {/* 보드 */}
      <section className="bg-sky-100 border border-sky-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sky-900">게임 보드</h3>
          <button
            onClick={() => softReset()}
            className="px-2.5 py-1 rounded-full bg-rose-400 text-white text-xs font-medium
            shadow-sm hover:bg-rose-500 active:bg-rose-600 transition"
          >
            게임 리셋
          </button>
        </div>

        <div className="grid gap-3 justify-center" style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)` }}>
          {deck.map(c => (
            <Card key={c.id} card={c} size={cell} onOpen={openCard} showHint={showHint}/>
          ))}
        </div>
      </section>

      {/* 사이드 패널 */}
      <aside className="space-y-4">
        <div className="bg-sky-100 border border-sky-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-sky-700 font-medium">설정</span>
            <span className="text-[10px] text-sky-700">Level {level}</span>
          </div>

          <LevelSelect level={level} onChangeLevel={setLevel} onReset={resetGame}/>
          <HUD leftSeconds={leftSeconds} deck={deck} />

          <div className="bg-white border border-sky-200 rounded-lg p-3 min-h-[64px]">
            <p className="text-sky-700 text-sm">안내 메시지</p>
            <p className="text-gray-700 text-sm mt-1">
              {status === "won" && "축하합니다! 모든 짝을 맞췄어요 🎉"}
              {status === "lost" && `시간 초과 💥 (제한 ${LEVELS[level].limit}s)`}
              {status === "playing" && message}
            </p>
          </div>
        </div>

        <History history={history} />
      </aside>

      {/* 종료 모달 */}
      <Modal open={status === "won" || status === "lost"} title={status === "won" ? "게임 승리 🩵" : "게임 패배 😵‍💫"}>
        <p className="mb-3">
          {status === "won"
            ? `기록: ${(LEVELS[level].limit - leftSeconds).toFixed(2)} 초`
            : `남은 시간: ${leftSeconds.toFixed(2)} 초`}
        </p>
        <button onClick={() => resetGame(level)} className="px-3 py-1.5 rounded-md bg-sky-500 text-white hover:bg-sky-600">
          다시 시작
        </button>
        <p className="text-xs text-gray-500 mt-2">3초 후 자동으로 초기화됩니다.</p>
      </Modal>
    </div>
  );
}

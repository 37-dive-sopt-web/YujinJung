import { useEffect } from "react";
import { LEVELS } from "../utils/deck";
import { addRanking } from "../utils/rankings";

// 모든 카드가 매치되면 승리 처리 + 랭킹 기록
export default function useWinAuto({ deck, status, level, leftSeconds, setStatus }) {
  useEffect(() => {
    if (!deck.length || status !== "playing") return;
    const allMatched = deck.every((c) => c.state === "matched");
    if (allMatched) {
      setStatus("won");
      const seconds = LEVELS[level].limit - leftSeconds;
      addRanking({ level, seconds });
    }
  }, [deck, status, level, leftSeconds, setStatus]);
}

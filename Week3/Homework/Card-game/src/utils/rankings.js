const KEY = "card-game:rankings";

export function readRankings() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
}

export function addRanking({ level, seconds, at = Date.now() }) {
  const next = [...readRankings(), { level, seconds, at }];
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearRankings() {
  localStorage.setItem(KEY, JSON.stringify([]));
}

/* 레벨 내림차순 → 시간 오름차순 정렬 */
export function sortRankings(list) {
  return [...list].sort((a, b) => {
    if (a.level !== b.level) return b.level - a.level;
    return a.seconds - b.seconds;
  });
}

export function formatTime(sec) {
  return sec.toFixed(2);
}

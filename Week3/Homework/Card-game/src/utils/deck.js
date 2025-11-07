export function shuffle(array, rng = Math.random) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const LEVELS = {
  1: { rows: 4, cols: 4, limit: 45 },
  2: { rows: 4, cols: 6, limit: 60 },
  3: { rows: 6, cols: 6, limit: 100 },
};

export function buildDeck(level = 1) {
  const { rows, cols } = LEVELS[level] ?? LEVELS[1];
  const total = rows * cols;
  if (total % 2 !== 0) throw new Error("짝수 개수 필요");

  const pairs = total / 2;
  const base = Array.from({ length: pairs }, (_, i) => i + 1);
  const cards = [];
  for (const v of base) {
    cards.push({ id: `${v}-a`, value: v });
    cards.push({ id: `${v}-b`, value: v });
  }
  return shuffle(cards);
}

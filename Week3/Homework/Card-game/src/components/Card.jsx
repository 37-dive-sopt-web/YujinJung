export default function Card({ card, size = 64, onOpen, showHint }) {
  const isFront = card.state === "front";
  const isMatched = card.state === "matched";

  const click = () => {
    if (isMatched) return;
    if (isFront) {
      showHint?.("이미 선택한 카드예요.", 900);
      return;
    }
    onOpen(card.id);
  };

  return (
    <button
      aria-label={`card-${card.id}`}
      onClick={click}
      className={`relative card rounded-lg border border-sky-300 bg-sky-200 hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50
        ${isFront || isMatched ? "flipped" : ""} ${isMatched ? "match-glow" : ""}`} // 매치 성공 시 반짝이는 효과
      style={{ width: size, height: size }}
    >
      <div className="card-face absolute inset-0 grid place-items-center text-3xl text-sky-900">?</div>
      <div className="card-face card-back absolute inset-0 grid place-items-center bg-white rounded-lg text-xl font-semibold">
        {card.value}
      </div>
    </button>
  );
}

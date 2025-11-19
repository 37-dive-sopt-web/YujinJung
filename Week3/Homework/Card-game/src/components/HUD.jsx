export default function HUD({ leftSeconds, deck }) {
  const matched = deck.filter(c => c.state === "matched").length / 2;
  const totalPairs = deck.length / 2;

  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="bg-white border border-sky-200 rounded-lg p-3">
        <p className="text-sky-700">남은 시간</p>
        <p className="text-xl font-bold">{leftSeconds.toFixed(2)}</p>
      </div>
      <div className="bg-white border border-sky-200 rounded-lg p-3">
        <p className="text-sky-700">성공 쌍</p>
        <p className="text-xl font-bold">{matched}/{totalPairs}</p>
      </div>
      <div className="bg-white border border-sky-200 rounded-lg p-3">
        <p className="text-sky-700">남은 쌍</p>
        <p className="text-xl font-bold">{totalPairs - matched}</p>
      </div>
    </div>
  );
}

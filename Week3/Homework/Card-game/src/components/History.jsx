export default function History({ history }) {
  return (
    <div className="bg-white border border-sky-200 rounded-lg p-3 min-h-[120px]">
      <p className="text-sky-700 mb-2 text-sm">최근 히스토리</p>
      {!history.length && <p className="text-gray-400 text-sm">아직 뒤집은 카드가 없어요.</p>}
      <ul className="space-y-1">
        {history.map((h, i) => (
          <li key={i} className={h.type === "success" ? "text-emerald-600" : "text-rose-600"}>
            {h.type === "success" ? `매치 성공: ${h.pair}` : `실패: ${h.a} / ${h.b}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

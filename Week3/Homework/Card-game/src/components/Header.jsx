export default function Header({ tab, setTab }) {
  return (
    <header className="sticky top-0 z-10">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[1000px] px-4 py-4
                      rounded-2xl border border-sky-200 bg-sky-100/80
                      backdrop-blur shadow-sm flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sky-900">숫자 카드 짝 맞추기</h1>
        <nav className="flex gap-2">
          {["game", "rank"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                tab === t ? "bg-sky-500 text-white shadow-md" : "bg-sky-200 text-sky-900 hover:bg-sky-300"
              }`}
            >
              {t === "game" ? "게임" : "랭킹"}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

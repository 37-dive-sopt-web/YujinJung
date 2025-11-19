import { LEVELS } from "../utils/deck";

export default function LevelSelect({ level, onChangeLevel, onReset }) {
  return (
    <div className="flex gap-2 justify-center">
      {Object.keys(LEVELS).map((lv) => (
        <button
          key={lv}
          onClick={() => { onChangeLevel(Number(lv)); onReset(Number(lv)); }}
          className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
            level === Number(lv)
              ? "bg-sky-500 text-white border-sky-600"
              : "bg-white text-sky-700 border-sky-200 hover:bg-sky-50"
          }`}
        >
          Level {lv}
        </button>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { clearRankings, formatTime, readRankings, sortRankings } from "../utils/rankings";

// 밀리초(ms) 단위의 timestamp를 "YYYY-MM-DD HH:MM:SS" 형태로 변환
function fmtDate(ms) {
  const d = new Date(ms);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  const hh = String(d.getHours()).padStart(2,"0");
  const mi = String(d.getMinutes()).padStart(2,"0");
  const ss = String(d.getSeconds()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

// 게임 기록을 불러와 테이블로 보여주는 랭킹 화면
export default function RankingView() {
  const [rows, setRows] = useState([]);
  // 랭킹 새로고침 함수
  const refresh = () => setRows(sortRankings(readRankings()));
  useEffect(() => { refresh(); }, []);

  // 기록 초기화 버튼 핸들러
  const onClear = () => {
    clearRankings();
    refresh();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* 전체 랭킹 박스 */}
      <div className="bg-sky-100 border border-sky-200 rounded-2xl p-4">

        {/* 제목 + 초기화 버튼 영역 */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sky-900">랭킹 보드</h3>
          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded-md bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200"
          >
            기록 초기화
          </button>
        </div>

        {/* 테이블 영역 */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-sky-900">
                <th className="px-3 py-2">순위</th>
                <th className="px-3 py-2">레벨</th>
                <th className="px-3 py-2">클리어 시간(초)</th>
                <th className="px-3 py-2">기록 시각</th>
              </tr>
            </thead>

            <tbody>
              {/* 기록이 하나도 없을 경우 */}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-500">아직 기록이 없습니다.</td></tr>
              )}

              {/* 기록이 있을 경우: 한 줄씩 표시 */}
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-sky-200">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">Level {r.level}</td>
                  <td className="px-3 py-2 font-semibold">{formatTime(r.seconds)}</td>
                  <td className="px-3 py-2">{fmtDate(r.at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 정렬 기준 안내 */}
        <p className="text-xs text-gray-500 mt-3">
          정렬 기준: 레벨 <b>내림차순</b> → 클리어 시간 <b>오름차순</b>
        </p>
      </div>
    </div>
  );
}

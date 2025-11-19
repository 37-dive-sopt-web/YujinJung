import { useState } from "react";
import Header from "./Components/Header";
import GameView from "./Pages/GameView";
import RankingView from "./Pages/RankingView";

export default function App() {
  const [tab, setTab] = useState("game");
  return (
    <div className="min-h-screen bg-sky-50">
      <Header tab={tab} setTab={setTab} />
      {tab === "game" ? <GameView /> : <RankingView />}
    </div>
  );
}

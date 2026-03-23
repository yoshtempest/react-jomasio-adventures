import { Outlet } from "react-router";
import { GameButtons } from "./components/Controls/GameButtons";

function App() {
  return (
    <div className="app">
      <Outlet />
      <GameButtons />
    </div>
  )
}

export default App

import { Movement } from "./components/Controls/Movement";
import { Outlet } from "react-router";
import { GameButtons } from "./components/Controls/GameButtons";

function App() {
  return (
    <div className="app">
      <Movement />
      <Outlet />
      <GameButtons />
    </div>
  )
}

export default App

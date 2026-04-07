import { Movement } from "./components/Controls/Movement";
import { Outlet } from "react-router";
import { GameButtons } from "./components/Controls/GameButtons";
import { useInventory } from "./contexts/InventoryContext";
import { Inventory } from "./components/Navbar/Inventory";

function App() {
  const { isOpen } = useInventory();
  return (
    <div className="app">
      <Movement />
      <Outlet />
      <GameButtons />
      {isOpen && <Inventory />}
    </div>
  )
}

export default App

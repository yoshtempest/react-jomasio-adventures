import { Movement } from "./components/Controls/Movement";
import { Outlet } from "react-router";
import { GameButtons } from "./components/Controls/GameButtons";
import { useInventory } from "./contexts/InventoryContext";
import { Inventory } from "./components/Navbar/Inventory";
import { useNavbar } from "./contexts/NavbarContext";
import { Navbar } from "./components/Navbar";

function App() {
  const { isOpen } = useInventory();
  const { isNavOpen } = useNavbar();
  return (
    <div className="app">
      <Movement />
      <Outlet />
      <GameButtons />
      {isOpen && <Inventory />}
      {isNavOpen && <Navbar />}
    </div>
  )
}

export default App

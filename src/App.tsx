import { Movement } from "@/components/Controls/Movement";
import { Outlet } from "react-router";
import { GameButtons } from "@/components/Controls/GameButtons";
import { useInventory } from "@/contexts/InventoryContext";
import { Inventory } from "@/components/Navbar/Inventory";
import { useNavbar } from "@/contexts/NavbarContext";
import { Navbar } from "@/components/Navbar";

import { useEffect } from "react";
import { loadGame } from "@/utils/saveGame";

import { useQuests } from "@/contexts/QuestContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { isCharacter } from "@/utils/types/player/player";

function App() {
  const { isOpen } = useInventory();
  const { isNavOpen } = useNavbar();
  const { setItems } = useInventory();
  const { setQuests } = useQuests();

  const {
    chooseClass,
    setCharacter,
  } = usePlayer();

  useEffect(() => {
    const save = loadGame();

    if (!save) return;

    setItems(save.inventory);
    setQuests(save.quests);

    if (save.playerClass) {
      chooseClass(save.playerClass);
    }

    if (save.character && isCharacter(save.character)) {
      setCharacter(save.character);
    }
  }, []);

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

import { Movement } from "@/components/Controls/Movement";
import { Outlet } from "react-router";
import { GameButtons } from "@/components/Controls/GameButtons";
import { useInventory } from "@/contexts/InventoryContext";
import { Inventory } from "@/components/Navbar/Inventory";
import { useNavbar } from "@/contexts/NavbarContext";
import { Navbar } from "@/components/Navbar";

import { useEffect, useRef } from "react";
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

  const chooseClassRef = useRef(chooseClass);
  chooseClassRef.current = chooseClass;
  const setCharacterRef = useRef(setCharacter);
  setCharacterRef.current = setCharacter;
  const setItemsRef = useRef(setItems);
  setItemsRef.current = setItems;
  const setQuestsRef = useRef(setQuests);
  setQuestsRef.current = setQuests;

  useEffect(() => {
    const save = loadGame();

    if (!save) return;

    setItemsRef.current(save.inventory);
    setQuestsRef.current(save.quests);

    if (save.playerClass) {
      chooseClassRef.current(save.playerClass);
    }

    if (save.character && isCharacter(save.character)) {
      setCharacterRef.current(save.character);
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

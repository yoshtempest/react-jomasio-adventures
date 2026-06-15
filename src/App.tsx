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
import { useEquipment } from "@/contexts/EquipmentContext";
import { isCharacter } from "@/utils/types/player/player";

function App() {
  const { isOpen } = useInventory();
  const { isNavOpen } = useNavbar();
  const { setItems, setMaxSlots } = useInventory();
  const { setQuests } = useQuests();

  const { chooseClass, setCharacter, player } = usePlayer();

  const { getEquippedItem } = useEquipment();

  useEffect(() => {
    const bag = getEquippedItem(player.character, "bag");
    const bonus = bag?.bonusSlots ?? 0;
    setMaxSlots(20 + bonus);
  }, [player.character, getEquippedItem, setMaxSlots]);

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
  );
}

export default App;

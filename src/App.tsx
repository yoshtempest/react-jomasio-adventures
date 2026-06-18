import { Movement } from "@/components/Controls/Movement";
import { Outlet, useLocation } from "react-router";
import { GameButtons } from "@/components/Controls/GameButtons";
import { useInventory } from "@/contexts/InventoryContext";
import { Inventory } from "@/components/Navbar/Inventory";
import { useNavbar } from "@/contexts/NavbarContext";
import { Navbar } from "@/components/Navbar";

import { useEffect, useRef } from "react";
import { loadGame, saveGame } from "@/utils/saveGame";

import { useQuests } from "@/contexts/QuestContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { isCharacter } from "@/utils/types/player/player";

function App() {
  const { isOpen } = useInventory();
  const { isNavOpen } = useNavbar();
  const { items, setItems, setMaxSlots } = useInventory();
  const { setQuests, refreshDailyWeekly, quests } = useQuests();

  const { chooseClass, setCharacter, player, playerClass, hyperCoins } =
    usePlayer();

  const { getEquippedItem } = useEquipment();
  const location = useLocation();

  const prevRouteRef = useRef(location.pathname);

  useEffect(() => {
    const bag = getEquippedItem(player.character, "bag");
    const bonus = bag?.bonusSlots ?? 0;
    setMaxSlots(20 + bonus);
  }, [player.character, getEquippedItem, setMaxSlots]);

  const SKIP_LAST_ROUTE = new Set(["/", "/home", "/tutorial"]);

  useEffect(() => {
    if (prevRouteRef.current === location.pathname) return;
    prevRouteRef.current = location.pathname;

    const lastRoute = SKIP_LAST_ROUTE.has(location.pathname)
      ? (loadGame()?.lastRoute ?? "/firstscreen")
      : location.pathname;

    saveGame({
      lastRoute,
      inventory: items,
      quests,
      playerClass,
      character: player.character,
      hyperCoins,
    });
  }, [location.pathname, items, quests, playerClass, player.character, hyperCoins]);

  const chooseClassRef = useRef(chooseClass);
  chooseClassRef.current = chooseClass;
  const setCharacterRef = useRef(setCharacter);
  setCharacterRef.current = setCharacter;
  const setItemsRef = useRef(setItems);
  setItemsRef.current = setItems;
  const setQuestsRef = useRef(setQuests);
  setQuestsRef.current = setQuests;
  const refreshDailyWeeklyRef = useRef(refreshDailyWeekly);
  refreshDailyWeeklyRef.current = refreshDailyWeekly;

  useEffect(() => {
    const save = loadGame();

    if (save) {
      setItemsRef.current(save.inventory);
      setQuestsRef.current(save.quests);
    }

    refreshDailyWeeklyRef.current();

    if (!save) return;

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

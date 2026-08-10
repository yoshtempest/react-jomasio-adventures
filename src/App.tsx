import { Movement } from "@/components/Controls/Movement";
import { Outlet, useLocation } from "react-router";
import { GameButtons } from "@/components/Controls/GameButtons";
import { XPBarNotification } from "@/components/XPBarNotification";
import { useInventory } from "@/contexts/InventoryContext";
import { Inventory } from "@/components/Navbar/Inventory";
import { useNavbar } from "@/contexts/NavbarContext";
import { Navbar } from "@/components/Navbar";

import { useEffect, useRef } from "react";
import {
  loadGame,
  saveGame,
  saveGameToCloud,
  loadGameFromCloud,
} from "@/utils/save/saveGame";

import { useQuests } from "@/contexts/QuestContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { isCharacter } from "@/utils/types/player/player";
import { useAuth } from "@/contexts/AuthContext";
import { useHungerTimer } from "@/hooks/hunger/useHungerTimer";
import { useRegenTimer } from "@/hooks/player/useRegenTimer";
import { useExploreLocation } from "@/hooks/scene/useExploreLocation";

function App() {
  const { isOpen } = useInventory();
  const { isNavOpen, isClosing } = useNavbar();
  const { items, setItems, setMaxSlots } = useInventory();
  const { setQuests, refreshDailyWeekly, quests } = useQuests();

  const { chooseClass, setCharacter, player, playerClass } = usePlayer();

  const { getEquippedItem } = useEquipment();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useHungerTimer();
  useRegenTimer();
  useExploreLocation();

  const prevRouteRef = useRef(location.pathname);
  const didSyncRef = useRef(false);

  useEffect(() => {
    const bag = getEquippedItem(player.character, "bag");
    const bonus = bag?.bonusSlots ?? 0;
    setMaxSlots(20 + bonus);
  }, [player.character, getEquippedItem, setMaxSlots]);

  // Sync from cloud on mount
  useEffect(() => {
    if (!isAuthenticated || didSyncRef.current) return;
    didSyncRef.current = true;

    loadGameFromCloud().then((cloud) => {
      if (!cloud) return;
      setItems(cloud.inventory);
      setQuests(cloud.quests);
      if (cloud.playerClass) chooseClass(cloud.playerClass);
      if (cloud.character && isCharacter(cloud.character)) {
        setCharacter(cloud.character);
      }
    });
  }, [isAuthenticated, setItems, setQuests, chooseClass, setCharacter]);

  // Save on route change
  useEffect(() => {
    if (prevRouteRef.current === location.pathname) return;
    prevRouteRef.current = location.pathname;

    const skipRoutes = new Set(["/", "/home", "/tutorial"]);
    const lastRoute =
      skipRoutes.has(location.pathname) ||
      location.pathname.startsWith("/replay")
        ? (loadGame()?.lastRoute ?? "/jomasioEntrance")
        : location.pathname;

    const data = {
      lastRoute,
      inventory: items,
      quests,
      playerClass,
      character: player.character,
    };

    saveGame(data);
    if (isAuthenticated) {
      saveGameToCloud(data);
    }
  }, [
    location.pathname,
    items,
    quests,
    playerClass,
    player.character,
    isAuthenticated,
  ]);

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
      <XPBarNotification />
      {isOpen && <Inventory />}
      {(isNavOpen || isClosing) && (
        <div className="navbarClip">
          <Navbar />
        </div>
      )}
    </div>
  );
}

export default App;

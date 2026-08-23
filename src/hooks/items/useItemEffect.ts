import { useLocation, useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useInventory } from "@/contexts/InventoryContext";
import { ItemService } from "@/services/items/itemService";

type Props = {
  playSFX?: (src: string, volume?: number) => void;
};

/**
 * Adaptador React do ItemService: monta as portas a partir dos contexts
 * e devolve `getEffect` para os consumidores.
 */
export function useItemEffect({ playSFX }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setMode, player } = usePlayer();
  const { closeNavbar } = useNavbar();
  const { progress, restoreHunger } = useCharacterProgress();
  const { removeItem } = useInventory();

  function getEffect(itemId: ItemId) {
    const service = new ItemService({
      navigate: (pathname, state) => void navigate(pathname, { state }),
      getLocation: () => location,
      setMode,
      closeNavbar,
      getActiveCharacter: () => player.character,
      getHunger: (character) => progress[character].hunger,
      restoreHunger,
      removeItem,
      playSFX,
    });

    return service.getEffect(itemId);
  }

  return { getEffect };
}

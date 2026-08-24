import {
  getItemAction,
  rollEncounter,
} from "./itemEffects";
import { MAX_HUNGER, MAX_SLEEP } from "@/contexts/CharacterProgressContext";
import { POTION_CONFIG, activateXpBuff } from "@/utils/buffs/xpBuff";

/**
 * Portas para o mundo externo (contexts/router). O ItemService não conhece
 * React — quem o constrói injeta as dependências.
 */
export type ItemServicePorts = {
  navigate: (pathname: string, state: unknown) => void;
  getLocation: () => { pathname: string; state: unknown };
  setMode: (mode: PlayerMode) => void;
  closeNavbar: () => void;
  getActiveCharacter: () => CharacterId | null;
  getHunger: (character: CharacterId) => number;
  restoreHunger: (character: CharacterId, amount: number) => void;
  getSleep: (character: CharacterId) => number;
  restoreSleep: (character: CharacterId, amount: number) => void;
  removeItem: (id: ItemId) => void;
  playSFX?: (src: string, volume?: number) => void;
};

export class ItemService {
  private readonly ports: ItemServicePorts;

  constructor(ports: ItemServicePorts) {
    this.ports = ports;
  }

  /**
   * Usa um item e devolve a closure de efeito (null = não utilizável).
   * O consumo do item acontece aqui dentro — nunca no chamador.
   */
  getEffect(itemId: ItemId): (() => void) | null {
    const action = getItemAction(itemId);
    if (!action) return null;

    switch (action.kind) {
      case "encounter":
        return () => {
          this.ports.playSFX?.(action.sfxSrc, 0.6);
          const encounter = rollEncounter();
          this.ports.closeNavbar();
          this.ports.setMode("select");
          const location = this.ports.getLocation();
          this.ports.navigate(location.pathname, {
            ...(location.state ?? {}),
            goodPowderEncounter: encounter,
          });
        };

      case "openMap":
        return () => {
          this.ports.playSFX?.(action.sfxSrc, 0.6);
          this.ports.setMode("map");
        };

      case "xpPotion": {
        const cfg = POTION_CONFIG[itemId];
        if (!cfg) return null;
        return () => {
          this.ports.playSFX?.(action.sfxSrc, 0.8);
          activateXpBuff(cfg.durationMs, cfg.multiplier, itemId);
          this.ports.removeItem(itemId);
        };
      }

      case "food":
        return () => {
          const character = this.ports.getActiveCharacter();
          if (!character) return;
          if (this.ports.getHunger(character) >= MAX_HUNGER) return;
          this.ports.playSFX?.(action.sfxSrc, 0.8);
          this.ports.restoreHunger(character, action.restore);
          this.ports.removeItem(itemId);
        };

      case "energetic":
        return () => {
          const character = this.ports.getActiveCharacter();
          if (!character) return;
          const sleepFull = this.ports.getSleep(character) >= MAX_SLEEP;
          const hungerFull = this.ports.getHunger(character) >= MAX_HUNGER;
          if (sleepFull && hungerFull) return;
          this.ports.playSFX?.(action.sfxSrc, 0.8);
          this.ports.restoreSleep(character, action.sleep);
          this.ports.restoreHunger(character, action.hunger);
          this.ports.removeItem(itemId);
        };
    }
  }
}

import { type ReactNode } from "react";
import { SoundEffectsProvider } from "@/contexts/SoundEffectsContext";
import { NavbarProvider } from "@/contexts/NavbarContext";
import { FlagProvider } from "@/contexts/FlagContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { QuestProvider } from "@/contexts/QuestContext";
import { CharacterProgressProvider } from "@/contexts/CharacterProgressContext";
import { PlayTimeProvider } from "@/contexts/PlayTimeContext";
import { EquipmentProvider } from "@/contexts/EquipmentContext";
import { TitleProvider } from "@/contexts/TitleContext";
import { BestiaryProvider } from "@/contexts/BestiaryContext";
import { PetProgressProvider } from "@/contexts/PetProgressContext";
import { ProfessionProgressProvider } from "@/contexts/ProfessionProgressContext";
import { ProfessionBadgeProvider } from "@/contexts/ProfessionBadgeContext";
import { TombstoneProvider } from "@/contexts/TombstoneContext";
import { GroundItemProvider } from "@/contexts/GroundItemContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { BattleNavbarProvider } from "@/contexts/BattleNavbarContext";
import { GameControlsProvider } from "@/contexts/GameControlsContext";
import { CharacterUnlockProvider } from "@/contexts/CharacterUnlockContext";

export function GameProviders({ children }: { children: ReactNode }) {
  return (
    <SoundEffectsProvider>
      <NavbarProvider>
        <FlagProvider>
          <InventoryProvider>
            <QuestProvider>
              <CharacterProgressProvider>
                <PetProgressProvider>
                  <ProfessionProgressProvider>
                    <ProfessionBadgeProvider>
                      <TombstoneProvider>
                        <GroundItemProvider>
                          <EquipmentProvider>
                            <TitleProvider>
                              <BestiaryProvider>
                                <PlayerProvider>
                                  <PlayTimeProvider>
                                    <BattleNavbarProvider>
                                      <GameControlsProvider>
                                        <CharacterUnlockProvider>
                                          {children}
                                        </CharacterUnlockProvider>
                                      </GameControlsProvider>
                                    </BattleNavbarProvider>
                                  </PlayTimeProvider>
                                </PlayerProvider>
                              </BestiaryProvider>
                            </TitleProvider>
                          </EquipmentProvider>
                        </GroundItemProvider>
                      </TombstoneProvider>
                    </ProfessionBadgeProvider>
                  </ProfessionProgressProvider>
                </PetProgressProvider>
              </CharacterProgressProvider>
            </QuestProvider>
          </InventoryProvider>
        </FlagProvider>
      </NavbarProvider>
    </SoundEffectsProvider>
  );
}

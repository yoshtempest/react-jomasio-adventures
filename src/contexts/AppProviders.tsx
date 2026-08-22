import { type ReactNode } from "react";
import { TransitionProvider } from "@/contexts/TransitionContext";
import { PWAProvider } from "@/contexts/PWAContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { UpdateProvider } from "@/contexts/UpdateContext";
import { AudioProvider } from "@/contexts/AudioContext";
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
import { PlayerProvider } from "@/contexts/PlayerContext";
import { GameControlsProvider } from "@/contexts/GameControlsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BattleInfoProvider } from "@/contexts/BattleInfoContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TransitionProvider>
        <PWAProvider>
          <UpdateProvider>
            <SettingsProvider>
              <AudioProvider>
                <SoundEffectsProvider>
                  <NavbarProvider>
                    <BattleInfoProvider>
                      <FlagProvider>
                        <InventoryProvider>
                          <QuestProvider>
                            <CharacterProgressProvider>
                              <PetProgressProvider>
                                <ProfessionProgressProvider>
                                  <EquipmentProvider>
                                    <TitleProvider>
                                      <BestiaryProvider>
                                        <PlayerProvider>
                                          <PlayTimeProvider>
                                            <GameControlsProvider>
                                              {children}
                                            </GameControlsProvider>
                                          </PlayTimeProvider>
                                        </PlayerProvider>
                                      </BestiaryProvider>
                                    </TitleProvider>
                                  </EquipmentProvider>
                                </ProfessionProgressProvider>
                              </PetProgressProvider>
                            </CharacterProgressProvider>
                          </QuestProvider>
                        </InventoryProvider>
                      </FlagProvider>
                    </BattleInfoProvider>
                  </NavbarProvider>
                </SoundEffectsProvider>
              </AudioProvider>
            </SettingsProvider>
          </UpdateProvider>
        </PWAProvider>
      </TransitionProvider>
    </AuthProvider>
  );
}

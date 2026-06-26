import { type ReactNode } from "react";
import { TransitionProvider } from "@/contexts/TransitionContext";
import { PWAProvider } from "@/contexts/PWAContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
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
import { PlayerProvider } from "@/contexts/PlayerContext";
import { GameControlsProvider } from "@/contexts/GameControlsContext";
import { AuthProvider } from "@/contexts/AuthContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TransitionProvider>
        <PWAProvider>
          <SettingsProvider>
            <AudioProvider>
              <SoundEffectsProvider>
                <NavbarProvider>
                  <FlagProvider>
                    <InventoryProvider>
                      <QuestProvider>
                        <CharacterProgressProvider>
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
                        </CharacterProgressProvider>
                      </QuestProvider>
                    </InventoryProvider>
                  </FlagProvider>
                </NavbarProvider>
              </SoundEffectsProvider>
            </AudioProvider>
          </SettingsProvider>
        </PWAProvider>
      </TransitionProvider>
    </AuthProvider>
  );
}

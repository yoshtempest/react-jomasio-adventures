import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'

import { FlagProvider } from "@/contexts/FlagContext";
import { GameControlsProvider } from "@/contexts/GameControlsContext";
import { PlayerProvider } from '@/contexts/PlayerContext.tsx';
import { InventoryProvider } from '@/contexts/InventoryContext.tsx';
import { NavbarProvider } from '@/contexts/NavbarContext.tsx';
import { CharacterProgressProvider } from "@/contexts/CharacterProgressContext";
import { QuestProvider } from '@/contexts/QuestContext.tsx';
import { AudioProvider } from '@/contexts/AudioContext.tsx';
import { PWAProvider } from '@/contexts/PWAContext.tsx';
import { SoundEffectsProvider } from "@/contexts/SoundEffectsContext";

import { registerSW } from "virtual:pwa-register";
import { HashRouter } from "react-router";
import { Suspense } from "react";
import { lazyLoad } from "@/utils/lazyLoad";

registerSW({ immediate: true });

import { Navigate } from 'react-router';

import { Preloader } from "@/components/Preloader";
import { LoadingScreen } from "@/components/LoadingScreen";
const EntryPoint = lazyLoad(() => import('./pages/EntryPoint'));
const Intro = lazyLoad(() => import('./pages/Intro/index.tsx'));
const Matchmaking = lazyLoad(() => import('./online/Matchmaking/index.tsx'));
const Tutorial = lazyLoad(() => import('./pages/Tutorial/index.tsx'));
const Home = lazyLoad(() => import('./pages/Home/index.tsx'));
const FirstScreen = lazyLoad(() => import('./pages/FirstScreen/index.tsx'));

const CantinaBattle = lazyLoad(() => import('./pages/Cantina/Battle/index.tsx'));
const CantinaPage = lazyLoad(() => import('./pages/Cantina/index.tsx'));

const DirectorPage = lazyLoad(() => import('./pages/Director/index.tsx'));

const HallPage = lazyLoad(() => import('./pages/Hall/index.tsx'));

const PcRoomBattleOne = lazyLoad(() => import('./pages/PcRoom/Battle/One/index.tsx'));
const PcRoomBattleTwo = lazyLoad(() => import('./pages/PcRoom/Battle/Two/index.tsx'));
const PcRoomBattleThree = lazyLoad(() => import('./pages/PcRoom/Battle/Three/index.tsx'));
const PlanetarySistersBattle = lazyLoad(() => import('./pages/Hall/Battle/Two/index.tsx'));
const PcRoomPage = lazyLoad(() => import('./pages/PcRoom/index.tsx'));

const Library = lazyLoad(() => import('./pages/Library/index.tsx'));

const VandinhaFragmentBattle = lazyLoad(() => import('./pages/Battle/Vandinha/index.tsx'));
const GoatBattle = lazyLoad(() => import('./pages/Battle/Goat/index.tsx'));
const JhowSimarBattle = lazyLoad(() => import('./pages/Battle/JhowSimar/index.tsx'));
const HungryDeathBattle = lazyLoad(() => import('./pages/Battle/Hungry/index.tsx'));

const CafeteriaBattle = lazyLoad(() => import('./pages/Cafeteria/Battle/index.tsx'));
const CafeteriaPage = lazyLoad(() => import('./pages/Cafeteria/index.tsx'));
const BrodiClassOne = lazyLoad(() => import('./pages/BrodiClass/index.tsx'));
const BrodiclassBattle = lazyLoad(() => import('./pages/BrodiClass/Battle/index.tsx'));
const HellroomPage = lazyLoad(() => import('./pages/HellRoom/index.tsx'));
const HellroomBattle = lazyLoad(() => import('./pages/HellRoom/Battle/index.tsx'));
import JailsonHallBattle from './pages/Hall/Battle/One/index.tsx';

const nonBattlePages = [
  DirectorPage,
  HellroomPage,
  EntryPoint,
  Intro,
  Matchmaking,
  Tutorial,
  Home,
  FirstScreen,
  CantinaPage,
  HallPage,
  HallPage,
  PcRoomPage,
  Library,
  CafeteriaPage,
  BrodiClassOne,
];

const container = document.getElementById("root")!;

// 👇 guarda o root no próprio DOM (hack seguro)
const root =
  (container as any)._reactRoot ||
  ((container as any)._reactRoot = createRoot(container));

root.render(
  <StrictMode>
    <HashRouter>
      <PWAProvider>
        <AudioProvider>
          <SoundEffectsProvider>
            <NavbarProvider>
              <FlagProvider>
                <InventoryProvider>
                  <QuestProvider>
                    <CharacterProgressProvider>
                      <PlayerProvider>
                        <GameControlsProvider>
                          <Preloader pages={nonBattlePages} />
                          <Suspense fallback={<LoadingScreen />}>
                            <Routes>
                              <Route path="/" element={<App />}>
                                <Route index element={<EntryPoint />} />
                                <Route path="tutorial" element={<Tutorial />} />
                                <Route path="intro" element={<Intro />} />
                                <Route path="matchmaking" element={<Matchmaking />} />
                                <Route path="home" element={<Home />} />
                                <Route path="firstscreen" element={<FirstScreen />} />

                                <Route path="hall">
                                  <Route index element={<Navigate to="/hall/one" />} />
                                  <Route path=":id" element={<HallPage />} />
                                  <Route path="jailson/battle" element={<JailsonHallBattle />} />
                                  <Route path="center/battle" element={<PlanetarySistersBattle />} />
                                </Route>

                                <Route path="director">
                                  <Route index element={<Navigate to="/director/one" />} />
                                  <Route path=":id" element={<DirectorPage />} />
                                </Route>

                                <Route path="cantina">
                                  <Route index element={<Navigate to="/cantina/one" />} />
                                  <Route path=":id" element={<CantinaPage />} />
                                  <Route path="battle" element={<CantinaBattle />} />
                                </Route>

                                <Route path="hellroom">
                                  <Route index element={<Navigate to="/hellroom/one" />} />
                                  <Route path=":id" element={<HellroomPage />} />
                                  <Route path="battle" element={<HellroomBattle />} />
                                </Route>

                                <Route path="cafeteria">
                                  <Route index element={<Navigate to="/cafeteria/one" />} />
                                  <Route path=":id" element={<CafeteriaPage />} />
                                  <Route path="battle" element={<CafeteriaBattle/>} />
                                </Route>

                                <Route path="pcroom">
                                  <Route index element={<Navigate to="/pcroom/one" />} />
                                  <Route path=":id" element={<PcRoomPage />} />
                                  <Route path="battle/one" element={<PcRoomBattleOne />} />
                                  <Route path="battle/two" element={<PcRoomBattleTwo />} />
                                  <Route path="battle/three" element={<PcRoomBattleThree />} />
                                </Route>

                                <Route path="library/one" element={<Library />} />
                                <Route path="battle/hungry" element={<HungryDeathBattle />} />
                                <Route path="battle/vandinhafragment" element={<VandinhaFragmentBattle />} />
                                <Route path="battle/jhowsimar" element={<JhowSimarBattle />} />
                                <Route path="battle/goat" element={<GoatBattle />} />
                                <Route path="brodiclass/one" element={<BrodiClassOne/>} />
                                <Route path="brodiclass/battle" element={<BrodiclassBattle />} /> 
                              </Route>
                            </Routes>
                          </Suspense>
                        </GameControlsProvider>
                      </PlayerProvider>
                    </CharacterProgressProvider>
                  </QuestProvider>
                </InventoryProvider>
              </FlagProvider>
            </NavbarProvider>
          </SoundEffectsProvider>
        </AudioProvider>
      </PWAProvider>
    </HashRouter>
  </StrictMode>
);
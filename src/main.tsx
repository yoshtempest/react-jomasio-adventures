import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'

import { GameControlsProvider } from "./contexts/GameControlsContext";
import { PlayerProvider } from './contexts/PlayerContext.tsx';
import { InventoryProvider } from './contexts/InventoryContext.tsx';
import { NavbarProvider } from './contexts/NavbarContext.tsx';
import { CharacterProgressProvider } from "./contexts/CharacterProgressContext";
import { QuestProvider } from './contexts/QuestContext.tsx';
import { AudioProvider } from './contexts/AudioContext.tsx';
import { PWAProvider } from './contexts/PWAContext.tsx';

import { registerSW } from "virtual:pwa-register";
import { HashRouter } from "react-router";
import { Suspense } from "react";
import { lazyLoad } from "@/utils/lazyLoad";

registerSW({ immediate: true });

import { Navigate } from 'react-router';

import { Preloader } from "@/components/Preloader";
import { LoadingScreen } from "@/components/LoadingScreen";
const Tutorial = lazyLoad(() => import('./pages/Tutorial/index.tsx'));
const Home = lazyLoad(() => import('./pages/Home/index.tsx'));
const FirstScreen = lazyLoad(() => import('./pages/FirstScreen/index.tsx'));

const CantinaBattle = lazyLoad(() => import('./pages/Cantina/Battle/index.tsx'));
const CantinaPage = lazyLoad(() => import('./pages/Cantina/index.tsx'));

const Director = lazyLoad(() => import('./pages/Director/One/index.tsx'));
const DirectorTwo = lazyLoad(() => import('./pages/Director/Two/index.tsx'));

const HallOne = lazyLoad(() => import('./pages/Hall/Pcs/One/index.tsx'));
const HallTwo = lazyLoad(() => import('./pages/Hall/Pcs/Two/index.tsx'));
const HallLeftOne = lazyLoad(() => import('./pages/Hall/PcsToCenter/index.tsx'));
const HallCenterOne = lazyLoad(() => import('./pages/Hall/Center/One/index.tsx'));
const HallCenterFront = lazyLoad(() => import('./pages/Hall/Center/Front/index.tsx'));

const PcRoomBattleOne = lazyLoad(() => import('./pages/PcRoom/Battle/One/index.tsx'));
const PcRoomBattleTwo = lazyLoad(() => import('./pages/PcRoom/Battle/Two/index.tsx'));
const PcRoomPage = lazyLoad(() => import('./pages/PcRoom/index.tsx'));

const AfterPcRoom = lazyLoad(() => import('./pages/Hall/Pcs/One/AfterPcRoom/One/index.tsx'));
const AfterPcRoomTwo = lazyLoad(() => import('./pages/Hall/Pcs/One/AfterPcRoom/Two/index.tsx'));

const Library = lazyLoad(() => import('./pages/Library/index.tsx'));
const HallThirdClass = lazyLoad(() => import('./pages/Hall/ThirdClass/index.tsx'));

const VandinhaFragmentBattle = lazyLoad(() => import('./pages/Battle/Vandinha/index.tsx'));
const GoatBattle = lazyLoad(() => import('./pages/Battle/Goat/index.tsx'));
const JhowSimarBattle = lazyLoad(() => import('./pages/Battle/JhowSimar/index.tsx'));
const HungryDeathBattle = lazyLoad(() => import('./pages/Battle/Hungry/index.tsx'));

const CafeteriaOne = lazyLoad(() => import('./pages/Cafeteria/One/index.tsx'));
const CafeteriaBattle = lazyLoad(() => import('./pages/Cafeteria/battle/index.tsx'));
const BrodiClassOne = lazyLoad(() => import('./pages/BrodiClass/index.tsx'));

const nonBattlePages = [
  Tutorial,
  Home,
  FirstScreen,
  CantinaPage,
  Director,
  DirectorTwo,
  HallOne,
  HallTwo,
  HallLeftOne,
  HallCenterOne,
  HallCenterFront,
  PcRoomPage,
  AfterPcRoom,
  AfterPcRoomTwo,
  Library,
  HallThirdClass,
  CafeteriaOne,
  BrodiClassOne,
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <PWAProvider>
        <NavbarProvider>
          <InventoryProvider>
            <QuestProvider>
              <CharacterProgressProvider>
                <AudioProvider>
                  <PlayerProvider>
                    <GameControlsProvider>
                      <Preloader pages={nonBattlePages} />
                      <Suspense fallback={<LoadingScreen />}>
                        <Routes>
                          <Route path="/" element={<App />}>
                            <Route index element={<Tutorial />} />
                            <Route path="home" element={<Home />} />
                            <Route path="firstscreen" element={<FirstScreen />} />
                            

                            <Route path="director/one" element={<Director />} />
                            <Route path="director/two" element={<DirectorTwo />} />
                            <Route path="cantina/battle" element={<CantinaBattle />} />

                            <Route path="hall/one" element={<HallOne />} />
                            <Route path="hall/two" element={<HallTwo />} />

                            <Route path="cantina">
                              <Route index element={<Navigate to="/cantina/one" />} />
                              <Route path=":id" element={<CantinaPage />} />
                            </Route>

                            <Route path="pcroom">
                              <Route index element={<Navigate to="/pcroom/one" />} />
                              <Route path=":id" element={<PcRoomPage />} />
                              <Route path="battle/one" element={<PcRoomBattleOne />} />
                              <Route path="battle/two" element={<PcRoomBattleTwo />} />
                            </Route>

                            <Route path="hall/afterpcroom/one" element={<AfterPcRoom />} />
                            <Route path="hall/afterpcroom/two" element={<AfterPcRoomTwo />} />

                            <Route path="hall/left/one" element={<HallLeftOne />} />
                            <Route path="hall/center/one" element={<HallCenterOne />} />
                            <Route path="hall/center/front" element={<HallCenterFront />} />
                            <Route path="hall/thirdclass" element={<HallThirdClass />} />

                            <Route path="library" element={<Library />} />
                            <Route path="battle/hungry" element={<HungryDeathBattle />} />
                            <Route path="battle/vandinhafragment" element={<VandinhaFragmentBattle />} />
                            <Route path="battle/jhowsimar" element={<JhowSimarBattle />} />
                            <Route path="battle/goat" element={<GoatBattle />} />

                            <Route path="cafeteria/one" element={<CafeteriaOne/>} />
                            <Route path="cafeteria/battle" element={<CafeteriaBattle/>} />
                            <Route path="brodiclass/one" element={<BrodiClassOne/>} />
                          </Route>
                        </Routes>
                      </Suspense>
                    </GameControlsProvider>
                  </PlayerProvider>
                </AudioProvider>
              </CharacterProgressProvider>
            </QuestProvider>
          </InventoryProvider>
        </NavbarProvider>
      </PWAProvider>
    </HashRouter>
  </StrictMode>
)

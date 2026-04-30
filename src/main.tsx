import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { GameControlsProvider } from "./contexts/GameControlsContext";
import './index.css'
import App from './App.tsx'
import { PlayerProvider } from './contexts/PlayerContext.tsx';
import { InventoryProvider } from './contexts/InventoryContext.tsx';
import { NavbarProvider } from './contexts/NavbarContext.tsx';
import { CharacterProgressProvider } from "./contexts/CharacterProgressContext";
import { Navigate } from 'react-router';

import Tutorial from './pages/Tutorial/index.tsx';
import Home from './pages/Home/index.tsx';
import FirstScreen from './pages/FirstScreen/index.tsx';

import CantinaBattle from './pages/Cantina/Battle/index.tsx';
import CantinaPage from './pages/Cantina/index.tsx';

import Director from './pages/Director/One/index.tsx';
import DirectorTwo from './pages/Director/Two/index.tsx';

import HallOne from './pages/Hall/Pcs/One/index.tsx';
import HallTwo from './pages/Hall/Pcs/Two/index.tsx';
import HallLeftOne from './pages/Hall/PcsToCenter/index.tsx';
import HallCenterOne from './pages/Hall/Center/One/index.tsx';
import HallCenterFront from './pages/Hall/Center/Front/index.tsx';

import PcRoomBattleOne from './pages/PcRoom/Battle/One/index.tsx';
import PcRoomBattleTwo from './pages/PcRoom/Battle/Two/index.tsx';
import PcRoomPage from './pages/PcRoom/index.tsx';

import AfterPcRoom from './pages/Hall/Pcs/One/AfterPcRoom/One/index.tsx';
import AfterPcRoomTwo from './pages/Hall/Pcs/One/AfterPcRoom/Two/index.tsx';

import Library from './pages/Library/index.tsx';
import HallThirdClass from './pages/Hall/ThirdClass/index.tsx';
import { QuestProvider } from './contexts/QuestContext.tsx';

import VandinhaFragmentBattle from './pages/Battle/Vandinha/index.tsx';
import GoatBattle from './pages/Battle/Goat/index.tsx';
import JhowSimarBattle from './pages/Battle/JhowSimar/index.tsx';
import HungryDeathBattle from './pages/Battle/Hungry/index.tsx';

import CafeteriaOne from './pages/Cafeteria/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NavbarProvider>
        <InventoryProvider>
          <QuestProvider>
            <CharacterProgressProvider>
              <PlayerProvider>
                <GameControlsProvider>
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
                        <Route path="cantina" element={<CantinaBattle />} />
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
                    </Route>
                  </Routes>
                </GameControlsProvider>
              </PlayerProvider>
            </CharacterProgressProvider>
          </QuestProvider>
        </InventoryProvider>
      </NavbarProvider>
    </BrowserRouter>
  </StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { GameControlsProvider } from "./contexts/GameControlsContext";
import './index.css'
import App from './App.tsx'
import { PlayerProvider } from './contexts/PlayerContext.tsx';
import { InventoryProvider } from './contexts/InventoryContext.tsx';

import Tutorial from './pages/Tutorial/index.tsx';
import Home from './pages/Home/index.tsx';
import FirstScreen from './pages/FirstScreen/index.tsx';

import CantinaBattle from './pages/Cantina/Battle/index.tsx';
import Cantina from './pages/Cantina/One/index.tsx';
import CantinaTwo from './pages/Cantina/Two/index.tsx';
import CantinaThree from './pages/Cantina/Three/index.tsx';
import CantinaFour from './pages/Cantina/Four/index.tsx';

import Director from './pages/Director/One/index.tsx';
import DirectorTwo from './pages/Director/Two/index.tsx';

import HallOne from './pages/Hall/Pcs/One/index.tsx';
import HallTwo from './pages/Hall/Pcs/Two/index.tsx';
import HallLeftOne from './pages/Hall/PcsToCenter/index.tsx';
import HallCenterOne from './pages/Hall/Center/One/index.tsx';
import HallCenterFront from './pages/Hall/Center/Front/index.tsx';

import PcRoomOne from './pages/PcRoom/One/index.tsx';
import PcRoomTwo from './pages/PcRoom/Two/index.tsx';
import PcRoomBattleOne from './pages/PcRoom/Battle/One/index.tsx';
import PcRoomThree from './pages/PcRoom/Three/index.tsx';
import PcRoomFour from './pages/PcRoom/Four/index.tsx';
import PcRoomBattleTwo from './pages/PcRoom/Battle/Two/index.tsx';
import PcRoomFive from './pages/PcRoom/Five/index.tsx';
import PcRoomSix from './pages/PcRoom/Six/index.tsx';
import PcRoomSeven from './pages/PcRoom/Seven/index.tsx';

import AfterPcRoom from './pages/Hall/Pcs/One/AfterPcRoom/One/index.tsx';
import AfterPcRoomTwo from './pages/Hall/Pcs/One/AfterPcRoom/Two/index.tsx';

import Library from './pages/Library/index.tsx';
import LibraryBattle from './pages/Library/Battle/index.tsx';
import HallThirdClass from './pages/Hall/ThirdClass/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <InventoryProvider>
        <PlayerProvider>
          <GameControlsProvider>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<Tutorial />} />
                <Route path="home" element={<Home />} />
                <Route path="firstscreen" element={<FirstScreen />} />
                
                <Route path="cantina/one" element={<Cantina />} />
                <Route path="director/one" element={<Director />} />
                <Route path="director/two" element={<DirectorTwo />} />
                <Route path="cantina/two" element={<CantinaTwo />} />
                <Route path="cantina/battle" element={<CantinaBattle />} />
                <Route path="cantina/three" element={<CantinaThree />} />
                <Route path="cantina/four" element={<CantinaFour />} />

                <Route path="hall/one" element={<HallOne />} />
                <Route path="hall/two" element={<HallTwo />} />

                <Route path="pcroom/one" element={<PcRoomOne />} />
                <Route path="pcroom/two" element={<PcRoomTwo />} />
                <Route path="pcroom/battle/one" element={<PcRoomBattleOne />} />

                <Route path="pcroom/three" element={<PcRoomThree />} />
                <Route path="pcroom/four" element={<PcRoomFour />} />
                <Route path="pcroom/battle/two" element={<PcRoomBattleTwo />} />

                <Route path="pcroom/five" element={<PcRoomFive />} />
                <Route path="pcroom/six" element={<PcRoomSix />} />
                <Route path="pcroom/seven" element={<PcRoomSeven />} />

                <Route path="hall/afterpcroom/one" element={<AfterPcRoom />} />
                <Route path="hall/afterpcroom/two" element={<AfterPcRoomTwo />} />

                <Route path="hall/left/one" element={<HallLeftOne />} />
                <Route path="hall/center/one" element={<HallCenterOne />} />
                <Route path="hall/center/front" element={<HallCenterFront />} />
                <Route path="hall/thirdclass" element={<HallThirdClass />} />

                <Route path="library" element={<Library />} />
                <Route path="library/battle" element={<LibraryBattle />} />
              </Route>
            </Routes>
          </GameControlsProvider>
        </PlayerProvider>
      </InventoryProvider>
    </BrowserRouter>
  </StrictMode>
)

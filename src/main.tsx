import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { GameControlsProvider } from "./contexts/GameControlsContext";
import Tutorial from './pages/Tutorial/index.tsx';
import Home from './pages/Home/index.tsx';
import FirstScreen from './pages/FirstScreen/index.tsx';
import './index.css'
import App from './App.tsx'
import { PlayerProvider } from './contexts/PlayerContext.tsx';
import { InventoryProvider } from './contexts/InventoryContext.tsx';

import Director from './pages/Director/One/index.tsx';
import DirectorTwo from './pages/Director/Two/index.tsx';

import HallOne from './pages/Hall/One/index.tsx';
import HallTwo from './pages/Hall/Two/index.tsx';

import CantinaBattle from './pages/Cantina/Battle/index.tsx';
import Cantina from './pages/Cantina/One/index.tsx';
import CantinaTwo from './pages/Cantina/Two/index.tsx';
import CantinaThree from './pages/Cantina/Three/index.tsx';
import CantinaFour from './pages/Cantina/Four/index.tsx';

import PcRoomOne from './pages/PcRoom/One/index.tsx';
import PcRoomTwo from './pages/PcRoom/Two/index.tsx';
import PcRoomBattleOne from './pages/PcRoom/Battle/One/index.tsx';
import PcRoomThree from './pages/PcRoom/Three/index.tsx';
import PcRoomFour from './pages/PcRoom/Four/index.tsx';
import PcRoomBattleTwo from './pages/PcRoom/Battle/Two/index.tsx';
import PcRoomFive from './pages/PcRoom/Five/index.tsx';
import PcRoomSix from './pages/PcRoom/Six/index.tsx';
import PcRoomSeven from './pages/PcRoom/Seven/index.tsx';

import AfterPcRoom from './pages/Hall/One/AfterPcRoom/One/index.tsx';
import AfterPcRoomTwo from './pages/Hall/One/AfterPcRoom/Two/index.tsx';

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
                <Route path="pcroom/one" element={<PcRoomOne />} />
                <Route path="pcroom/two" element={<PcRoomTwo />} />
                <Route path="pcroom/battle/one" element={<PcRoomBattleOne />} />
                <Route path="hall/two" element={<HallTwo />} />
                <Route path="pcroom/three" element={<PcRoomThree />} />
                <Route path="pcroom/four" element={<PcRoomFour />} />
                <Route path="pcroom/battle/two" element={<PcRoomBattleTwo />} />
                <Route path="pcroom/five" element={<PcRoomFive />} />
                <Route path="pcroom/six" element={<PcRoomSix />} />
                <Route path="pcroom/seven" element={<PcRoomSeven />} />
                <Route path="hall/afterpcroom/one" element={<AfterPcRoom />} />
                <Route path="hall/afterpcroom/two" element={<AfterPcRoomTwo />} />
              </Route>
            </Routes>
          </GameControlsProvider>
        </PlayerProvider>
      </InventoryProvider>
    </BrowserRouter>
  </StrictMode>
)

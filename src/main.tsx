import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { GameControlsProvider } from "./contexts/GameControlsContext";
import Tutorial from './pages/Tutorial/index.tsx';
import Home from './pages/Home/index.tsx';
import FirstScreen from './pages/FirstScreen/index.tsx';
import Cantina from './pages/Cantina/CantinaOne/index.tsx';
import './index.css'
import App from './App.tsx'
import { PlayerProvider } from './contexts/PlayerContext.tsx';
import CantinaBattle from './pages/Cantina/CantinaBattle/index.tsx';
import Director from './pages/Director/index.tsx';
import HallOne from './pages/Hall/First/index.tsx';
import HallTwo from './pages/Hall/Second/index.tsx';
import CantinaTwo from './pages/Cantina/CantinaTwo/index.tsx';
import CantinaThree from './pages/Cantina/CantinaThree/index.tsx';
import { InventoryProvider } from './contexts/InventoryContext.tsx';
import PcRoomOne from './pages/PcRoom/One/index.tsx';
import PcRoomTwo from './pages/PcRoom/Two/index.tsx';
import PcRoomBattleOne from './pages/PcRoom/BattleOne/index.tsx';
import PcRoomThree from './pages/PcRoom/Three/index.tsx';
import PcRoomFour from './pages/PcRoom/Four/index.tsx';
import PcRoomBatleTwo from './pages/PcRoom/BattleTwo/index.tsx';
import PcRoomFive from './pages/PcRoom/Five/index.tsx';
import PcRoomSix from './pages/PcRoom/Six/index.tsx';
import PcRoomSeven from './pages/PcRoom/Seven/index.tsx';

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
                <Route path="director" element={<Director />} />
                <Route path="cantina/two" element={<CantinaTwo />} />
                <Route path="cantina/battle" element={<CantinaBattle />} />
                <Route path="cantina/three" element={<CantinaThree />} />
                <Route path="hall/one" element={<HallOne />} />
                <Route path="pcroom/one" element={<PcRoomOne />} />
                <Route path="pcroom/two" element={<PcRoomTwo />} />
                <Route path="pcroom/BattleOne" element={<PcRoomBattleOne />} />
                <Route path="hall/two" element={<HallTwo />} />
                <Route path="pcroom/three" element={<PcRoomThree />} />
                <Route path="pcroom/four" element={<PcRoomFour />} />
                <Route path="pcroom/battletwo" element={<PcRoomBatleTwo />} />
                <Route path="pcroom/five" element={<PcRoomFive />} />
                <Route path="pcroom/six" element={<PcRoomSix />} />
                <Route path="pcroom/seven" element={<PcRoomSeven />} />
              </Route>
            </Routes>
          </GameControlsProvider>
        </PlayerProvider>
      </InventoryProvider>
    </BrowserRouter>
  </StrictMode>
)

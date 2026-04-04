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
import FirstBattle from './pages/FirstBattle/index.tsx';
import Director from './pages/Director/index.tsx';
import HallOne from './pages/Hall/First/index.tsx';
import HallTwo from './pages/Hall/Second/index.tsx';
import CantinaTwo from './pages/Cantina/CantinaTwo/index.tsx';
import CantinaThree from './pages/Cantina/CantinaThree/index.tsx';
import { InventoryProvider } from './contexts/InventoryContext.tsx';

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
                <Route path="firstbattle" element={<FirstBattle />} />
                <Route path="cantina/three" element={<CantinaThree />} />
                <Route path="hall/one" element={<HallOne />} />
                <Route path="hall/two" element={<HallTwo />} />
              </Route>
            </Routes>
          </GameControlsProvider>
        </PlayerProvider>
      </InventoryProvider>
    </BrowserRouter>
  </StrictMode>
)

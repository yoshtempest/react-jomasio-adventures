import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { GameControlsProvider } from "./contexts/GameControlsContext";
import Tutorial from './pages/Tutorial/index.tsx';
import Home from './pages/Home/index.tsx';
import FirstScreen from './pages/FirstScreen/index.tsx';
import Cantina from './pages/Cantina/index.tsx';
import './index.css'
import App from './App.tsx'
import { PlayerProvider } from './contexts/PlayerContext.tsx';
import FirstBattle from './pages/FirstBattle/index.tsx';
import Director from './pages/Director/index.tsx';
import HallOne from './pages/Hall/First/index.tsx';
import HallTwo from './pages/Hall/Second/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GameControlsProvider>
        <PlayerProvider>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Tutorial />} />
              <Route path="home" element={<Home />} />
              <Route path="firstscreen" element={<FirstScreen />} />
              <Route path="cantina" element={<Cantina />} />
              <Route path="firstbattle" element={<FirstBattle />} />
              <Route path="director" element={<Director />} />
              <Route path="hallone" element={<HallOne />} />
              <Route path="halltwo" element={<HallTwo />} />
            </Route>
          </Routes>
        </PlayerProvider>
      </GameControlsProvider>
    </BrowserRouter>
  </StrictMode>
)

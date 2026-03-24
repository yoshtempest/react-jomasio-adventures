import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { GameControlsProvider } from "./contexts/GameControlsContext";
import Tutorial from './pages/Tutorial/index.tsx';
import Home from './pages/Home/index.tsx';
import FirstScreen from './pages/FirstScreen/index.tsx';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GameControlsProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Tutorial />} />
            <Route path="home" element={<Home />} />
            <Route path="firstscreen" element={<FirstScreen />} />
          </Route>
        </Routes>
      </GameControlsProvider>
    </BrowserRouter>
  </StrictMode>
)

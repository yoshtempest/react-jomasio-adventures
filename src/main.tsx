import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import TutorialPage from './pages/Tutorial/index.tsx';
// import { GameButtons } from "./components/Controls/GameButtons";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <GameButtons> */}
          <Routes>
            <Route index element={<App />} />
            <Route index element={<TutorialPage />} />
          </Routes>
      {/* </GameButtons> */}
    </BrowserRouter>
  </StrictMode>,
)

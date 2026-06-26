import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import { lazyLoad } from "@/utils/lazyLoad";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Preloader } from "@/components/Preloader";

import App from "@/App";
import JailsonHallBattle from "@/pages/Hall/Battle/One";

const Loading = lazyLoad(() => import("@/pages/Loading"));
const Intro = lazyLoad(() => import("@/pages/Intro"));
const Tutorial = lazyLoad(() => import("@/pages/Tutorial"));
const Home = lazyLoad(() => import("@/pages/Home"));
const FirstScreen = lazyLoad(() => import("@/pages/FirstScreen"));
const CombatTutorial = lazyLoad(() => import("@/pages/CombatTutorial"));

const CantinaBattle = lazyLoad(() => import("@/pages/Cantina/Battle"));
const CantinaPage = lazyLoad(() => import("@/pages/Cantina"));

const DirectorPage = lazyLoad(() => import("@/pages/Director"));

const HallPage = lazyLoad(() => import("@/pages/Hall"));

const PcRoomBattleOne = lazyLoad(() => import("@/pages/PcRoom/Battle/One"));
const PcRoomBattleTwo = lazyLoad(() => import("@/pages/PcRoom/Battle/Two"));
const PcRoomBattleThree = lazyLoad(() => import("@/pages/PcRoom/Battle/Three"));
const PlanetarySistersBattle = lazyLoad(
  () => import("@/pages/Hall/Battle/Two"),
);
const MauraoBattle = lazyLoad(() => import("@/pages/Hall/Battle/Three"));
const PcRoomPage = lazyLoad(() => import("@/pages/PcRoom"));

const LibraryPage = lazyLoad(() => import("@/pages/Library"));
const FootballCourtPage = lazyLoad(() => import("@/pages/FootballCourt"));

const FootballCourtBattle = lazyLoad(
  () => import("@/pages/FootballCourt/Battle"),
);

const VandinhaFragmentBattle = lazyLoad(
  () => import("@/pages/Battle/Vandinha"),
);
const GoatBattle = lazyLoad(() => import("@/pages/Battle/Goat"));
const JhowSimarBattle = lazyLoad(() => import("@/pages/Battle/JhowSimar"));
const PiuBattle = lazyLoad(() => import("@/pages/Battle/Piu"));
const RiceBattle = lazyLoad(() => import("@/pages/Battle/Rice"));
const HungryDeathBattle = lazyLoad(() => import("@/pages/Battle/Hungry"));
const TechnobladeBattle = lazyLoad(() => import("@/pages/Battle/Technoblade"));

const CafeteriaBattle = lazyLoad(() => import("@/pages/Cafeteria/Battle"));
const CafeteriaPage = lazyLoad(() => import("@/pages/Cafeteria"));
const BrodiClassOne = lazyLoad(() => import("@/pages/BrodiClass"));
const BrodiclassBattle = lazyLoad(() => import("@/pages/BrodiClass/Battle"));
const HellroomPage = lazyLoad(() => import("@/pages/HellRoom"));
const HellroomBattle = lazyLoad(() => import("@/pages/HellRoom/Battle"));

const Landing = lazyLoad(() => import("@/pages/Landing"));
const Login = lazyLoad(() => import("@/pages/Login"));
const Register = lazyLoad(() => import("@/pages/Register"));

const nonBattlePages = [
  DirectorPage,
  HellroomPage,
  Loading,
  Intro,
  Tutorial,
  CombatTutorial,
  Home,
  FirstScreen,
  CantinaPage,
  HallPage,
  PcRoomPage,
  LibraryPage,
  CafeteriaPage,
  FootballCourtPage,
  BrodiClassOne,
];

export function AppRoutes() {
  return (
    <>
      <Preloader pages={nonBattlePages} />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Standalone routes — outside App layout */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<App />}>
            <Route index element={<Loading />} />
            <Route path="tutorial" element={<Tutorial />} />
            <Route path="combatTutorial" element={<CombatTutorial />} />
            <Route path="intro" element={<Intro />} />
            <Route path="home" element={<Home />} />
            <Route path="firstscreen" element={<FirstScreen />} />

            <Route path="hall">
              <Route index element={<Navigate to="/hall/one" />} />
              <Route path=":id" element={<HallPage />} />
              <Route path="jailson/battle" element={<JailsonHallBattle />} />
              <Route
                path="center/battle"
                element={<PlanetarySistersBattle />}
              />
              <Route path="pandemony/battle" element={<MauraoBattle />} />
            </Route>

            <Route path="director">
              <Route index element={<Navigate to="/director/one" />} />
              <Route path=":id" element={<DirectorPage />} />
            </Route>

            <Route path="library">
              <Route index element={<Navigate to="/library/one" />} />
              <Route path=":id" element={<LibraryPage />} />
            </Route>

            <Route path="cantina">
              <Route index element={<Navigate to="/cantina/one" />} />
              <Route path=":id" element={<CantinaPage />} />
              <Route path="battle" element={<CantinaBattle />} />
            </Route>

            <Route path="footballcourt">
              <Route index element={<Navigate to="/footballcourt/one" />} />
              <Route path=":id" element={<FootballCourtPage />} />
              <Route path="battle" element={<FootballCourtBattle />} />
            </Route>

            <Route path="hellroom">
              <Route index element={<Navigate to="/hellroom/one" />} />
              <Route path=":id" element={<HellroomPage />} />
              <Route path="battle" element={<HellroomBattle />} />
            </Route>

            <Route path="cafeteria">
              <Route index element={<Navigate to="/cafeteria/one" />} />
              <Route path=":id" element={<CafeteriaPage />} />
              <Route path="battle" element={<CafeteriaBattle />} />
            </Route>

            <Route path="pcroom">
              <Route index element={<Navigate to="/pcroom/one" />} />
              <Route path=":id" element={<PcRoomPage />} />
              <Route path="battle/one" element={<PcRoomBattleOne />} />
              <Route path="battle/two" element={<PcRoomBattleTwo />} />
              <Route path="battle/three" element={<PcRoomBattleThree />} />
            </Route>

            <Route path="battle/hungry" element={<HungryDeathBattle />} />
            <Route
              path="battle/vandinhafragment"
              element={<VandinhaFragmentBattle />}
            />
            <Route path="battle/jhowsimar" element={<JhowSimarBattle />} />
            <Route path="battle/piupiu" element={<PiuBattle />} />
            <Route path="battle/rice" element={<RiceBattle />} />
            <Route path="battle/goat" element={<GoatBattle />} />
            <Route path="brodiclass/one" element={<BrodiClassOne />} />
            <Route path="brodiclass/battle" element={<BrodiclassBattle />} />
            <Route path="battle/technoblade" element={<TechnobladeBattle />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

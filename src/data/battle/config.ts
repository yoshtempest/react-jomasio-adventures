import type { NavigateFunction } from "react-router";

export type BattleCtx = {
  setFlag: (flag: FlagId) => void;
  navigate: NavigateFunction;
};

export type BattleConfig = {
  npcType: string;
  redirectTo?: string;
  onVictory?: (ctx: BattleCtx) => void;
  victoryDescription: string;
  className: string;
  audioSrc: string;
};

export const BATTLE_CONFIGS: Record<string, BattleConfig> = {
  cafeteria: {
    npcType: "deise",
    redirectTo: "/cafeteria/one",
    onVictory: ({ setFlag }) => { setFlag("deise"); },
    victoryDescription: "Você derrotou Deise, a Lich imortal",
    className: "CafeteriaBattle",
    audioSrc: "/assets/songs/DarkSouls.m4a",
  },
  cantina: {
    npcType: "jhowsimar",
    redirectTo: "/cantina/one",
    onVictory: ({ setFlag }) => { setFlag("jhowsimar"); },
    victoryDescription: "Você derrotou 'Jhow Simar, o Vigia'",
    className: "CantinaBattle",
    audioSrc: "/assets/songs/StreetFighter5KenTheme.m4a",
  },
  hellroom: {
    npcType: "maugrelo",
    redirectTo: "/hellroom/three",
    onVictory: ({ setFlag }) => { setFlag("maugrelo"); },
    victoryDescription: "Você derrotou Maugrelo, mas ele parece ter gostado de apanhar?",
    className: "HellRoomBattle",
    audioSrc: "/assets/songs/GuiltyGear.mp3",
  },
  brodiclass: {
    npcType: "srGuaxinim",
    redirectTo: "/brodiclass/one",
    onVictory: ({ setFlag }) => { setFlag("srGuaxinim"); setFlag("srGuaxinimUnlocked"); },
    victoryDescription: "Você derrotou Sr.Guaxinim e se livrou momentaneamente da fúria de Baal.",
    className: "BrodiClassBattle",
    audioSrc: "/assets/songs/SpiderDance.m4a",
  },
  footballCourt: {
    npcType: "neimito",
    redirectTo: "/footballcourt/one",
    onVictory: ({ setFlag }) => { setFlag("neimito"); },
    victoryDescription: "Você derrotou 'Neimito, o mestre do calor'",
    className: "FootballCourtBattle",
    audioSrc: "/assets/songs/StreetFighter5KenTheme.m4a",
  },
  hallJailson: {
    npcType: "slimita",
    redirectTo: "/hall/jailson-two",
    onVictory: ({ setFlag }) => { setFlag("slimita"); },
    victoryDescription: "Você derrotou Slimita, a Paquera de Jailson",
    className: "jailsonHallBattle",
    audioSrc: "/assets/songs/SpiderDance.m4a",
  },
  hallCenter: {
    npcType: "planetarySisters",
    redirectTo: "/hall/center-two",
    onVictory: ({ setFlag }) => { setFlag("planetarySisters"); },
    victoryDescription: "Você derrotou as Irmãs Planetárias e agora pode passar",
    className: "hallCenterBattle",
    audioSrc: "/assets/songs/KickBack.mp3",
  },
  hallPandemony: {
    npcType: "maurao",
    redirectTo: "/hall/pandemony/two",
    onVictory: ({ setFlag }) => { setFlag("maurao"); },
    victoryDescription: "Você salvou Maurão da loucura",
    className: "hallCenterBattle",
    audioSrc: "/assets/songs/KickBack.mp3",
  },
  pcroomOne: {
    npcType: "hungryDeath",
    redirectTo: "/pcroom/two",
    onVictory: ({ setFlag }) => { setFlag("hungryDeath"); },
    victoryDescription: "Você derrotou um morto de fome!",
    className: "PcRoomBattle",
    audioSrc: "/assets/songs/StreetFighter5KenTheme.m4a",
  },
  pcroomTwo: {
    npcType: "vandinhaFragment",
    redirectTo: "/pcroom/four",
    onVictory: ({ setFlag }) => { setFlag("vandinhaFragment"); },
    victoryDescription: "Você derrotou um fragmento de Vandinha",
    className: "PcRoomBattle",
    audioSrc: "/assets/songs/StreetFighter5KenTheme.m4a",
  },
  pcroomThree: {
    npcType: "hungryKing",
    redirectTo: "/pcroom/seven",
    onVictory: ({ setFlag }) => { setFlag("hungryKing"); setFlag("samurionUnlocked"); },
    victoryDescription: "Você salvou Samurion de seu próprio culto de mortos de fome",
    className: "PcRoomBattle",
    audioSrc: "/assets/songs/StreetFighter5KenTheme.m4a",
  },
  goat: {
    npcType: "goat",
    onVictory: ({ navigate }) => { navigate(-1); },
    victoryDescription: "Você derrotou um bode!",
    className: "CantinaBattle",
    audioSrc: "/assets/songs/StreetFighter5KenTheme.m4a",
  },
  hungry: {
    npcType: "hungryDeath",
    onVictory: ({ navigate }) => { navigate(-1); },
    victoryDescription: "Você derrotou 'Jhow Simar, o Vigia'",
    className: "LibraryBattle",
    audioSrc: "/assets/songs/NoEnemies.mp3",
  },
  jhowsimar: {
    npcType: "jhowsimar",
    onVictory: ({ navigate }) => { navigate(-1); },
    victoryDescription: "Você derrotou 'Jhow Simar, o Vigia'",
    className: "CantinaBattle",
    audioSrc: "/assets/songs/StreetFighter5KenTheme.m4a",
  },
  piupiu: {
    npcType: "piupiu",
    onVictory: ({ navigate }) => { navigate(-1); },
    victoryDescription: "Você derrotou um Pinto!",
    className: "CafeteriaBattle",
    audioSrc: "/assets/songs/StreetFighter5KenTheme.m4a",
  },
  rice: {
    npcType: "rice",
    onVictory: ({ navigate }) => { navigate(-1); },
    victoryDescription: "Você derrotou um Bolinho de arroz!",
    className: "CafeteriaBattle",
    audioSrc: "/assets/songs/StreetFighter5KenTheme.m4a",
  },
  technoblade: {
    npcType: "technoblade",
    onVictory: ({ navigate }) => { navigate(-1); },
    victoryDescription: "Você derrotou o rei",
    className: "CantinaBattle",
    audioSrc: "/assets/songs/StreetFighter5KenTheme.m4a",
  },
  vandinha: {
    npcType: "vandinhaFragment",
    onVictory: ({ navigate }) => { navigate(-1); },
    className: "PcRoomBattle",
    victoryDescription: "Você derrotou um fragmento de Vandinha",
    audioSrc: "/assets/songs/Jojo.m4a",
  },
};

export const ROUTE_TO_BATTLE_KEY: Record<string, string> = {
  "/cafeteria/battle": "cafeteria",
  "/cantina/battle": "cantina",
  "/hellroom/battle": "hellroom",
  "/footballcourt/battle": "footballCourt",
  "/hall/jailson/battle": "hallJailson",
  "/hall/center/battle": "hallCenter",
  "/hall/pandemony/battle": "hallPandemony",
  "/brodiclass/battle": "brodiclass",
  "/pcroom/battle/one": "pcroomOne",
  "/pcroom/battle/two": "pcroomTwo",
  "/pcroom/battle/three": "pcroomThree",
  "/battle/goat": "goat",
  "/battle/hungry": "hungry",
  "/battle/jhowsimar": "jhowsimar",
  "/battle/piupiu": "piupiu",
  "/battle/rice": "rice",
  "/battle/technoblade": "technoblade",
  "/battle/vandinhafragment": "vandinha",
};

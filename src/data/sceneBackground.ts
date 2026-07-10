import { asset } from "@/utils/asset";

function cenariosPath(path: string) {
  return (asset(`/assets/cenarios/${path}`));
}

function jomasioPath(path: string) {
  return (cenariosPath(`/jomasio/${path}`));
}

export const sceneBackgrounds = {
  BrodiClass: jomasioPath("/brodiClass.svg"),
  BrodiClassBattle: jomasioPath("/battle/brodiClass.svg"),
  Cantina: jomasioPath("/cantina.svg"),
  CantinaBattle: jomasioPath("/battle/cantina.svg"),
  Cafeteria: jomasioPath("/cafeteria.svg"),
  CafeteriaBattle: jomasioPath("/battle/cafeteria.svg"),
  CombatTutorial: jomasioPath("/battle/tutorial.svg"),
  Director: jomasioPath("/director.svg"),
  FirstScreen: cenariosPath("/firstScreen.svg"),
  FootballCourt: jomasioPath("/footballCourt.svg"),
  FootballCourtBattle: jomasioPath("/battle/footballCourt.svg"),
  Home: asset("/assets/mainGame.svg"),
  HallOne: jomasioPath("/hall/one.svg"),
  HallJailson: jomasioPath("/hall/two.svg"),
  HallHell: jomasioPath("/hall/hell.svg"),
  HallPandemony: jomasioPath("/hall/pandemony.svg"),
  HallLeft: jomasioPath("/hall/left.svg"),
  HallCenter: jomasioPath("/hall/center.svg"),
  HallCenterFront: jomasioPath("/hall/centerFront.svg"),
  HallThirdClass: jomasioPath("/hall/thirdClass.svg"),
  JailsonHallBattle: jomasioPath("/battle/jailsonHall.svg"),
  HallCenterBattle: jomasioPath("/battle/hallCenter.svg"),
  HellRoom: jomasioPath("/hellRoom.svg"),
  HellRoomBattle: jomasioPath("/battle/hell.svg"),
  Library: jomasioPath("/library/default.svg"),
  LibraryBattle: jomasioPath("/battle/library.svg"),
  LibrarySecretPassage: jomasioPath("/library/secretPassage.svg"),
  LibraryPassageOpened: jomasioPath("/library/passageOpened.svg"),
  PcsRoom: jomasioPath("/pcsRoom.svg"),
  PcRoomBattle: jomasioPath("/battle/pcsRoom.svg"),
  Tutorial: cenariosPath("/tutorial.svg"),
};

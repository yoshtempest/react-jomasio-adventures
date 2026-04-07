import { pcsRoomMessages } from "@/data/maps/pcsRoom/messages";

type Dependencies = {
  hasItem: (id: string) => boolean;
  addItem: (item: { id: string; name: string }) => void;
  setPopup: (msg: string) => void;
  gotKey: boolean;
  setGotKey: (value: boolean) => void;
};

export function createPcsRoom({
  addItem,
  setPopup,
  gotKey,
  setGotKey,
}: Dependencies) {

  const interactions: Record<string, () => void> = Object.fromEntries(
    Object.entries(pcsRoomMessages).map(([key, message]) => [
      key,
      () => setPopup(message),
    ])
  );

  // 🔹 Interação especial (com lógica)
  interactions["7,3"] = () => {
    if (!gotKey) {
      setPopup("Que delícia! um suco de laranja");

      addItem({
        id: "key_02",
        name: "Suco de laranja",
      });

      setGotKey(true);
    } else {
      setPopup("Nenhuma outra delícia por aqui.");
    }
  };

  return interactions;
}
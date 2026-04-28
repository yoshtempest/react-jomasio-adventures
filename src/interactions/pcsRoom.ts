import { pcsRoomMessages } from "@/data/maps/pcsRoom/messages";

type Dependencies = {
  hasItem: (id: string) => boolean;
  addItem: (item: { id: string; name: string }) => void;
  setPopup: (msg: string) => void;
  gotKey?: boolean;
  setGotKey?: (value: boolean) => void;
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
      setPopup("Uma engrenagem, Era essa a peça que eu queria!");

      addItem({
        id: "desired_gear",
        name: "Peça desejada",
      });

      setGotKey?.(true);
    } else {
      setPopup("Nenhuma outra peça por aqui.");
    }
  };

  return interactions;
}
import { cantinaMessages } from "@/data/maps/cantina/messages";

type Dependencies = {
  hasItem: (id: string) => boolean;
  addItem: (item: { id: string; name: string }) => void;
  setPopup: (msg: string) => void;
  gotKey?: boolean;
  setGotKey?: (value: boolean) => void;
};

export function createCantina({
  addItem,
  setPopup,
  gotKey,
  setGotKey,
}: Dependencies) {

  const interactions: Record<string, () => void> = Object.fromEntries(
    Object.entries(cantinaMessages).map(([key, message]) => [
      key,
      () => setPopup(message),
    ])
  );

  // 🔹 Interação especial (com lógica)
  interactions["13,4"] = () => {
    if (!gotKey) {
      setPopup("Que delícia! um suco de laranja");

      addItem({
        id: "key_03",
        name: "Suco de laranja",
      });

      setGotKey?.(true);
    } else {
      setPopup("Nenhuma outra delícia por aqui.");
    }
  };

  return interactions;
}
import { libraryMessages } from "@/data/maps/library/messages";

type Dependencies = {
  hasItem: (id: string) => boolean;
  addItem: (item: { id: string; name: string }) => void;
  setPopup: (msg: string) => void;
  gotKey?: boolean;
  setGotKey?: (value: boolean) => void;
};

export function createLibrary({
  addItem,
  setPopup,
  gotKey,
  setGotKey,
}: Dependencies) {

  const interactions: Record<string, () => void> = Object.fromEntries(
    Object.entries(libraryMessages).map(([key, message]) => [
      key,
      () => setPopup(message),
    ])
  );

  // 🔹 Interação especial (com lógica)
  interactions["12,9"] = () => {
    if (!gotKey) {
      setPopup("Uma embalagem com surpresinha");

      addItem({
        id: "package_01",
        name: "Embalagem suspeita",
      });

      setGotKey?.(true);
    } else {
      setPopup("Nenhuma outra surpresinha por aqui.");
    }
  };

  return interactions;
}
import { useCallback } from "react";

type Props = {
  hasItem: (id: string) => boolean;
  addItem: (item: { id: string; name: string }) => void;
  removeItem: (id: string) => void;
  navigate: (path: string) => void;
  setPopup: (msg: string | null) => void;
  gotKey: boolean;
  setGotKey: (v: boolean) => void;
};

export function useDirectorInteractions({
  hasItem,
  addItem,
  removeItem,
  navigate,
  setPopup,
  gotKey,
  setGotKey,
}: Props) {
  
  const handleInteraction = useCallback((x: number, y: number) => {
    const key = `${x},${y}`;

    const interactions: Record<string, () => void> = {
      "4,3": () => {
        if (hasItem("key_01")) {
          setPopup("Você usou a chave.");

          setTimeout(() => {
            removeItem("key_01");
            navigate("/cantina");
          }, 1000);
        } else {
          setPopup("Essa porta está trancada.");
        }
      },

      "6,4": () => {
        setPopup("Nada por aqui.");
      },

      "7,4": () => {
        if (!gotKey) {
          setPopup("Uma chave suspeita, deve ser da porta...");

          addItem({
            id: "key_01",
            name: "Chave enferrujada",
          });

          setGotKey(true);
        } else {
          setPopup("Nada mais aqui.");
        }
      },
    };

    const action = interactions[key];
    if (action) action();

    return !!action; // 👈 útil pra saber se tratou ou não
  }, [hasItem, addItem, removeItem, navigate, setPopup, gotKey]);

  return { handleInteraction };
}
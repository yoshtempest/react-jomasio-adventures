type Dependencies = {
  hasItem: (id: string) => boolean;
  addItem: (item: { id: string; name: string }) => void;
  removeItem: (id: string) => void;
  navigate: (path: string) => void;
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
  return {

    "5,3": () => setPopup("Nada por aqui."),
    "4,3": () => setPopup("Nada por aqui."),
    "3,3": () => setPopup("Nada por aqui."),
    "6,3": () => setPopup("Nada por aqui."),
    "9,3": () => setPopup("Nada por aqui."),
    "10,3": () => setPopup("Nada por aqui."),
    "11,3": () => setPopup("Nada por aqui."),
    "12,3": () => setPopup("Nada por aqui."),
    "13,3": () => setPopup("Nada por aqui."),
    "14,3": () => setPopup("Nada por aqui."),

    "5,5": () => setPopup("Nada por aqui."),
    "4,5": () => setPopup("Nada por aqui."),
    "3,5": () => setPopup("Nada por aqui."),
    "6,5": () => setPopup("Nada por aqui."),
    "7,5": () => setPopup("Nada por aqui."),
    "8,5": () => setPopup("Nada por aqui."),
    "9,5": () => setPopup("Nada por aqui."),
    "10,5": () => setPopup("Nada por aqui."),
    "11,5": () => setPopup("Nada por aqui."),
    "12,5": () => setPopup("Nada por aqui."),
    "13,5": () => setPopup("Nada por aqui."),
    "14,5": () => setPopup("Nada por aqui."),

    "7,3": () => {
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
    },
  } as Record<string, () => void>;
}
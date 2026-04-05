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

    "6,4": () => setPopup("Nada por aqui."),

    "7,4": () => {
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
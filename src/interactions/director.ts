type Dependencies = {
  hasItem: (id: string) => boolean;
  addItem: (item: { id: string; name: string }) => void;
  removeItem: (id: string) => void;
  navigate: (path: string) => void;
  setPopup: (msg: string) => void;
  gotKey: boolean;
  setGotKey: (value: boolean) => void;
};

export function createDirector({
  hasItem,
  addItem,
  removeItem,
  navigate,
  setPopup,
  gotKey,
  setGotKey,
}: Dependencies) {
  return {
    "4,3": () => {
      if (hasItem("key_01")) {
        setPopup("Você usou a chave.");

        setTimeout(() => {
          removeItem("key_01");
          navigate("/cantinaTwo");
        }, 1000);
      } else {
        setPopup("Essa porta está trancada.");
      }
    },

    "6,4": () => setPopup("Nada por aqui."),

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
  } as Record<string, () => void>;
}
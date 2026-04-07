import { directorMessages } from "@/data/maps/director/messages";

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
    const interactions: Record<string, () => void> = Object.fromEntries(
      Object.entries(directorMessages).map(([key, message]) => [
        key,
        () => setPopup(message),
      ])
    );
    interactions["4,3"] = () => {
      if (hasItem("key_01")) {
        setPopup("Você usou a chave.");

        setTimeout(() => {
          removeItem("key_01");
          navigate("/cantina/two");
        }, 1000);
      } else {
        setPopup("Essa porta está trancada.");
      }
    };

    interactions["15,7"] = () => {
      if (!gotKey) {
        setPopup("Uma chave suspeita, deve ser da porta...");

        addItem({
          id: "key_01",
          name: "Chave enferrujada",
        });

        setGotKey(true);
      }
      else
      {
        setPopup("Nada mais aqui.");
      }
    };
    return interactions;
}
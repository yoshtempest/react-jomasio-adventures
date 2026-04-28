import { hallOneMessages } from "@/data/maps/hall/one/afterPcRoom/messages";

type Dependencies = {
  hasItem: (id: string) => boolean;
  addItem: (item: { id: string; name: string }) => void;
  removeItem: (id: string) => void;
  setPopup: (msg: string) => void;
};

export function createHallOne({
  hasItem,
  addItem,
  removeItem,
  setPopup,
}: Dependencies) {
    const interactions: Record<string, () => void> = Object.fromEntries(
      Object.entries(hallOneMessages).map(([key, message]) => [
        key,
        () => setPopup(message),
      ])
    );
    interactions["2,9"] = () => {
      if (hasItem("package_01")) {
        setPopup("Tome aqui sua embalagem");

        setTimeout(() => {
          removeItem("package_01");
          setPopup("Obrigada, eu estou precisando muito disso!");
          addItem({
            id: "good_powder",
            name: "Pó do bom",
          });
        }, 5000);
        setTimeout(() => {
          setPopup("Fique com isso, esse pó vai lhe ajudar a lutar infinitamente com aqueles rapazes, não faça perguntas, apenas aceite!");
        }, 1000);
      } else {
        setPopup("Vai lá pegar o negócio pra mim, meu filho.");
      }
    };
    return interactions;
}
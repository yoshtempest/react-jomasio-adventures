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
          navigate("/cantina/two");
        }, 1000);
      } else {
        setPopup("Essa porta está trancada.");
      }
    },

    "6,4": () => setPopup("imagens em preto e branco... deve ter falto tinta..."),
    "5,4": () => setPopup("Diário de Reincardion cap 2... Encontrei a chave, mas fui pego por Jhow Simar e jogado aqui novamente..."),
    "14,5": () => setPopup("Uma imagem de Vandinha montada em um dinossauro... Como tiraram essa foto?"),
    "15,6": () => setPopup("Uma carta de 20 anos atrás... Pedido de afastamento por Slimita..."),
    "15,7": () => setPopup("Chaves? Chaves! Aquele do barril, e pensar que teria uma foto aqui"),
    "8,6": () => setPopup("Pontos fracos de alguém chamado Manin... Por que está em branco?"),
    "9,6": () => setPopup("Lembranças de um passado distante... as pessoas pareciam não passar fome..."),
    "10,6": () => setPopup("Diário de Reincardion cap 1... Fui preso nessa cela e estou aqui a dias, sinto fome..."),

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
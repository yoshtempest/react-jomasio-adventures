type Dependencies = {
  hasItem: (id: string) => boolean;
  addItem: (item: { id: string; name: string }) => void;
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

    "5,3": () => setPopup("O que será que tem nesse pc?"),
    "4,3": () => setPopup("Jogos gratuítos para jogar de graça sem pagar nada..."),
    "3,3": () => setPopup("Macaco girando, eu gosto disso."),
    "6,3": () => setPopup("11? O que isso significa?"),
    "9,3": () => setPopup("Leia ao contrário o que está no pc à direita."),
    "10,3": () => setPopup("ah ah uel meuq ed uc o imoC."),
    "11,3": () => setPopup("Leia ao contrário o que está no pc à esquerda."),
    "12,3": () => setPopup("Ending Maker vai voltar, eu confio."),
    "13,3": () => setPopup("Damn Reincarnation cap novo? MENTIRA!"),
    "14,3": () => setPopup("The books on the table"),

    "5,5": () => setPopup("ChatGPT"),
    "4,5": () => setPopup("Tutorial de como respirar..."),
    "3,5": () => setPopup("Top 10 melhores músicas de Luiz Gonzaga..."),
    "6,5": () => setPopup("Fotos de gatos, que fofura!"),
    "7,5": () => setPopup("Barbie?"),
    "8,5": () => setPopup("Hakari dance..."),
    "9,5": () => setPopup("Musquito orquestra."),
    "10,5": () => setPopup("coisas pertubadoras a direita, tome cuidado."),
    "11,5": () => setPopup("Elisa Lanches? O que os alunos fazem aqui?"),
    "12,5": () => setPopup("Kid Bengala..."),
    "13,5": () => setPopup("Jailson Mendes, ele aguentou muita coisa por trás..."),
    "14,5": () => setPopup("Minha nossa, Mia Kalifa?"),

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
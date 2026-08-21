import { playerPath } from "@/utils/paths";

export const brodiClassDialogue = [
    {
        isPlayer: true,
        name: "Protagonista",
        message: "Eae gente, posso me juntar ao grupo de vocês?",
        expression: "happy"
    },
    {
        src: playerPath("/larissa/talking.svg"),
        name: "Laricell",
        message: "É, ele foi sequestrado por neimito",
    },
    {
        src: playerPath("/eduarda/talking.svg"),
        name: "Drika",
        message: "..",
    },
    {
        src: playerPath("/marcelo/crossArms.svg"),
        name: "Marshadow",
        message: "Ele já tá grande, deve saber se virar",
    },
    {
        isPlayer: true,
        name: "Protagonista",
        message: "Gente, e eu aqui? Vão me ignorar mesmo?",
        expression: "talking"
    },
    {
        src: playerPath("/larissa/talking.svg"),
        name: "Laricell",
        message: "Neimito consegue aplicar genjutsus, então Ematron deve estar sendo manipulado por ele..",
    },
    {
        src: playerPath("/marcelo/crossArms.svg"),
        name: "Marshadow",
        message: "Se Ematron realmente estiver sendo manipulado, então Neimito é mais forte do que pensamos, não podemos subestimá-lo",
    },
    {
        src: playerPath("/eduarda/talking.svg"),
        name: "Drika",
        message: "Gente, Cadê o resto do pessoal?",
    },
    {
        src: playerPath("/larissa/talking.svg"),
        name: "Laricell",
        message: "Eles estão comprando tempo para nós nesse momento, logo Vandinha pode descobrir que estamos nos reunindo aqui",
    },
    {
        isPlayer: true,
        name: "Protagonista",
        message: "Eu derrotei ela, hehe",
        expression: "happy"
    },
    {
        src: playerPath("/marcelo/angryFront.svg"),
        name: "Marshadow",
        message: "Fraco assim? Deve ter derrotado um fragmento, some daqui que a conversa é de alto nível.",
    },
    {
        isPlayer: true,
        name: "Protagonista",
        message: "Então tá..",
        expression: "crossArms"
    },
    {
        src: playerPath("/eduarda/dontBad.svg"),
        name: "Drika",
        message: "Fica triste não",
    },
    {
        isPlayer: true,
        name: "Protagonista",
        message: "Posso me juntar ao conselho então?",
        expression: "crossArms"
    },
    {
        src: playerPath("/larissa/interrogation.svg"),
        name: "Laricell",
        message: "Quem é você mesmo?",
    },
    {
        isPlayer: true,
        name: "Protagonista",
        message: "Protagonista!",
        expression: "happy"
    },
    {
        src: playerPath("/marcelo/talking.svg"),
        name: "Marshadow",
        message: "Estavamos precisando de alguém assim, salva o Ematron lá que eu vou desenvolver o jogo enquanto isso",
    },
    {
        src: playerPath("/larissa/talking.svg"),
        name: "Laricell",
        message: "Se salvar ele, eu deixo você se juntar ao conselho",
    },
    {
        isPlayer: true,
        name: "Protagonista",
        message: "E o que eu ganho ao salvar ele? Sabem que eu não vou trabalhar de graça né?",
        expression: "crossArms"
    },
    {
        src: playerPath("/larissa/crossArms.svg"),
        name: "Laricell",
        message: "Ganha experiência na vida, então vai lá farmar seu xp vai",
    },
    {
        isPlayer: true,
        name: "Protagonista",
        message: "Eu sou o protagonista então por que me tratam tão mal?",
        expression: "hungry"
    },
    {
        src: playerPath("/marcelo/talking.svg"),
        name: "Marshadow",
        message: "Como dizia meu avô, tem que apanhar para aprender, sem surra, sem aprendizado.",
    },
    {
        isPlayer: true,
        name: "Protagonista",
        message: "Tá bom, tô indo",
        expression: "crossArms"
    },
] satisfies Dialogue[];

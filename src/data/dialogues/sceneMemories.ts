import { defineDialogue } from "./defineDialogue";

/**
 * Destino para o personagem andar sozinho logo após a memória da cena
 * terminar (chave = rota).
 */
export type SceneMemoryWalkTarget = {
  x: number;
  y: number;
  direction: Direction;
};

export const SCENE_MEMORY_WALKS: Record<string, SceneMemoryWalkTarget> = {
  // Entrada do Jomasio: o personagem caminha até ficar de frente pro portão.
  "/jomasioentrance/one": { x: 7, y: 8, direction: "up" },
};

/**
 * Falas de memória do personagem selecionado ao entrar pela primeira vez
 * em uma cena, como se estivesse se lembrando de quando estudava no Jorjão.
 *
 * Chave = rota da cena (`location.pathname`). Cenas que já usam
 * `autoStartDialogue` não tocam memórias (a intro da cena tem prioridade),
 * e cenas sem entrada simplesmente não têm fala.
 */
export const SCENE_MEMORIES: Record<string, Dialogue[]> = {
  "/jomasioentrance/one": defineDialogue([
    [
      "protagonista",
      "Já deu a hora de voltar naquele maldito lugar pra purificar a fome.",
    ],
    [
      "protagonista",
      "O Seth Jorjão... quem diria que eu ia pisar nesse presídio-escola de novo.",
    ],
    [
      "protagonista",
      "Mas se é aqui que essa fome se cura, então sem pestanejar: bora.",
    ],
  ]),

  "/hall/one": defineDialogue([
    [
      "protagonista",
      "O corredor do Jorjão... foi aqui que eu fui caçado pela Deise por três anos seguidos.",
    ],
  ]),

  "/hall/left-one": defineDialogue([
    [
      "protagonista",
      "Essa parte de trás do hall... tinha um cheiro de armário velho que eu nunca esquentei.",
    ],
  ]),

  "/hall/center-one": defineDialogue([
    [
      "protagonista",
      "O meio do hall... era o ponto de encontro antes de todo mundo se mandar pra sala.",
    ],
  ]),

  "/hall/center-front": defineDialogue([
    [
      "protagonista",
      "A entrada principal... lembro do diretor espiando daqui, doido pra dar um tempo.",
    ],
  ]),

  "/hall/thirdclass": defineDialogue([
    [
      "protagonista",
      "A sala do terceiro ano... aqui eu fingia que estudava e só conseguia dormir.",
    ],
  ]),

  "/brodiclass/one": defineDialogue([
    [
      "protagonista",
      "A sala do Brodi... o cheiro de giz e as risadas do fundão nunca saíram da minha cabeça.",
    ],
  ]),

  "/library/one": defineDialogue([
    [
      "protagonista",
      "A biblioteca... a gente falava que ia ler, mas era só pra dormir no silêncio.",
    ],
  ]),

  "/library/two": defineDialogue([
    [
      "protagonista",
      "Essa parte escondida da biblioteca... se eu não me engano, tem coisa errada aqui.",
    ],
  ]),

  "/pcroom/one": defineDialogue([
    [
      "protagonista",
      "A sala dos computadores... estudar era a última opção quando o pessoal disputava a Net.",
    ],
  ]),

  "/director/one": defineDialogue([
    [
      "protagonista",
      "A sala do diretor... só de sentir o ar daqui, meu corpo já lembra do medo.",
    ],
  ]),

  "/footballcourt/one": defineDialogue([
    [
      "protagonista",
      "O campinho... aqui valia muito mais do que qualquer aula.",
    ],
  ]),

  "/cantina/two": defineDialogue([
    [
      "protagonista",
      "A cantina... nunca entendi por que essa fome começou logo nesse lugar.",
    ],
  ]),

  "/cafeteria/four": defineDialogue([
    [
      "protagonista",
      "A cafeteria... o cheiro de mortadela continua me assombrando até hoje.",
    ],
  ]),
};
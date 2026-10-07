import { pcsRoomMessages } from "@/data/dialogues/pcsRoom/messages";
import {
  createInteractionMap,
  createPickupHandler,
  createMessageCardHandler,
  createImageHandler,
} from "./builder";
import type {
  PickupDeps,
  MessageDeps,
  ImageDeps,
} from "@/utils/types/interaction";
import { historyPath } from "@/utils/paths/historyPath";
import { MUSICS } from "@/scenes/shared/music";

export function createPcsRoom(deps: PickupDeps & MessageDeps & ImageDeps) {
  return createInteractionMap(pcsRoomMessages, deps, {
    "4,2": createImageHandler({
      src: historyPath("monkeyCircle.gif"),
      message: "Macaco girando, eu gosto disso.",
    }),

    "16,2": createMessageCardHandler({
      title: "Diário de Reincardion",
      subtitle: "Cap 3",
      description:
        "Aprendi a usar a internet, mas aqui não tem internet, triste, não? Peguei esse hábito de escrever durante o tempo em que estive preso naquela cela, queria que alguem pudesse ler essas cartas, mas ninguem aqui sabe ler, deplorável, realmente deplorável HAHAHAHA.",
    }),
    "13,2": createImageHandler({
      src: historyPath("healthlyTips.svg"),
      message: "Dicas para manter-se saudável...",
    }),
    "13,4": createImageHandler({
      src: historyPath("mosquitoOrchestra.svg"),
      message: "Mosquito orquestra ao vivo",
      music: MUSICS.finoSenores,
    }),
    "12,4": createMessageCardHandler({
      title: "Diário de Reincardion",
      subtitle: "Cap 4",
      description:
        "Chat GPT minha espada tá girando igual um helicoptero, o que devo fazer? Procure atendimento médico urgentemente",
    }),

    "15,2": createImageHandler({
      src: historyPath("damnReincarnation.svg"),
      message: "Damn Reincarnation cap novo? MENTIRA!",
    }),

    "10.6, 6.5": createPickupHandler({
      item: { id: "desired_gear" },
      flagId: "picked_desired_gear",
      pickupMessage: "Uma engrenagem, Era essa a peça que eu queria!",
      alreadyPickedMessage: "Nenhuma outra peça por aqui.",
    }),
  });
}

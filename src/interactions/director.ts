import { historyPath, transitionPath } from "@/utils/paths";

import { directorMessages } from "@/data/dialogues/director/messages";
import {
  createInteractionMap,
  createPickupHandler,
  createImageHandler,
  createMessageCardHandler,
} from "./builder";
import type {
  PickupDeps,
  InventoryDeps,
  QuestDeps,
  ImageDeps,
  MessageDeps,
} from "@/utils/types/interaction";
import { POPUP_MESSAGES } from "@/data/messages";

type DirectorDeps = PickupDeps &
  InventoryDeps &
  QuestDeps &
  ImageDeps &
  MessageDeps & {
    hasFlag: (id: FlagId) => boolean;
    playSFX?: (src: string, volume?: number) => void;
  };

export function createDirector(deps: DirectorDeps) {
  const { progressQuest, hasFlag } = deps;

  return createInteractionMap(directorMessages, deps, {
    "11,3": createImageHandler({
      src: historyPath("vandinhaInTiranosaur.svg"),
      message:
        "Uma imagem de Vandinha montada em um Tiranossauro... Como conseguiram tirar essa foto?",
    }),

    "8,3": createImageHandler({
      src: historyPath("chaves.svg"),
      message:
        "Chaves? Chaves! Aquele do barril, e pensar que teria uma foto aqui",
    }),

    "7,3": createMessageCardHandler({
      title: "Carta",
      subtitle: "Reincardion",
      description:
        "Uma carta amassada: 'Reincardion, o que aconteceu com a ovelha afogada? Ela morreu mesmo? Fácil assim?'",
    }),
    "12,5": createMessageCardHandler({
      title: "Carta",
      subtitle: "Desconhecido",
      description: "Uma carta escrito: 'tu matou a ovelha afogada, rapaz? Agora tu vai levar uma pisa das boas seu muleque'",
    }),
    "6,3": createMessageCardHandler({
      title: "Diário de Reincardion",
      subtitle: "Cap 2",
      description:
        "Encontrei a chave, mas fui pego por Jhow Simar e jogado aqui novamente... Eles disseram que a punição havia acabado, fui idiota em acreditar nessas palavras, mais um dia aqui, sinto que estou ficando louco HAHAHAH",
    }),
    "17,5": createMessageCardHandler({
      title: "Carta de 20 anos atrás",
      subtitle: "Pedido de afastamento por Slimita",
      description: "Me laarga, eu não aguento mais trabalhar aqui, eu não sou vagabunda, eu trabalho mas eu trabalho na minha hora, isso aqui tá parecendo uma escravidão... Eu só queria férias e um aumento, mas não, eu tenho que trabalhar até morrer, eu não aguento mais, alguem me tira daqui, eu não aguento, eu não aguento, eu aguentooo...",
    }),
    "9,5": createMessageCardHandler({
      title: "Pontos fracos de Manim:",
      subtitle: "Lista de todos os pontos fracos encontrados",
      // A graça é a lista existir e não ter nada escrito ao lado.
      numberedCount: 11,
    }),
    "10,5": createMessageCardHandler({
      title: "Lembranças",
      description:
        "Lembranças de um passado distante... as pessoas pareciam não passar fome...",
    }),
    "11,5": createMessageCardHandler({
      title: "Diário de Reincardion",
      subtitle: "Cap 1",
      description:
        "Fui preso nessa cela e estou aqui a dias, sinto fome... Ás vezes eu tento fugir mas nem mesmo Jhow Simar sabe onde está a chave para me tirar daqui, ao mesmo tempo que hilário, isso é triste...",
    }),

        "4,2": ({ hasItem, setPopup, navigate, playSFX }) => {
      if (hasItem("director_key")) {
        setPopup(POPUP_MESSAGES.KEY_USED);
        progressQuest("director_escape", 1);
        playSFX?.(transitionPath("doorOpen.mp3"), 0.6);
        setTimeout(() => {
          playSFX?.(transitionPath("undertaleToBattle.mp3"), 0.6);
          if (hasFlag("jhowsimar")) {
            navigate?.("/cantina/two");
          } else {
            navigate?.("/cantina/one");
          }
        }, 1000);
      }
      else {
        setPopup(POPUP_MESSAGES.DOOR_LOCKED);
      }
    },

    "18.4, 5": createPickupHandler({
      item: { id: "director_key" },
      flagId: "picked_director_key",
      pickupMessage: "Uma chave suspeita, deve ser da porta...",
    }),
  });
}

import { SPEAKERS, type SpeakerId } from "@/data/speakers";
import { npcPath, playerPath } from "@/utils/paths";

type DialogueTuple =
  | [who: SpeakerId, message: string]
  | [who: SpeakerId, message: string, expression: DialogueExpression];

type SpeakerLine = {
  who: SpeakerId;
  message: string;
  expression?: DialogueExpression;
  pose?: string;
  name?: string;
  soundSrc?: string;
  autoAdvanceOnSound?: boolean;
};

export type DialogueLine = DialogueTuple | SpeakerLine | Dialogue;

type SpeakerEntry = (typeof SPEAKERS)[SpeakerId];

type SpeakerOverrides = {
  message: string;
  expression?: DialogueExpression;
  soundSrc?: string;
  autoAdvanceOnSound?: boolean;
  pose?: string;
  name?: string;
};

function resolvePortrait(
  kind: unknown,
  base: string,
  pose: string | undefined,
): string {
  const path = `${base}/${pose ?? "right"}.svg`;
  return kind === "player" ? playerPath(path) : npcPath(path);
}

function fromSpeaker(entry: SpeakerEntry, o: SpeakerOverrides): Dialogue {
  const extras = {
    ...(o.expression && { expression: o.expression }),
    ...(o.soundSrc && { soundSrc: o.soundSrc }),
    ...(o.autoAdvanceOnSound && { autoAdvanceOnSound: true as const }),
  };
  const { message } = o;

  if ("isPlayer" in entry) {
    return { isPlayer: true, name: entry.name, message, ...extras };
  }

  if (!("base" in entry)) {
    return { name: o.name ?? entry.name, message, ...extras };
  }

  return {
    src: resolvePortrait(
      "kind" in entry ? entry.kind : undefined,
      entry.base,
      o.pose ?? entry.pose,
    ),
    name: o.name ?? entry.name,
    message,
    ...extras,
  };
}

export function defineDialogue(lines: readonly DialogueLine[]): Dialogue[] {
  return lines.map((input): Dialogue => {
    if (Array.isArray(input)) {
      const [who, message, expression] = input;
      return fromSpeaker(SPEAKERS[who], { message, expression });
    }

    if ("who" in input) {
      const { who, ...overrides } = input;
      return fromSpeaker(SPEAKERS[who], overrides);
    }

    return input;
  });
}

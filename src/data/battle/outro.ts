type OutroLines = {
  victory: string;
  defeat: string;
};

export const OUTRO_LINES: Record<string, OutroLines> = {
  marcelo: {
    victory: "Isso! Mais um derrotado!",
    defeat: "Não... dessa vez não deu...",
  },
  eduarda: {
    victory: "Hmph! Facilzinho!",
    defeat: "Ah... que droga...",
  },
};

export function getOutroLine(character: string, type: "victory" | "defeat"): string {
  return OUTRO_LINES[character]?.[type] ?? (type === "victory" ? "Vitória!" : "Derrota...");
}

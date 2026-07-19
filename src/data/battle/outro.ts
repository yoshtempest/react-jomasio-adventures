type OutroLines = {
  victory: string;
  defeat: string;
};

export const OUTRO_LINES: Record<string, OutroLines> = {
  marcelo: {
    victory: "E vai tomando!",
    defeat: "Agora deu o carai mermo!",
  },
  lucaua: {
    victory: "Ai sim Lupita!",
    defeat: "Vai matar a cachorra mesmo?",
  },
  emanuel: {
    victory: "Siuuu!",
    defeat: "Perdi mas ainda sou melhor.",
  },
  lucas: {
    victory: "Viva a Mazim!!!",
    defeat: "Me ajude Mazim!",
  },
  larissa: {
    victory: "Booya!",
    defeat: "Game Over.",
  },
  samuel: {
    victory: "Ha! Ha! Eu tinha um dente.",
    defeat: "Nem doeu!",
  },
  artur: {
    victory: "Stand, farmar aura!",
    defeat: "Killer Queen, bites the dust!",
  },
  riquelme: {
    victory: "Finalmente a ovelha fez o mínimo.",
    defeat: "Que ovelha lixo!",
  },
  eduarda: {
    victory: "Ebaa!",
    defeat: "Que ódio!",
  },
};

export function getOutroLine(
  character: string,
  type: "victory" | "defeat",
): string {
  return (
    OUTRO_LINES[character]?.[type] ??
    (type === "victory" ? "Vitória!" : "Derrota...")
  );
}

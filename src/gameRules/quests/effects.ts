export const questEffects: Record<string, () => void> = {
  buscar_embalagem: () => {
    if (import.meta.env.DEV) console.log("Recompensa dada!");
  }
};
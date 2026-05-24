export const ITEMS = {
  aura_letter: { id: "aura_letter", name: "Carta de muita aura" },
  package_01: { id: "package_01", name: "Embalagem com surpresinha" },
  good_powder: { id: "good_powder", name: "Pó do bom" },
  desired_gear: { id: "desired_gear", name: "Peça desejada" },
  orange_juice: { id: "orange_juice", name: "Suco de laranja" },
  sausage: { id: "sausage", name: "Linguição Grosso" },
  jorjao_map: { id: "jorjao_map", name: "Mapa Escolar" }
  
} as const;

export type ItemId =
  | "aura_letter"
  | "package_01"
  | "good_powder"
  | "desired_gear"
  | "orange_juice"
  | "sausage"
  | "jorjao_map";
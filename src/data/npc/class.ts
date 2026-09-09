export const CLASS_DATA = {
  common: {
    label: "Comum",
    color: "#9d9d9d",
  },
  rare: {
    label: "Raro",
    color: "#50c878",
  },
  epic: {
    label: "Épico",
    color: "#b44aff",
  },
  boss: {
    label: "Chefão",
    color: "#e0115f",
  },
  legendary: {
    label: "Lendário",
    color: "#ff4500",
  },
  supreme: {
    label: "Supremo",
    color: "#ffd700",
  },
  omega: {
    label: "Ômega",
    color: "#b22222",
  },
} as const;

export type NPCClass = keyof typeof CLASS_DATA;

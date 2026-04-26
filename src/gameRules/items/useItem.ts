import { useNavigate } from "react-router";

function rollEncounter() {
  const roll = Math.random() * 100;

  if (roll < 1) return "/vandinha/battle";
  if (roll < 34) return "/hungry/battle";
  if (roll < 67) return "/jhowsimar/battle";
  return "/goat/battle";
}

export function useItemEffect() {
  const navigate = useNavigate();

  function getEffect(itemId: string) {
    switch (itemId) {
      case "key_05": // 🔥 Pó do bom
        return () => {
          const route = rollEncounter();
          navigate(route);
        };

      default:
        return null;
    }
  }

  return { getEffect };
}
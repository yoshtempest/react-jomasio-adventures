import { useNavigate } from "react-router";

function rollEncounter() {
  const roll = Math.random() * 100;

  if (roll < 1) return "/battle/vandinhafragment";
  if (roll < 90) return "/battle/hungry";
  if (roll < 95) return "/battle/jhowsimar";
  return "/battle/goat";
}

export function useItemEffect() {
  const navigate = useNavigate();

  function getEffect(itemId: string) {
    switch (itemId) {
      case "good_powder": // 🔥 Pó do bom
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
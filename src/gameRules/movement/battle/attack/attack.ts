import { canAct } from "../can/act";

export function attackBattle(p: Player): Player {
  if (!canAct(p)) return p;

  return {
    ...p,
    state: p.state === "jump" ? "jump" : "attack",
  };
}
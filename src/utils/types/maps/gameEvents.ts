type GameEvent =
  | { type: "ITEM_COLLECTED"; itemId: string }
  | { type: "NPC_TALKED"; npcId: string }
  | { type: "AREA_ENTERED"; areaId: string };

type Listener = (event: GameEvent) => void;

const listeners: Listener[] = [];

export function emitEvent(event: GameEvent) {
  listeners.forEach(l => l(event));
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
}
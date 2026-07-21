export type AudioLogEvent = {
  t: number;
  sound: string;
  op: "play" | "stop";
  loop: boolean;
};

let events: AudioLogEvent[] = [];
let startTime = 0;

export function initAudioLog(start: number) {
  events = [];
  startTime = start;
}

export function logPlay(sound: string, loop = false) {
  events.push({ t: Date.now() - startTime, sound, op: "play", loop });
}

export function logStop(sound: string) {
  events.push({ t: Date.now() - startTime, sound, op: "stop", loop: false });
}

export function getAudioEvents(): AudioLogEvent[] {
  return [...events];
}

export function clearAudioLog() {
  events = [];
}

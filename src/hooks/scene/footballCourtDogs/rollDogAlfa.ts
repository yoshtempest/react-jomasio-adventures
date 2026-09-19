const DOG_ALFA_CHANCE = 0.1;

export function rollDogAlfa(): boolean {
  return Math.random() < DOG_ALFA_CHANCE;
}
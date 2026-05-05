export type BattleBehavior = {
  onBasicHit: (data: {
    setNpcHP: React.Dispatch<React.SetStateAction<number>>;
    setStacks: React.Dispatch<React.SetStateAction<number>>;
    setDelicia: React.Dispatch<React.SetStateAction<number>>;
    HITS_TO_SPECIAL: number;

    spawnPiercing?: () => void; // 👈 novo
  }) => void;

  onSpecialHit: (data: {
    stacks: number;
    setNpcHP: React.Dispatch<React.SetStateAction<number>>;
    setStacks: React.Dispatch<React.SetStateAction<number>>;
    setDelicia: React.Dispatch<React.SetStateAction<number>>;

    triggerExplosion?: () => void; // 👈 novo
  }) => void;

  reset?: (data: {
    setStacks: React.Dispatch<React.SetStateAction<number>>;
    setDelicia: React.Dispatch<React.SetStateAction<number>>;
  }) => void;
};
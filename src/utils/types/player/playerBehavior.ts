export type BattleBehavior = {
  onBasicHit: (ctx: any) => void;
  onSpecialHit: (ctx: any) => void;
  reset?: (ctx: any) => void;
};
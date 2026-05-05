import { HealthBar } from "@/components/Game/HealthBar";
import { Deliciometro } from "@/components/Game/Deliciometro";


type Props = {
  battle: any;
  npcStats: any;
};

export function BattleHUD({ battle, npcStats }: Props) {
  return (
    <>
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <HealthBar hp={battle.playerHP} maxHp={battle.playerMaxHp} />
      </div>

      <div style={{ position: "absolute", top: 42, left: 20 }}>
        <Deliciometro
          delicia={battle.delicia}
          hitsToSpecial={battle.hitsToSpecial}
        />
      </div>

      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <HealthBar hp={battle.npcHP} maxHp={npcStats.hp} />
      </div>
    </>
  );
}
import { useEffect, useMemo, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useGameLayout } from "@/hooks/useGameLayout";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNpcAI } from "@/hooks/npc/useNpcAi";
import { useBattleSystem } from "@/hooks/battle/useBattleSystem";
import { GameMap } from "@/components/Game/GameMap";
import { PlayerBattle } from "@/components/Game/Player/Battle";
import { NPCBattle } from "@/components/Game/Npc/Battle";
import { HealthBar } from "@/components/Game/HealthBar";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "@/assets/songs/StreetFighter5KenTheme.m4a";
import { Deliciometro } from "@/components/Game/Deliciometro";
import { VictoryModal } from "@/components/VictoryModal";
import { useVictory } from "@/hooks/useVictory";


export default function PcRoomBattleTwo() {
  const { player, setMap, setMode, punch, special } = usePlayer();
  const { setOnConfirm, setOnCancel } = useGameControls();
  const {
    showVictory,
    triggerVictory,
    handleContinue,
  } = useVictory({ redirectTo: "/pcroom/Five" });

  // 🎵 áudio
  const audio = useMemo(() => ({
    src: KenTheme,
    loop: true,
    volume: 0.5,
  }), []);

  useGameAudio(audio);

  const
  {
    TILE_SIZE,
    offsetX,
    offsetY,
    PLAYER_SIZE,
    MAP_COLS,
    MAP_ROWS
  } = useGameLayout();

  const npcDummyAttackRef = useRef<() => void>(() => {});

  const npc = useNpcAI({
    playerX: player.x,
    playerY: player.y,
    onAttack: () => npcDummyAttackRef.current(),
    isPaused: showVictory,
  });

  // Batalha denovo se morrer para o npc e vai para Cantina se matar o npc
  const battle = useBattleSystem({
    playerX: player.x,
    playerY: player.y,
    npcX: npc.x,
    npcY: npc.y,
    playerState: player.state,
    onPlayerDeath: () => setMode("battle"),
    onNpcDeath: triggerVictory,
  });

  // conecta ataque do NPC (sem loop)
  const npcAttackRef = useRef(battle.npcHit);
  npcAttackRef.current = battle.npcHit;

  npcDummyAttackRef.current = () => npcAttackRef.current();

  useEffect(() => {
    setMap(firstBattle);
    setMode("battle");
  }, []);

  // Punch - button A
  useEffect(() => {
    function handleAttack() {
      if (showVictory) return;
      punch();
      battle.playerHit();
    }

    setOnConfirm(() => handleAttack);

    return () => setOnConfirm(undefined);
  }, [punch, battle.playerHit, showVictory]);

  useEffect(() => {
    function handleSpecial() {
      if (showVictory) return;
      special();
      battle.specialHit();
    }

    setOnCancel(() => handleSpecial);

    return () => setOnCancel(undefined);
  }, [battle.specialHit, showVictory]);

  return (
    <div className={`Master PcRoomBattle`}>
      
      {/* PLAYER HP */}
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <HealthBar hp={battle.playerHP} />
      </div>

      {/* 🧁 DELICIÔMETRO */}
    <div style={{ position: "absolute", top: 42, left: 20 }}>
      <Deliciometro delicia={battle.delicia} />
    </div>

      {/* NPC HP */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <HealthBar hp={battle.npcHP} />
      </div>

      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <NPCBattle
          x={npc.x}
          y={npc.y}
          TILE_SIZE={TILE_SIZE}
          npcType="vandinha"
          state={npc.state}
          direction={npc.direction}
        />

        <PlayerBattle
          x={player.x}
          y={player.y}
          PLAYER_SIZE={PLAYER_SIZE}
          state={player.state}
          direction={player.battleDirection}
        />
      </GameMap>
      {showVictory && (
        <VictoryModal
          isOpen={showVictory}
          title="Vitória!"
          description="Você escapou com sucesso de Vandinha"
          rewards={[
            "XP adquirido: 1xp",
            "XP para o próximo nível: 99xp",
            "Progresso na história: 0.1%"
          ]}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
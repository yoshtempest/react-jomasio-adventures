# Plano: Sistema de Velocidade de Movimento + Maugrelo Corre

## Objetivo
1. Maugrelo começa a andar (walk.svg) e após 1.5s troca para run.svg com velocidade de movimento dobrada
2. Criar sistema de `movementSpeed` (multiplier) para NPC e jogador, preparado para efeitos de lentidão futuros

## Arquivos a modificar

### 1. `src/utils/types/player/movement.ts` — Constantes de velocidade base
- Adicionar `NPC_BASE_SPEED = 2` (velocidade base de perseguição do NPC)
- Adicionar `NPC_RUNNING_SPEED = 4` (velocidade quando corre = 2x)

### 2. `src/utils/types/npc/npc.ts` — Tipo NPCBattleState
- Adicionar `"run"` à union de states do NPCBattleState

### 3. `src/utils/types/global.d.ts` — Tipo Player
- Adicionar `movementSpeed: number` ao tipo `Player` (default 1.0)

### 4. `src/utils/types/player/state.ts` — Estado inicial do jogador
- Adicionar `movementSpeed: 1` ao `BATTLE_DEFAULT_STATE`

### 5. `src/gameRules/movement/npc.ts` — getChaseMovement
- Aceitar parâmetro opcional `speedMultiplier?: number` (default 1)
- Multiplicar os valores de speed (0, 1, 2) pelo multiplier

### 6. `src/gameRules/npc/movement.ts` — chasePlayer wrapper
- Aceitar e repassar `speedMultiplier` para `getChaseMovement`

### 7. `src/gameRules/battle/behaviors/npc/maugrelo/state.ts` — AI state
- Adicionar `walkingStartTime: number` ao tipo `MaugreloAI`
- Inicializar com 0 no `initMaugreloAi()`
- Adicionar constante `RUN_TRANSITION_DELAY = 1500` (1.5s)

### 8. `src/gameRules/battle/behaviors/npc/maugrelo/phase1.ts` — Lógica de corrida
- Na fase idle quando faz chase: 
  - Se `walkingStartTime === 0`, inicializar com `Date.now()`
  - Se `Date.now() - walkingStartTime >= 1500`, retornar state `"run"` e speedMultiplier 2
  - Caso contrário, retornar state `"walk"` (comportamento atual)
- Ao iniciar preMove (ação de ataque), resetar `walkingStartTime = 0` (volta a andar ao recomeçar perseguição)

### 9. `src/gameRules/movement/battle.ts` — Movimento do jogador
- `getStep()` multiplicar por `player.movementSpeed`

### 10. `src/components/Game/Npc/Battle/index.tsx` — Render component
- Adicionar `"run"` à union de states do Props type

## Fluxo do Maugrelo

```
idle (açãoState) → chasePlayer → walk state + speed 1x
                                  ↓ (1.5s sem atacar)
                                run state + speed 2x
                                  ↓ (inicia ataque/preMove)
                                walkingStartTime = 0 → volta a walk
```

## Notas
- Maugrelo já tem `run.svg` em `public/assets/npcs/enemies/maugrelo/`
- O sprite path resolution (`getSpritePath`) já resolve `run.svg` corretamente via padrão `/${npcType}/${state}.svg`
- Player `movementSpeed` começa em 1.0 e pode ser modificado futuramente por efeitos de status

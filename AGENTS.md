# AGENTS.md — react-jomasio-adventures

## Tecnologias

- React 19, TypeScript 5.9, Vite (rolldown), React Router 7, lucide-react, ESLint 9 + typescript-eslint 8
- Path alias `@/` → `./src/`
- TypeScript strict mode, `verbatimModuleSyntax` (usar `import type` para type-only)

## Convenções de Nome

| Categoria   | Convenção                | Exemplo                     |
| ----------- | ------------------------ | --------------------------- |
| Componente  | `PascalCase.tsx`         | `Player.tsx`, `Navbar.tsx`  |
| Página      | `PascalCase/index.tsx`   | `pages/Hall/index.tsx`      |
| Contexto    | `PascalCaseContext.tsx`  | `PlayerContext.tsx`         |
| Hook        | `camelCase` com `use`    | `useGameAudio.ts`           |
| Utilitário  | `camelCase.ts`           | `saveGame.ts`               |
| Tipo/Data   | `camelCase.ts`           | `player.ts`, `inventory.ts` |
| CSS Module  | `styles.module.css`      | sempre `styles.module.css`  |
| Entry point | `index.ts` / `index.tsx` | re-export de pasta          |

Pastas em `src/` são lowercase. Pastas de componente são PascalCase.

## Estilo de Código

- **Componentes**: `export function Nome()` — nunca arrow function
- **Hooks**: `export function useNome()` — nunca arrow function
- **Export**: named exports geral; default export só para páginas (usado com lazyLoad)
- **CSS Module**: `import styles from "./styles.module.css"`, classes em camelCase, `className={styles.container}`
- **Imports** na ordem: React/libs → contexts → hooks → components → utils/types/data → CSS module (grupos separados por linha em branco)

## TypeScript

- `type` preferido sobre `interface`; interface só para props de componente e classes base
- Tipos globais em `utils/types/global.d.ts`
- Tipos de domínio em `utils/types/<dominio>/`
- String IDs type-safe: `type ItemId = Extract<keyof typeof ITEMS, string>`
- Arrays `as const` + `typeof ARRAY[number]` para unions de strings
- Discriminated unions para eventos (`{ type: "navigate"; to: string } | { type: "setFlag"; ... }`)
- Evitar `any` — apenas em casos extremos com comentário explicando

## Padrões React

### Context

```tsx
const MyCtx = createContext<MyType | null>(null);
export function MyProvider({ children }: { children: ReactNode }) { ... }
export function useMyCtx() {
  const ctx = useContext(MyCtx);
  if (!ctx) throw new Error("useMyCtx precisa do MyProvider");
  return ctx;
}
```

Ou simplificado: `createContext({} as Type)` sem null check.

### Refs

Usar `useRef` para: elementos audio, callbacks (evitar stale closures), flags one-shot, posição anterior, timers/intervals.

### useCallback / useMemo

- `useCallback` para funções passadas em dependency arrays
- `useMemo` para dados derivados e objetos retornados por hooks
- Tomar cuidado com stale closures ao usar funções de contexto dentro de effects

### useEffect

Usar cleanup function sempre que houver: event listeners, timeouts, intervals, audio. Layout shifts usar `useLayoutEffect`.

## Arquitetura do Jogo

### Diálogos

Definir com `defineDialogue()` (`src/data/dialogues/defineDialogue.ts`) + registro de falantes em `src/data/speakers.ts`. Nunca repetir `name`/`src`/`isPlayer` por fala:

```ts
export const meuDialogue = defineDialogue([
  ["jailson", "Olá"], // tupla: [who, message]
  ["protagonista", "Oi", "talking"], // 3º item: expression
  { who: "victor", pose: "sitting", message: "...", soundSrc: "..." }, // objeto p/ pose/sound/name override
]);
```

- Falantes novos vão no registro `SPEAKERS` (id, name, base, pose padrão)
- `useDialogue` resolve nome do player e sprite a partir de `expression` + character
- Formato raw (objeto sem `who`) é escape hatch — só para templates dinâmicos (ex: `goodPowder.ts`)

### Tile-based grid

17 colunas × 13 linhas. `TILE_SIZE` calculado dinamicamente. Posição: `{ gridX, gridY, direction }`.

### Scene pipeline

`pages/` → `features/` → `SceneBase` → `ExploreScene` → `GameMap` + `Player` + `NPC`

### Event system

Discriminated union `SceneEvent` com engine imperativo `runSceneEvents()`.

### Audio

- BGMs: `useGameAudio` hook (por componente)
- SFX: `SoundEffectsContext` pré-carrega em ref, método `playSound(id)`
- Volume sincronizado com `AudioContext`

### Save/Load

`localStorage` com múltiplas chaves. `saveGame()` chamado em useEffect em rota/data change.

### Controls

Stack-based: `GameControlsContext` com pilha de `GameControlLayer`. Input keyboard + mobile (JoystickMovement, ButtonsMovement).

### Battle

Composição de hooks: `useBattleSystem` → cooldowns, effects, player/NPC battle, lifecycle. HP = 90 + stats.hp \* 10. NPCs por dificuldade: common/rare/epic/boss/legendary.

## Organização de Pastas

| Pasta               | Conteúdo                                                                      |
| ------------------- | ----------------------------------------------------------------------------- |
| `src/components/`   | UI reutilizável agrupada por domínio                                          |
| `src/contexts/`     | Providers + hooks de contexto (flat, sem subpastas)                           |
| `src/hooks/`        | Hooks custom (battle/, player/, scene/, interaction/, menu/, npc/, tutorial/) |
| `src/utils/types/`  | Definições TS (player/, npc/, maps/)                                          |
| `src/gameRules/`    | Lógica pura do jogo (battle/, movement/, items/, menu/, npc/)                 |
| `src/engine/`       | Motor de eventos (`runSceneEvents.ts`)                                        |
| `src/data/`         | Dados estáticos (items/, flags/, quests/, maps/, options/)                    |
| `src/maps/`         | Matrizes de tile map por local                                                |
| `src/scenes/`       | Configurações de cena + factories compartilhadas                              |
| `src/features/`     | Wrappers de cena conectando dados ao SceneBase                                |
| `src/pages/`        | Páginas de rota (cada uma em pasta com index.tsx)                             |
| `src/interactions/` | Definições de interação por local (builder pattern)                           |
| `src/online/`       | Funcionalidades multiplayer                                                   |

## Regras Importantes

- **Não colocar side effects dentro de state updaters** (ex: `playSound` dentro de `setItems(prev => {...})`)
- **Não checar variável setada dentro de updater fora dele** — o update é assíncrono
- **Sempre limpar timeouts/intervals** no cleanup do useEffect
- **Estabilizar dependências de effects** usando refs quando necessário
- **Usar `import type`** para imports type-only (verbatimModuleSyntax)
- **Não usar `arcade.ts`** — arquivo está quebrado e deve ser ignorado

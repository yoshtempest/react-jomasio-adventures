# Documentação do Jogo — Jomasio Adventures

---

## 1. INTRODUÇÃO

### O que é este documento?

Este documento é o artefato de requisitos do projeto **Jomasio Adventures**, um RPG 2D em grid baseado no ambiente do Ceti Jomásio dos Santos Barros. Ele descreve as funcionalidades, regras, restrições e arquitetura do sistema para servir como referência durante o desenvolvimento e manutenção do jogo.

### Para quem este documento é feito?

- **Desenvolvedores** que precisam entender a estrutura do código e as regras de negócio
- **Testadores** que validam o comportamento do sistema
- **Novos contribuidores** que ingressam no projeto
- **Orientadores / avaliadores** que acompanham o progresso do projeto

---

## 2. DESCRIÇÃO GERAL DO PRODUTO

### Qual é a situação atual?

O jogo está em desenvolvimento ativo. Atualmente conta com:

- Motor de exploração em grid (17 colunas × 13 linhas) com tiles dinâmicos
- 15+ cenários interconectados (hall, PC room, cantina, cafeteria, biblioteca, diretoria, campos de futebol, hellroom, etc.)
- Sistema de batalha em tempo real com 3 variantes de projéteis (comum, puxão e chuva de projéteis)
- Sistema de missões com 4 categorias: história, secundárias, batalha, diárias/semanais
- NPCs com diálogos condicionais e árvores de interação
- Sistema de áudio (Background + Efeitos Sonoros) com suporte a AudioContext
- Salvamento automático em localStorage com compressão de dados (LZ-String)
- Suporte a PWA (instalável como aplicativo)
- Modo multiplayer em desenvolvimento (pasta `online/`)
- UI responsiva com suporte a mobile (touch controls)

### Qual é o escopo do projeto?

O escopo atual abrange:

- **Exploração**: jogador navega por um grid 2D com tiles de colisão, portas condicionais e eventos de cena
- **Batalha**: combate em tempo real contra NPCs com diferentes dificuldades (common, rare, epic, boss, legendary) e classes (easy, medium, hard, insano)
- **Missões (Quests)**: sistema de missões com progresso, recompensas (XP, itens, moedas), tipos história/secundárias/batalha/diárias/semanais
- **Inventário**: gerenciamento de itens coletados em mapa
- **Diálogo**: sistema de diálogo com fallback condicional baseado em estado do jogo (quests, items, flags, personagem)
- **Progressão**: stats do jogador (HP, força, inteligência, armadura, escudo, vampirismo, reflexão) modificáveis por equipamentos, títulos e classe
- **Salvamento**: save automático com múltiplas chaves em localStorage
- **Configurações**: dificuldade, volumes de áudio, velocidade de diálogo
- **Indicador de missões**: seta dourada apontando tiles de saída que levam à missão ativa + "!" amarelo sobre NPCs relevantes

### Quem são os atores do sistema?

| Ator              | Descrição                                                                             |
| ----------------- | ------------------------------------------------------------------------------------- |
| **Jogador**       | Usuário que controla o personagem principal no mundo do jogo                          |
| **NPC**           | Personagens não jogáveis que interagem via diálogo, batalha ou entrega de itens       |
| **Sistema**       | Motor do jogo que gerencia cenas, eventos, transições, salvamento e lógica de negócio |
| **Administrador** | Desenvolvedor que mantém o código e dados do jogo                                     |

### Quais são as premissas?

1. O jogo funciona exclusivamente no navegador (client-side)
2. Não há backend persistente — todos os dados são armazenados em localStorage
3. O jogo depende de assets estáticos (imagens, áudios) servidos via público
4. A conexão com a internet é necessária apenas para carregamento inicial e funcionalidades multiplayer futuras
5. O grid é fixo em 17×13 tiles, com TILE_SIZE calculado dinamicamente por viewport
6. O sistema de roteamento é hash-based (HashRouter) para compatibilidade com GitHub Pages

---

## 3. REQUISITOS

### 3.1 Requisitos Funcionais

| ID   | Requisito                                                                                                           | Prioridade |
| ---- | ------------------------------------------------------------------------------------------------------------------- | ---------- |
| RF01 | O jogador deve se movimentar pelo grid em 4 direções (cima, baixo, esquerda, direita)                               | Alta       |
| RF02 | O jogador deve interagir com NPCs e objetos ao pressionar o botão de ação                                           | Alta       |
| RF03 | O sistema deve detectar tiles de transição e navegar entre cenas                                                    | Alta       |
| RF04 | O sistema deve suportar tiles com rota condicional baseada em estado de missões                                     | Alta       |
| RF05 | O jogador deve poder entrar em batalha contra NPCs                                                                  | Alta       |
| RF06 | O sistema de batalha deve suportar ataques, habilidades especiais e sistema de cooldown                             | Alta       |
| RF07 | O sistema deve gerenciar HP do jogador (HP = 90 + stats.hp × 10)                                                    | Alta       |
| RF08 | O sistema de missões deve permitir receber, progredir e concluir missões                                            | Alta       |
| RF09 | O sistema deve gerar missões diárias e semanais automaticamente                                                     | Alta       |
| RF10 | O jogador deve poder coletar e gerenciar itens no inventário                                                        | Alta       |
| RF11 | O sistema de diálogo deve exibir falas com nome e avatar                                                            | Alta       |
| RF12 | O sistema de diálogo deve suportar ramificações condicionais baseadas no estado do jogo                             | Alta       |
| RF13 | O jogador deve poder abrir um menu de configurações durante o jogo                                                  | Média      |
| RF14 | O sistema deve permitir ajustar volume de SFX e BGM separadamente                                                   | Média      |
| RF15 | O sistema deve permitir ajustar a velocidade do diálogo (rápido, normal, devagar)                                   | Média      |
| RF16 | O sistema deve salvar automaticamente o progresso ao mudar de cena                                                  | Alta       |
| RF17 | O sistema deve restaurar a posição do jogador ao retornar a uma cena visitada                                       | Média      |
| RF18 | O sistema de áudio deve tocar BGM de fundo por cena e SFX para ações                                                | Alta       |
| RF19 | O sistema deve exibir um indicador visual (seta + "!") para missões ativas quando habilitado                        | Baixa      |
| RF20 | O jogador deve poder alternar o indicador de missões nas configurações                                              | Baixa      |
| RF21 | O jogo deve funcionar como PWA (instalável, service worker)                                                         | Média      |
| RF22 | O jogador deve poder selecionar e trocar de personagem                                                              | Média      |
| RF23 | O sistema deve suportar classes de jogador (fracote, idiota, amostradinho) com stats diferentes                     | Média      |
| RF24 | O sistema de batalha deve suportar 3 variantes de projéteis NPC: comum, pull (com atração) e rain (chuva de lanças) | Alta       |
| RF25 | O sistema deve suportar um puzzle de Pandemônio (quebra-cabeça) para progressão de história                         | Baixa      |
| RF26 | O sistema deve exibir um overlay de mapa ao pressionar o modo mapa                                                  | Baixa      |

### 3.2 Requisitos Não Funcionais

| ID    | Requisito            | Descrição                                                                         |
| ----- | -------------------- | --------------------------------------------------------------------------------- |
| RNF01 | Desempenho           | O jogo deve manter 60 FPS em dispositivos móveis modernos                         |
| RNF02 | Compatibilidade      | Deve funcionar nos navegadores Chrome, Firefox, Edge e Safari (últimas 2 versões) |
| RNF03 | Responsividade       | A interface deve se adaptar a orientações portrait e landscape em mobile          |
| RNF04 | Acessibilidade       | Deve suportar navegação por teclado (setas + Enter + L)                           |
| RNF05 | Persistência         | O progresso do jogador deve persistir entre sessões via localStorage              |
| RNF06 | Tipagem              | Todo o código deve ser escrito em TypeScript strict mode                          |
| RNF07 | Performance de build | O bundle deve ser otimizado com code-splitting (lazy loading de páginas)          |
| RNF08 | Offline-first        | O jogo deve funcionar offline após o primeiro carregamento (PWA)                  |

### 3.3 Regras de Negócio

| ID   | Regra                                                                                                              |
| ---- | ------------------------------------------------------------------------------------------------------------------ |
| RN01 | O jogador só pode atravessar tiles de transição se atender às condições da rota (ex: ter determinada missão ativa) |
| RN02 | Missões diárias resetam diariamente; missões semanais resetam semanalmente                                         |
| RN03 | O HP máximo do jogador é calculado como `90 + stats.hp × 10`                                                       |
| RN04 | NPCs de batalha possuem dificuldade categorizada: common, rare, epic, boss, legendary                              |
| RN05 | A dificuldade do jogo (easy, medium, hard) modifica parâmetros de batalha                                          |
| RN06 | Uma missão só pode ser concluída quando `progress >= counter`                                                      |
| RN07 | Não é possível ter a mesma missão mais de uma vez na lista                                                         |
| RN08 | Recompensas de missões podem ser XP, itens, moedas ou hyperCoins                                                   |
| RN09 | O personagem do jogador é definido no início da partida e pode ser trocado                                         |
| RN10 | O sistema de áudio usa AudioContext para sincronização de volume global                                            |
| RN11 | A posição do jogador em cada cena é salva e restaurada ao retornar                                                 |
| RN12 | Eventos de cena são processados em pipeline via `runSceneEvents()`                                                 |
| RN13 | O projétil do tipo "pull" atrai o jogador em direção ao NPC                                                        |
| RN14 | O projétil do tipo "rain" cria uma chuva de lanças com tempo de aviso                                              |

### 3.4 Restrições de Hardware

- Dispositivo com navegador web moderno (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+)
- Conexão com internet para carregamento inicial (opcional após instalação PWA)
- Recomendado: tela mínima de 320px de largura para mobile
- Áudio funcional para experiência completa

### 3.5 Restrições de Software

- O jogo executa exclusivamente no navegador (client-side rendering)
- Utiliza React 19 com TypeScript 5.9
- Build system: Vite (rolldown-vite)
- Roteamento: React Router 7 com HashRouter
- Ícones: lucide-react
- Compressão: lz-string para localStorage
- Sem dependência de backend (exceto funcionalidades multiplayer futuras)
- Service worker gerado por vite-plugin-pwa

### 3.6 Casos de Uso

| UC   | Nome               | Ator Principal    | Descrição                                                      |
| ---- | ------------------ | ----------------- | -------------------------------------------------------------- |
| UC01 | Movimentar Jogador | Jogador           | Navegar pelo grid usando teclado ou controles touch            |
| UC02 | Interagir com NPC  | Jogador           | Pressionar botão de ação para iniciar diálogo com NPC          |
| UC03 | Atravessar Porta   | Jogador           | Pisar em tile de transição para mudar de cena                  |
| UC04 | Iniciar Batalha    | Jogador / Sistema | Encontrar NPC hostil e entrar em modo de combate               |
| UC05 | Atacar em Batalha  | Jogador           | Pressionar botão de ataque durante batalha                     |
| UC06 | Usar Special       | Jogador           | Usar habilidade especial quando deliciômetro estiver carregado |
| UC07 | Receber Missão     | Jogador / NPC     | Interagir com NPC que concede uma missão                       |
| UC08 | Progredir Missão   | Sistema           | Sistema atualiza progresso da missão ao cumprir objetivo       |
| UC09 | Coletar Item       | Jogador           | Interagir com tile que contém um item coletável                |
| UC10 | Abrir Menu         | Jogador           | Abrir menu de configurações durante o jogo                     |
| UC11 | Ajustar Volume     | Jogador           | Modificar volume de SFX e BGM nas configurações                |
| UC12 | Salvar Jogo        | Sistema           | Save automático ao mudar de cena ou rota                       |
| UC13 | Visualizar Mapa    | Jogador           | Alternar para overlay de mapa da cena atual                    |

### 3.7 Diagrama de Classes

```
┌──────────────────────┐        ┌──────────────────────┐
│       Player         │        │         NPC          │
├──────────────────────┤        ├──────────────────────┤
│ - gridX: number      │        │ - gridX: number      │
│ - gridY: number      │        │ - gridY: number      │
│ - direction: Dir     │        │ - src: string        │
│ - character: CharId  │        │ - interaction?: fn   │
│ - state: PlayerState │        └──────────┬───────────┘
│ - mode: PlayerMode   │                   │
│ - x, y: number       │        ┌──────────┴───────────┐
│ - hp, stats: StatBk  │        │   SceneNPCData       │
└──────────┬───────────┘        └──────────────────────┘
           │
           │ 1                    ┌──────────────────────┐
           │                      │       Quest          │
           ▼                      ├──────────────────────┤
┌──────────────────────┐          │ - id: string         │
│      Inventory       │          │ - name: string       │
├──────────────────────┤          │ - type: QuestType    │
│ - items: Item[]      │          │ - counter: number    │
│ + addItem()          │          │ - progress: number   │
│ + removeItem()       │          │ - completed: bool    │
│ + hasItem()          │          │ - claimed?: bool     │
└──────────────────────┘          │ - rewardsType        │
                                  │ - rewards: number    │
┌──────────────────────┐          └──────────────────────┘
│      SceneConfig     │
├──────────────────────┤         ┌──────────────────────┐
│ - id: SceneId        │         │     SceneTile        │
│ - map: number[][]    │         ├──────────────────────┤
│ - tiles: SceneTile[] │         │ - x, y: number       │
│ - npcs: SceneNpc[]   │         │ - route?: string     │
│ - plates: ScenePlate │         │ - getRoute?: fn      │
│ - audio: AudioConfig │         │ - requiredQuest?: Id │
│ - events: SceneEvent │         └──────────────────────┘
└──────────────────────┘

┌──────────────────────┐         ┌────────────────────── ┐
│    Projectile        │         │   GameControlsLayer   │
├──────────────────────┤         ├────────────────────── ┤
│ - variant: string    │         │ - onUp/Down/Left/Right│
│ - x, y: number       │         │ - onConfirm/Cancel    │
│ - startX/Y: number   │         │ - blockGlobalOpen     │
│ - createdAt: number  │         └────────────────────── ┘
         ▲
         │
         ├── ProjectileCommon
         ├── ProjectilePull (pullTargetX)
         └── ProjectileRain (spears, warningDuration)
```

---

## 4. PROTÓTIPOS DE INTERFACE

O jogo utiliza renderização posicional absoluta sobre um container central. Abaixo estão descritos os principais componentes de interface:

### Tela de Exploração (ExploreScene)

```
┌─────────────────────────────────────────────┐
│  ┌───────────────────────────────────────┐  │
│  │  [NPC]    [▲]    [NPC]               │  │
│  │                                       │  │
│  │       [!]                             │  │
│  │    [NPC]              [Placa]         │  │
│  │                                       │  │
│  │              [Jogador]                │  │
│  │                                       │  │
│  │                    [PORTAL]           │  │
│  └───────────────────────────────────────┘  │
│                                             │
│         [Diálogo / Popup]                    │
│                                             │
└─────────────────────────────────────────────┘
```

**Elementos:**

- **Grid 17×13** com TILE_SIZE responsivo
- **NPCs**: sprites 1.7× tile size com z-index 9
- **Jogador**: sprite central controlado por input
- **Indicador de missão**: seta dourada (▲) pulsando acima do tile de saída relevante
- **Badge de NPC**: "!" amarelo pulsando acima de NPCs que dão continuidade à missão ativa
- **Placas**: mensagens informativas ao interagir
- **Popups**: notificações temporárias no centro da tela

### Tela de Batalha (BattleScene)

```
┌─────────────────────────────────────────────┐
│  [NPC inimigo]   HP: ████████░░             │
│                                             │
│         [Projéteis]   ← ou ↓ ou ☇           │
│                                             │
│  [Jogador]   HP: ██████████░░               │
│                                             │
│  [Deliciômetro] ██████░░░░                  │
│                                             │
│  [ATK] [SPL] [DEF] [ITEM]                   │
└─────────────────────────────────────────────┘
```

**Elementos:**

- Barra de HP do jogador e do NPC
- Deliciômetro (para habilidade especial)
- Projéteis animados (comum, pull com seta de atração, rain com aviso de área)
- Botões de ação: ataque, special, defesa, item
- Tela de transição ao entrar/sair de batalha

### Menu de Configurações (Config)

```
┌─────────────────────────────────────────────┐
│  Dificuldade: [EASY] [MEDIUM] [HARD] [🔒]  │
│         ▼                                    │
│  Efeitos Sonoros: 70                         │
│  ████████████████████░░░░                    │
│                                             │
│  Música de Fundo: 50                        │
│  ██████████████░░░░░░░░░░                  │
│                                             │
│  Velocidade do Diálogo: NORMAL              │
│  [RÁPIDO] [NORMAL] [DEVAGAR]                │
│                                             │
│  Indicador de Missões: ON                   │
│                                             │
│  Ver Tutorial                               │
│                                             │
│  [Instalar App]                              │
└─────────────────────────────────────────────┘
```

### HUD do Jogador (Explore)

```
┌─────────────────────────────────────────────┐
│  [Menu]                    [Mapa] [Config]  │
│                                             │
│           (área do jogo)                     │
│                                             │
│  Joystick virtual (mobile) / D-pad (opção)  │
└─────────────────────────────────────────────┘
```

### Overlay de Mapa (MapOverlay)

```
┌─────────────────────────────────────────────┐
│                                             │
│     ░░▓▓░░░░▓▓░░░░░░▓▓░░░░                 │
│     ░░▓▓░░░░▓▓░░░░░░▓▓░░░░                 │
│     ░░░░░░[🧑]░░░░░░░░░░░░                 │
│     ▓▓▓▓░░░░░░▓▓▓▓▓▓░░░░░░                 │
│                                             │
│            Pressione L para sair             │
└─────────────────────────────────────────────┘
```

---

## 5. MEMBROS

| Nome    | Função                                                                           |
| ------- | -------------------------------------------------------------------------------- |
| Marcelo | Desenvolvedor full-stack, arquitetura do sistema, implementação do motor do jogo |
| —       | Em busca de novos contribuidores                                                 |

---

_Documento gerado em Junho de 2026. O projeto está em desenvolvimento ativo e este documento reflete o estado atual do sistema._

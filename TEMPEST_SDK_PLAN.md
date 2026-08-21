# Plano — adoção do tempest-react-sdk 0.43 (escopo PWA)

Documento de planejamento. **Nada foi instalado nem publicado.** Escopo decidido:

- Subir o pin do SDK para `^0.43.0` (hoje `^0.25.0`, não instalado).
- Trocar **o pipeline PWA inteiro** (React + service worker + build), não só a camada React.
- **Não tocar em API/auth/HTTP** nesta rodada (`utils/api.ts`, `AuthContext`, cloud save ficam como estão).
- Extrair 4 utilitários do jogo para o SDK e passar a importá-los de lá.

---

## Estado atual verificado

| Fato                        | Valor                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Pin no `package.json`       | `tempest-react-sdk: ^0.25.0`                                                                                                                   |
| Uso real no código          | zero — só `// import "tempest-react-sdk/styles.css";` em `src/main.tsx:1`                                                                      |
| Instalado em `node_modules` | **não** (install fora de sync)                                                                                                                 |
| Última versão no npm        | `0.42.1`                                                                                                                                       |
| Repo local do SDK           | `~/projects/my/packages/tempest-react-sdk`, branch `release/v0.43.0`, tree limpo, tag `v0.43.0` local, **4 commits à frente de `origin/main`** |

O motivo de exigir 0.43 continua válido: até 0.42.1 inclusive, `react-router` é **dependency** fixada em `^8.3.0`. O jogo usa `react-router@^7.9.5` → npm instala uma cópia aninhada em `tempest-react-sdk/node_modules/react-router`. Duas instâncias de router = `useNavigate() may be used only in the context of a <Router> component`. Em 0.43.0 virou peer `^7 || ^8`, satisfeita pelo 7.9.5 já instalado.

---

## Fase 0 — destravar o 0.43.0 (repo do SDK)

Pré-requisito de tudo. Nenhum passo da Fase 1 roda antes disso.

```bash
cd ~/projects/my/packages/tempest-react-sdk
git log --oneline origin/main..HEAD    # confirma os 4 commits
gh pr create --base main --head release/v0.43.0   # ou merge direto
# após o merge em main:
git push origin v0.43.0                 # tag push dispara .github/workflows/release-npm.yml
```

O workflow `release-npm.yml` aborta se a tag não bater com o `package.json` e faz read-back do registry. Verificação de saída:

```bash
npm view tempest-react-sdk version   # esperado: 0.43.0
```

**Alternativa sem publicar** (se quiser começar a Fase 1 antes): `npm i file:../../my/packages/tempest-react-sdk` no jomásio, trocando pelo pin `^0.43.0` depois. Não recomendado como estado final — prende o projeto do cliente a um caminho local.

---

## Fase 1 — pipeline PWA

### 1.1 Dependências

**Remover** (`package.json`):

```
vite-plugin-pwa          (devDep)
workbox-core             (dep)
workbox-precaching       (dep)
workbox-routing          (dep)
workbox-strategies       (dep)
```

**Atualizar**: `tempest-react-sdk: ^0.25.0` → `^0.43.0`.

Nada a adicionar: `react-router@7.9.5` já satisfaz o peer, e `vite` + `@vitejs/plugin-react` (peers opcionais do subpath `/vite`) já estão instalados.

**Não usar `tempestPwaIcons()`** — ele rasteriza um `icon.svg` com `sharp`; o jogo já tem os 4 PNGs prontos em `public/`. Adicionar `sharp` seria dependência nova sem ganho.

### 1.2 Web app manifest passa a ser um arquivo versionado

Hoje o `manifest.webmanifest` é **gerado** pelo `VitePWA({ manifest: {...} })` (`vite.config.ts:42-72`). O SDK não gera web app manifest — `tempestPwaManifest()` emite o _precache_ manifest, que é outra coisa. Então o manifest vira arquivo de verdade.

Criar `public/manifest.webmanifest` com o conteúdo que hoje está inline no `vite.config.ts`:

```json
{
  "name": "Jomásio Adventures",
  "short_name": "Jomásio Adventures",
  "description": "RPG estilo retrô com batalhas, exploração e missões.",
  "id": "/react-jomasio-adventures/",
  "start_url": "/react-jomasio-adventures/",
  "scope": "/react-jomasio-adventures/",
  "display": "standalone",
  "lang": "pt-BR",
  "theme_color": "#121B31",
  "background_color": "#0A0500",
  "icons": [
    {
      "src": "pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "pwa-maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "pwa-maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

> Aproveitar para corrigir um bug atual: `public/pwa-maskable-192x192.png` existe mas **nunca entrou no manifest** — o `vite.config.ts` só declara `maskable-512`.

E linkar em `index.html` (que hoje não tem `<link rel="manifest">` porque o plugin injetava):

```html
<link rel="manifest" href="/react-jomasio-adventures/manifest.webmanifest" />
```

### 1.3 `vite.config.ts`

Manter `defineConfig` próprio (não migrar para `createViteConfig` — o jogo tem `base`, proxy e alias já resolvidos, e trocar o wrapper aumenta a superfície do PR sem ganho).

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { tempestPwaManifest, tempestPwaDevSw } from "tempest-react-sdk/vite";

const BASE = "/react-jomasio-adventures/";

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tempestPwaManifest({
      appShell: `${BASE}index.html`,
      additionalUrls: [
        `${BASE}manifest.webmanifest`,
        `${BASE}pwa-192x192.png`,
        `${BASE}pwa-512x512.png`,
        `${BASE}pwa-maskable-192x192.png`,
        `${BASE}pwa-maskable-512x512.png`,
        `${BASE}favicon.ico`,
      ],
    }),
    tempestPwaDevSw(),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

> ⚠️ **Base path — a armadilha principal desta fase.** Em `src/vite/tempest-pwa-manifest.ts:79-85`, só os arquivos emitidos pelo bundle passam por `joinBase(base, file)`. `additionalUrls` e `appShell` entram **crus** no manifest. Com `base` diferente de `/`, os dois precisam vir já prefixados — é por isso que o snippet acima repete `BASE` em cada entrada. Ver a Fase 2.5, que propõe corrigir isso no SDK.

O `globPatterns: ["**/*.{js,css,html}"]` de hoje some sem perda: `tempestPwaManifest` já lista exatamente os arquivos emitidos pelo bundle. Os ~200 SVGs e os áudios em `public/` continuam **fora** do precache (Vite copia `public/` sem passar pelo bundle) e seguem servidos por runtime cache — mesmo comportamento de hoje, e o desejado: precachear a pasta inteira estouraria a quota na instalação.

### 1.4 `vite.sw.config.ts` (arquivo novo)

Sem `vite-plugin-pwa`, ninguém compila `src/sw.ts`. Build dedicado, no padrão do `template-pwa/` do SDK:

```ts
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/sw.ts"),
      formats: ["iife"],
      name: "sw",
      fileName: () => "sw.js",
    },
    rollupOptions: {
      output: { entryFileNames: "sw.js", inlineDynamicImports: true },
    },
  },
});
```

`package.json` scripts:

```diff
-    "build": "tsc -b && vite build",
+    "build": "tsc -b && vite build && npm run build:sw",
+    "build:sw": "vite build --config vite.sw.config.ts",
```

`emptyOutDir: false` é obrigatório — sem isso o segundo build apaga o `dist/` do primeiro. `iife` produz worker clássico (sem `import`/`export`), então o registro dispensa `type: "module"`.

### 1.5 `src/sw.ts`

De workbox para os helpers do SDK. Cobre 1:1 o que existe hoje (`precacheAndRoute`, `SKIP_WAITING`, `claim`, `push`, `notificationclick`) e ganha runtime cache com **Range requests**, que o workbox atual não faz.

```ts
/// <reference lib="webworker" />
import {
  installNotificationClickHandler,
  installPrecache,
  installPushHandler,
  installRuntimeCache,
  installSkipWaitingListener,
} from "tempest-react-sdk/sw";

const BASE = "/react-jomasio-adventures/";

installPushHandler({
  defaultTitle: "Nova notificação",
  defaultIcon: `${BASE}pwa-192x192.png`,
  defaultBadge: `${BASE}pwa-192x192.png`,
});
installNotificationClickHandler();
installSkipWaitingListener();

installRuntimeCache([
  {
    match: /\.(png|svg|gif|ico|webp)$/i,
    strategy: "cache-first",
    cacheName: "images",
    maxEntries: 400,
  },
  {
    match: /\.(mp3|m4a|wav|ogg|mp4|webm)$/i,
    strategy: "cache-first",
    cacheName: "media",
    maxEntries: 120,
    rangeRequests: true,
  },
  {
    match: (url) => url.pathname.startsWith("/api/"),
    strategy: "network-first",
    cacheName: "api",
    networkTimeoutSeconds: 5,
    maxAgeSeconds: 300,
  },
]);

installPrecache({
  manifestUrl: `${BASE}precache-manifest.json`,
  navigateFallback: `${BASE}index.html`,
  navigateFallbackDenylist: [/^\/api\//],
});
```

Ganhos concretos sobre o `sw.ts` atual:

- `rangeRequests: true` nos áudios/vídeos. Hoje o workbox faz `CacheFirst` sem Range, então seek em `denisburn.webm` e nas BGMs longas quebra offline.
- Vídeos (`.mp4`, `.webm`) e `.ico`/`.webp` entram no runtime cache — o `urlPattern` de hoje (`vite.config.ts:25,32`) só cobre `png|svg|gif` e `mp3|m4a`.
- `/api/` ganha `network-first` com timeout — hoje passa direto, sem cache nenhum.
- `installNotificationClickHandler` foca uma janela já aberta antes de cair no `openWindow`; o handler atual (`sw.ts:56-60`) sempre abre janela nova.
- `installPrecache` liga Navigation Preload por padrão.
- `installRuntimeCache` **antes** de `installPrecache` — rotas específicas precisam ganhar do catch-all do precache.

`src/sw.ts` some do `tsconfig.app.json`? Não: continua sendo type-checked normalmente, só muda quem o bundla.

### 1.6 `UpdateContext.tsx` → `useServiceWorkerUpdate`

O contexto atual registra via `virtual:pwa-register` e precisa de um `setTimeout(…, 5000)` (`UpdateContext.tsx:62-64`) para "adivinhar" que a verificação terminou, porque `registerSW` não expõe o estado real. O hook do SDK expõe.

Manter o contexto (4 consumidores dependem dele), trocando só o miolo:

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useServiceWorkerUpdate } from "tempest-react-sdk";

const BASE = import.meta.env.BASE_URL;

export type UpdateStatus =
  "idle" | "checking" | "uptodate" | "available" | "error";

type UpdateContextType = {
  status: UpdateStatus;
  checkForUpdate: () => void;
  applyUpdate: () => void;
  lastChecked: number | null;
};

const UpdateContext = createContext<UpdateContextType>({
  status: "idle",
  checkForUpdate: () => {},
  applyUpdate: () => {},
  lastChecked: null,
});

export function UpdateProvider({ children }: { children: ReactNode }) {
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);

  const { updateAvailable, applyUpdate, registration } = useServiceWorkerUpdate(
    {
      url: `${BASE}sw.js`,
      scope: BASE,
      onError: () => setChecking(false),
    },
  );

  const checkForUpdate = useCallback(() => {
    if (!registration) return;
    setChecking(true);
    setLastChecked(Date.now());
    registration.update().finally(() => setChecking(false));
  }, [registration]);

  const status: UpdateStatus = checking
    ? "checking"
    : updateAvailable
      ? "available"
      : registration
        ? "uptodate"
        : "idle";

  return (
    <UpdateContext.Provider
      value={{ status, checkForUpdate, applyUpdate, lastChecked }}
    >
      {children}
    </UpdateContext.Provider>
  );
}
```

**Mudança de comportamento a decidir com o produto.** Hoje o `registerType: "autoUpdate"` recarrega a página sozinho quando um worker novo assume — no meio de uma batalha, isso derruba o jogador. `useServiceWorkerUpdate` mantém `autoUpdate` desligado de propósito e entrega o `applyUpdate` para a UI chamar. Duas saídas:

1. **Recomendada:** `status === "available"` acende o `UpdateButton` como "Atualizar agora" e chama `applyUpdate()` no clique. O jogador escolhe o momento.
2. Manter o comportamento atual passando `autoUpdate: true` nas opções.

Consumidores a ajustar: `components/Navbar/Config/UpdateButton/index.tsx:6` (novo label/ação para `"available"`), `pages/Loading/index.tsx:19`, `hooks/menu/config/useConfigSelection.ts:44`.

### 1.7 `PWAContext.tsx` → `useInstallPrompt`

Ganho maior desta fase. O contexto atual só entende o caminho Chromium: sem `beforeinstallprompt`, `canInstall` fica `false` e a UI cai no popup genérico `showNotAvailableMessage` (`components/PWA/index.tsx:32-46`) — ou seja, **todo usuário de iPhone recebe instrução de menu Android**.

`useInstallPrompt` resolve isso com `method: "native" | "ios" | "manual" | "none"`, mais `isIOS`, `isStandalone`, `isManualAndroid`, `promptTimedOut`, `openInChromeIntent` e cooldown de recusa persistido.

```tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import { useInstallPrompt } from "tempest-react-sdk";

type PWAContextType = ReturnType<typeof useInstallPrompt> & {
  showInstalledMessage: boolean;
  setShowInstalledMessage: (show: boolean) => void;
};

const PWAContext = createContext({} as PWAContextType);

export function PWAProvider({ children }: { children: ReactNode }) {
  const prompt = useInstallPrompt({
    declineStorageKey: "jomasio_install_declined",
  });
  const [showInstalledMessage, setShowInstalledMessage] = useState(false);

  return (
    <PWAContext.Provider
      value={{ ...prompt, showInstalledMessage, setShowInstalledMessage }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  return useContext(PWAContext);
}
```

Em `components/PWA/index.tsx`, `showNotAvailableMessage` deixa de existir e o texto do popup passa a ser escolhido por `method`:

- `"ios"` → "Toque em Compartilhar (↗) e escolha _Adicionar à Tela de Início_."
- `"manual"` → texto atual do menu do navegador, + botão usando `openInChromeIntent` quando não for `null`.
- `"native"` → botão que chama `install()`.
- `"none"` → `isStandalone` decide entre "já instalado" e nada.

`src/utils/types/pwa.d.ts` pode ser apagado — o SDK exporta `BeforeInstallPromptEvent` de `hooks/pwa-env`. Ajustar `useConfigSelection.ts:51` (que hoje desestrutura `setShowNotAvailableMessage`).

**Não usar** `InstallBanner` / `InstallButton` do SDK: são CSS Modules com tokens `--tempest-*` e destoariam do pixel-art. Só os hooks.

### 1.8 Durabilidade do save (novo, sem equivalente hoje)

Todo o save vive em `localStorage` (37 arquivos usam) + Cache Storage, **sem nunca chamar `navigator.storage.persist()`**. Sob pressão de disco o browser pode evictar tudo — o jogador perde o progresso sem aviso e sem log.

Adicionar no `PWAProvider` (ou num `useEffect` do `App`):

```ts
import {
  requestPersistentStorage,
  useStorageEstimate,
} from "tempest-react-sdk";
```

- `requestPersistentStorage()` uma vez, após o primeiro save bem-sucedido (o browser decide por heurística de engajamento; pedir cedo demais é negado).
- `useStorageEstimate()` na tela de configurações: "usando X de Y MB" + ação de tornar permanente.

### 1.9 Verificação da Fase 1

Type-check e lint não provam PWA. Checklist mínimo:

```bash
npm run type-check && npm run lint && npm run build
ls dist/sw.js dist/precache-manifest.json          # os dois têm que existir
```

No browser (Playwright MCP ou manual), com `npm run preview`:

1. Application → Service Workers: worker ativo com scope `/react-jomasio-adventures/`.
2. Application → Cache Storage: buckets `tempest-precache-<hash>`, `images`, `media`.
3. Offline (DevTools → Network → Offline) + reload → o jogo abre pelo `navigateFallback`.
4. Entrar numa cena com BGM e dar seek no áudio **offline** — é o que o `rangeRequests` conserta.
5. Console sem erro de registro; `/react-jomasio-adventures/manifest.webmanifest` retorna 200.
6. `npm run dev` com o `tempestPwaDevSw()` ativo: `/sw.js` servido em dev (equivalente ao `devOptions.enabled: true` de hoje).

> ⚠️ Verificar no passo 6 se `tempestPwaDevSw()` respeita o `base` do Vite. Os defaults são `/sw.js` e `/precache-manifest.json` (root-absolutos), e o dev server serve sob `/react-jomasio-adventures/`. Se não respeitar, passar `swUrl`/`manifestUrl` prefixados — e é mais um caso para a correção da Fase 2.5.

---

## Fase 2 — do jogo para o SDK

Cada item vira PR próprio no repo do SDK, seguindo as convenções de lá: aspas duplas, tipagem total, **JSDoc em inglês** nos exports públicos, teste co-locado (`<arquivo>.test.ts`), re-export no barrel do módulo **e** em `src/index.ts` (ler o barrel antes de reescrever — é lição registrada no `CLAUDE.md` do SDK), doc bilíngue (`<pagina>.md` + `<pagina>.en.md`) com entrada nos dois blocos `nav:` do `mkdocs.yml`, e entrada no `CHANGELOG.md`.

### 2.1 Storage comprimido — `src/utils/storage.ts`

**Maior ganho dos dois lados.** O SDK já tem `fflate` como dependency direta e um `storage` que só faz `JSON.stringify` cru; o jogo tem `saveCompressed`/`loadCompressed` (`src/utils/save/storage.ts`) rodando em `lz-string`, uma dependência que só existe para isso.

Superfície proposta:

```ts
storage.getCompressed<T>(key: string, fallback: T): T
storage.setCompressed<T>(key: string, value: T): void
useCompressedStorage<T>(key: string, initial: T): readonly [T, (value: T) => void]
```

Detalhes que precisam sobreviver à migração, porque estão no código do jogo por motivo:

- **Leitura retrocompatível.** `loadCompressed` (`src/utils/save/storage.ts:14-18`) detecta payload não comprimido por `raw.startsWith("[") || raw.startsWith("{")` e faz parse direto. Sem isso, todo save existente vira lixo no primeiro deploy. A versão do SDK precisa do mesmo fallback — e, como `fflate` produz bytes (não UTF-16 como o `lz-string`), o encoding tem que ser explícito (base64 sobre `gzipSync`) e detectável.
- **Escrita degradada.** O `catch` grava JSON puro quando a compressão falha. Manter.
- **Quota.** `localStorage.setItem` estoura em quota; o `storage` do SDK já trata isso com o `@tempest-limits empty-catch` documentado.

Depois disso o jogo apaga `src/utils/save/storage.ts` e remove `lz-string` + `@types/lz-string`.

> `useCompressedStorage` do jogo (`src/hooks/useCompressedStorage.ts`) também aplica `slotKey()` e um `normalize`. Isso é específico do jogo — o hook do SDK fica sem slot, e o jogo passa a chave já namespaced.

### 2.2 `useLatestRef` — `src/hooks/`

Não existe no SDK (só `useStableCallback`, que é para funções). Está privado em `src/hooks/battle/useScene.ts:72` e o `TODO.md` do jogo já pede para exportar.

```ts
export function useLatestRef<T>(value: T): { readonly current: T };
```

Cinco linhas, mas é o primitivo que resolve stale closure — o jogo repete o padrão `const xRef = useRef(x); xRef.current = x;` dezenas de vezes (`App.tsx:98-108`, `GameControlsContext.tsx:50-64`, `useConfigSelection.ts:64-82`). Documentar a diferença para `useStableCallback` na doc, senão viram dois jeitos de fazer a mesma coisa.

### 2.3 `.preload()` no `lazyWithRetry` — `src/auth/lazy-with-retry.ts`

O SDK tem retry sem preload; o jogo tem preload sem retry (`src/utils/lazyLoad.ts`). Fundir: `lazyWithRetry` passa a devolver o `LazyExoticComponent` com um `.preload()` anexado, mesma assinatura de hoje mais o método.

Mudança aditiva, sem breaking change. O jogo apaga `utils/lazyLoad.ts` + `utils/preloadPages.ts` (o segundo é um `forEach` de 7 linhas que não justifica módulo) e ganha retry de chunk de graça — relevante num PWA onde um deploy novo invalida chunks de uma sessão aberta.

### 2.4 `useTypewriter` e `useCountdown` — `src/hooks/`

Nenhum dos dois existe no SDK.

```ts
useTypewriter(text: string, speedMs: number): { displayedText: string; isComplete: boolean; skip: () => void }
useCountdown(cooldownMs: number, lastEventTime: number): number
```

`useTypewriter` sai de `src/hooks/useTypewriter.ts` sem uma linha de mudança — é puro React, zero acoplamento com o jogo, e o SDK já tem `AIChat`/`Chat` onde ele encaixa. `useCountdown` é o padrão de cooldown/rate-limit em UI; o SDK tem `useCounter`, `useInterval` e `useTimeout`, mas nada que conte para trás a partir de um timestamp.

Ajuste sugerido no `useCountdown` durante o port: o `setInterval(…, 1000)` fixo vira opção (`tickMs`), porque cooldown de segundos e barra de progresso pedem cadências diferentes.

### 2.5 Pool de SFX — `src/audio/`

O módulo `audio` do SDK tem `createAudioPlayer`, `useAudio`, recorder, level meter e WAV — **nenhum pool**. Tocar um som curto repetidamente (clique de menu, hit, pickup) com `new Audio()` a cada disparo aloca elemento por evento e engasga.

```ts
createSfxPool(options?: { volume?: number; baseUrl?: string }): SfxPool
useSfxPool(options?: UseSfxPoolOptions): { playSfx: (src: string, volume?: number) => void }
```

Port de `src/hooks/useSFXPool.ts`, com duas mudanças obrigatórias para desacoplar:

- Hoje ele lê `sfxVolume` do `AudioContext` do jogo. No SDK, volume entra por opção/parâmetro; o jogo passa o valor do contexto dele.
- Hoje resolve caminho com `import.meta.env.BASE_URL` inline. No SDK isso vira `baseUrl` opcional — `import.meta.env` não pertence à API de uma lib.

### 2.6 Correção: `tempestPwaManifest` ignora `base` em `appShell` e `additionalUrls`

Não é feature nova, é bug encontrado escrevendo a Fase 1.3.

Em `src/vite/tempest-pwa-manifest.ts:79-85`, só os arquivos do bundle passam por `joinBase(base, file)`; `appShell` (default `/index.html`) e `additionalUrls` entram crus. Qualquer app com `base` diferente de `/` — todo deploy em GitHub Pages, que é exatamente o caso deste jogo — gera um precache manifest com URLs 404 para o app shell. O SW instala, tenta cachear `/index.html`, falha, e o fallback de navegação offline não funciona.

Correção: aplicar `joinBase` também em `appShell` e em `additionalUrls`, tratando entradas que já comecem com o `base` como idempotentes (para não quebrar quem já contornou o bug manualmente). Teste novo com `base: "/sub/"`, verificando que `urls` contém `/sub/index.html` uma única vez. Verificar o mesmo em `tempest-pwa-dev-sw.ts`, cujos defaults (`/sw.js`, `/precache-manifest.json`) têm o mesmo problema em dev.

Com isso, a Fase 1.3 fica mais limpa — `appShell` e `additionalUrls` voltam a ser caminhos relativos ao root.

---

## Fase 3 — jogo consome as contribuições

Só depois de 2.1–2.5 saírem numa release (0.44.0). Deletar no jogo:

| Arquivo                                                 | Substituto                                           |
| ------------------------------------------------------- | ---------------------------------------------------- |
| `src/utils/save/storage.ts`                             | `storage.getCompressed/setCompressed`                |
| `src/hooks/useCompressedStorage.ts`                     | `useCompressedStorage` do SDK + `slotKey()` na chave |
| `src/utils/lazyLoad.ts`                                 | `lazyWithRetry`                                      |
| `src/utils/preloadPages.ts`                             | `.preload()` direto                                  |
| `src/hooks/useTypewriter.ts`                            | `useTypewriter`                                      |
| `src/hooks/useCountdown.ts`                             | `useCountdown`                                       |
| `src/hooks/useSFXPool.ts`                               | `useSfxPool`                                         |
| `useLatestRef` privado em `hooks/battle/useScene.ts:72` | `useLatestRef`                                       |
| `src/utils/types/pwa.d.ts`                              | `BeforeInstallPromptEvent` do SDK                    |

Deps removidas do jogo ao fim das Fases 1 + 3: `vite-plugin-pwa`, `workbox-core`, `workbox-precaching`, `workbox-routing`, `workbox-strategies`, `lz-string`, `@types/lz-string` — **7 dependências**.

---

## Fora de escopo (decidido)

- `utils/api.ts`, `AuthContext`, cloud save → `http`/`auth`/`offline` do SDK. Adiado a pedido.
- `components/*` do SDK — UI é pixel-art com CSS Modules próprios.
- `store` (zustand), `router`, `theme`, `i18n`, `forms`, `charts`, `tabular`, `vision`, `br`.
- `import "tempest-react-sdk/styles.css"` continua **comentado** em `src/main.tsx:1` — traz o `reset.css` e os tokens `--tempest-*` do SDK, que colidem com `src/styles/reset.css` e `variables.css`.

## Riscos

| Risco                                                                       | Mitigação                                                                                                    |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 0.43.0 não publicado bloqueia tudo                                          | Fase 0 é pré-requisito explícito; `file:` local como ponte temporária                                        |
| `base` gh-pages quebra o precache                                           | Fase 1.3 repete `BASE` em cada URL; Fase 2.5 conserta na raiz                                                |
| Auto-reload some (mudança de comportamento)                                 | Decisão explícita na Fase 1.6 — recomendado dar o controle ao jogador                                        |
| Saves antigos ilegíveis após trocar lz-string por fflate                    | Fallback de leitura obrigatório na Fase 2.1, com teste sobre payload legado                                  |
| Zero teste automatizado no jogo (`@playwright/test` instalado, nenhum spec) | Checklist manual/Playwright da Fase 1.9 é a única rede — considerar um smoke E2E de boot offline junto do PR |

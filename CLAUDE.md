# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Servidor de desarrollo en localhost:5173
npm run build        # Build de producción a dist/
npm run preview      # Preview del build de producción
npm run apk          # Build completo → APK debug de Android
npm run apk:release  # Build completo → APK firmado para Play Store
npm run assets       # Regenerar íconos y splash screens de Android
```

El comando `apk` hace: `vite build → cap sync android → gradlew.bat assembleDebug`. Requiere Android SDK y Java instalados.

## Arquitectura

App Vue 3 móvil-first (máx 428px) para cronómetro de gimnasio, sin backend — toda la persistencia es localStorage. Capacitor 8 empaqueta la web app como APK Android.

### Flujo de navegación (hash history, requerido por Android WebView)

```
/ (HomeView) ──→ /routine/new         (RoutineEditor, crear)
              ──→ /routine/:id/edit    (RoutineEditor, editar)
              ──→ /routine/:id/play    (ActiveTimer, timer completo)
              ──→ /quick              (QuickTimer, sin guardar)
              ──→ /weight             (WeightLog)
                    └──→ /weight/add  (AddWeight)
```

`/routine/quick/play` usa el `quickRoutine` del store en vez de un ID real.

### Stores Pinia (`src/stores/`)

**routines.js** — CRUD de rutinas + quickRoutine  
Claves localStorage: `gym-routines`, `gym-quick`  
Cada rutina: `{ id, name, workTime, restTime, rounds, color, emoji, group }`

**weight.js** — Historial de peso + unidad (kg/lbs)  
Claves localStorage: `gym-weight-entries`, `gym-weight-unit`

### Composables (`src/composables/`)

**useTimer.js** — Máquina de estados del cronómetro  
Fases: `idle → prepare (3s) → work → rest → done`  
Tick cada 50ms. Beeps de cuenta regresiva en los últimos 3 segundos de cada fase.

**useAudio.js** — Web Audio API (lazy init, se reactiva en interacción del usuario)  
Funciones: `playWorkBeep`, `playRestBeep`, `playPrepareTone`, `playCountdownTick`, `playDone`

### Componentes SVG nativos (sin librerías externas)

- **CircularTimer.vue** — Círculo de progreso SVG, prop `progress` (0–1)
- **WeightChart.vue** — Gráfica de línea SVG, últimas 20 entradas, auto-escala

### Estilos

Dark mode exclusivo (`#0a0a0a` base, `#1c1c1e` cards). Tailwind utility-first. Los colores dinámicos de fases/rutinas se pasan como props y se aplican con `:style` (no como clases Tailwind, para evitar purge).

### Assets de Android

`scripts/gen-assets.mjs` genera con Sharp:
- `assets/icon-only.png` (1024×1024)
- `assets/splash.png` y `assets/splash-dark.png` (2732×2732)

Luego `capacitor-assets generate --android` los procesa para todas las densidades de pantalla.

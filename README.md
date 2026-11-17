# Gym Timer

App móvil de cronómetro para entrenamientos de gimnasio. Permite crear rutinas de intervalos (trabajo/descanso), iniciar un timer rápido sin registrar rutina, agrupar rutinas por día o grupo muscular, y registrar el peso corporal con historial y gráfica de evolución.

Desarrollada como web app con Vue 3 y empaquetada como APK nativo para Android con Capacitor.

---

## Funcionalidades

### Rutinas
- Crear, editar y eliminar rutinas de intervalos
- Configurar tiempo de trabajo, tiempo de descanso y número de rondas
- Asignar ícono, color y grupo a cada rutina
- Agrupar rutinas por día de la semana (Lunes–Domingo) o por tipo de entrenamiento (Pecho, Espalda, Cardio, etc.)
- Los grupos son colapsables en la pantalla principal

### Timer
- Fases: **PREPÁRATE** (3 s) → **TRABAJO** → **DESCANSO** → siguiente ronda → … → **COMPLETADO**
- Círculo de progreso SVG animado con color por fase
- Alertas de audio vía Web Audio API: beep al iniciar cada fase + countdown 3-2-1
- Pausa / reanudación sin perder el tiempo transcurrido
- Indicador de ronda con puntos de progreso (hasta 20 rondas)

### Inicio Rápido
- Timer sin necesidad de guardar una rutina
- Recuerda los últimos valores usados
- Opción para guardar la configuración como rutina después

### Registro de peso
- Registrar mediciones con fecha, valor y nota opcional
- Toggle de unidades kg / lbs
- Chips rápidos Hoy / Ayer / Antes de ayer + date picker para fechas anteriores
- Si ya existe una medición del mismo día, la reemplaza
- Historial con indicador de cambio entre entradas
- Gráfica SVG de tendencia (últimas 20 mediciones)

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework UI | Vue 3 (Composition API) |
| Build tool | Vite 5 |
| Estilos | Tailwind CSS 3 |
| Estado | Pinia (persistido en localStorage) |
| Rutas | Vue Router 4 (hash history) |
| Audio | Web Audio API |
| Android | Capacitor 8 |

---

## Estructura del proyecto

```
gym-timer/
├── android/                    # Proyecto Android generado por Capacitor
│   └── app/build/outputs/apk/ # APK compilado
├── dist/                       # Build de producción (web)
├── src/
│   ├── composables/
│   │   ├── useAudio.js         # Web Audio API: beeps y fanfarria
│   │   └── useTimer.js         # Máquina de estados del timer
│   ├── stores/
│   │   ├── routines.js         # CRUD de rutinas + quick routine
│   │   └── weight.js           # Registro de peso
│   ├── components/
│   │   ├── CircularTimer.vue   # Círculo SVG animado
│   │   ├── TimeInput.vue       # Control ±1 / ±5 segundos
│   │   └── WeightChart.vue     # Gráfica SVG de tendencia
│   ├── views/
│   │   ├── HomeView.vue        # Lista de rutinas agrupadas
│   │   ├── RoutineEditor.vue   # Crear / editar rutina
│   │   ├── ActiveTimer.vue     # Timer en ejecución
│   │   ├── QuickTimer.vue      # Inicio rápido
│   │   ├── WeightLog.vue       # Historial de peso
│   │   └── AddWeight.vue       # Registrar medición
│   ├── router/index.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── capacitor.config.json
├── package.json
├── vite.config.js
└── tailwind.config.cjs
```

---

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador.

---

## Generar el APK para Android

### Prerequisitos

| Herramienta | Versión requerida | Ubicación en este equipo |
|---|---|---|
| Node.js | 18+ | en PATH |
| JDK | **21+** | `C:\Program Files\Microsoft\jdk-21.0.13.21-hotspot` |
| Android SDK | API 34+ | `%LOCALAPPDATA%\Android\Sdk` |

> Capacitor 8 requiere JDK 21. El proyecto usa build-tools 35 y platform android-36.

### Primera vez

```powershell
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
$env:JAVA_HOME    = "C:\Program Files\Microsoft\jdk-21.0.13.21-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH         = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

# 3. Compilar APK debug
npm run apk
```

El APK queda en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Actualizaciones posteriores

```powershell
$env:JAVA_HOME    = "C:\Program Files\Microsoft\jdk-21.0.13.21-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
npm run apk
```

Internamente ejecuta `vite build → cap sync android → gradlew assembleDebug`.

### Instalar en dispositivo

```powershell
# Con cable USB y depuración USB activada en el teléfono
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install android\app\build\outputs\apk\debug\app-debug.apk
```

También puedes copiar el `.apk` al teléfono y abrirlo directamente (requiere activar *Instalar apps desconocidas* en Configuración).

### APK de producción (firmado)

Para publicar en Google Play se necesita un keystore:

```powershell
# Crear keystore (solo una vez)
keytool -genkey -v -keystore gym-timer.keystore -alias gymtimer -keyalg RSA -keysize 2048 -validity 10000

# Compilar release (después de configurar signingConfigs en android/app/build.gradle)
npm run apk:release
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `localhost:5173` |
| `npm run build` | Build de producción en `dist/` |
| `npm run apk` | Build web + sync + APK debug |
| `npm run apk:release` | Build web + sync + APK release |

---

## Rutas de la app

| Ruta | Vista |
|---|---|
| `/` | HomeView — lista de rutinas agrupadas |
| `/quick` | QuickTimer — inicio rápido |
| `/routine/new` | RoutineEditor — nueva rutina |
| `/routine/:id/edit` | RoutineEditor — editar rutina |
| `/routine/:id/play` | ActiveTimer — timer en ejecución |
| `/weight` | WeightLog — historial de peso |
| `/weight/add` | AddWeight — registrar medición |

---

## Package ID Android

`com.gymtimer.app`

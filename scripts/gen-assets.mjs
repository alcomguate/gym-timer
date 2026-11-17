/**
 * Genera los archivos fuente para @capacitor/assets:
 *   assets/icon-only.png   1024×1024  (ícono completo con fondo)
 *   assets/splash.png      2732×2732  (splash centrado sobre fondo oscuro)
 *   assets/splash-dark.png 2732×2732  (ídem para dark mode)
 *
 * Uso: node scripts/gen-assets.mjs
 */

import sharp from 'sharp'
import { mkdirSync, copyFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT   = join(dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS = join(ROOT, 'assets')
mkdirSync(ASSETS, { recursive: true })

// ─────────────────────────────────────────────
// SVG del ícono (1024×1024)
// Cronómetro minimalista: fondo oscuro, anillo de
// progreso rojo, agujas blancas, botón superior.
// ─────────────────────────────────────────────
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg"
  width="1024" height="1024" viewBox="0 0 1024 1024">

  <!-- Fondo -->
  <rect width="1024" height="1024" fill="#111111"/>

  <!-- Botón superior (corona) -->
  <rect x="488" y="150" width="48" height="46" rx="10" fill="#ef4444"/>
  <rect x="454" y="128" width="116" height="52" rx="26" fill="#ef4444"/>

  <!-- Pista (gris oscuro) -->
  <circle cx="512" cy="548" r="316" fill="none"
    stroke="#282828" stroke-width="56"/>

  <!-- Arco de progreso (270°, rojo, sentido horario desde 12) -->
  <!-- Circunferencia ≈ 2π×316 ≈ 1986.0 -->
  <!-- 270° = 1986×0.75 ≈ 1489 -->
  <circle cx="512" cy="548" r="316" fill="none"
    stroke="#ef4444" stroke-width="56"
    stroke-linecap="round"
    stroke-dasharray="1489 497"
    transform="rotate(-90 512 548)"/>

  <!-- Relleno interior oscuro -->
  <circle cx="512" cy="548" r="286" fill="#1a1a1a"/>

  <!-- Manecilla de minutos (apunta a las 12) -->
  <line x1="512" y1="548" x2="512" y2="362"
    stroke="white" stroke-width="30" stroke-linecap="round"/>

  <!-- Manecilla de horas (apunta a las 10) -->
  <!-- dx = -sin(60°)×130 ≈ −113, dy = −cos(60°)×130 = −65 -->
  <line x1="512" y1="548" x2="399" y2="483"
    stroke="white" stroke-width="22" stroke-linecap="round"/>

  <!-- Punto central -->
  <circle cx="512" cy="548" r="22" fill="#ef4444"/>
</svg>`

// ─────────────────────────────────────────────
// Generar icon-only.png
// ─────────────────────────────────────────────
process.stdout.write('Generando icon-only.png (1024×1024)... ')
await sharp(Buffer.from(ICON_SVG))
  .resize(1024, 1024)
  .png()
  .toFile(join(ASSETS, 'icon-only.png'))
console.log('OK')

// ─────────────────────────────────────────────
// Versión del ícono para el splash (sin fondo cuadrado,
// más grande para lucir bien en pantalla completa)
// ─────────────────────────────────────────────
process.stdout.write('Renderizando ícono para splash (700×700)... ')
const iconForSplash = await sharp(Buffer.from(ICON_SVG))
  .resize(700, 700)
  .png()
  .toBuffer()
console.log('OK')

// ─────────────────────────────────────────────
// Generar splash.png (2732×2732)
// Fondo #0a0a0a + ícono centrado + texto vectorial
// ─────────────────────────────────────────────

// Texto "GYM TIMER" como SVG (sin depender de fuentes del sistema)
const TEXT_SVG = `<svg xmlns="http://www.w3.org/2000/svg"
  width="1600" height="260" viewBox="0 0 1600 260">

  <!-- Letras de "GYM TIMER" dibujadas como formas geométricas -->
  <!-- Usamos un texto genérico con font-weight y letter-spacing amplios -->
  <text x="800" y="195"
    font-family="Arial Black, Impact, 'Helvetica Neue', sans-serif"
    font-weight="900"
    font-size="200"
    fill="white"
    text-anchor="middle"
    letter-spacing="24">GYM TIMER</text>
</svg>`

process.stdout.write('Renderizando texto del splash... ')
const textBuffer = await sharp(Buffer.from(TEXT_SVG))
  .resize(1300, 212)
  .png()
  .toBuffer()
console.log('OK')

// Posiciones en canvas 2732×2732
const iconLeft = Math.floor((2732 - 700) / 2)   // 1016
const iconTop  = Math.floor(2732 * 0.33)          // ~902  (tercio superior)
const textLeft = Math.floor((2732 - 1300) / 2)    // 716
const textTop  = iconTop + 700 + 80               // debajo del ícono

process.stdout.write('Generando splash.png (2732×2732)... ')
await sharp({
  create: {
    width: 2732, height: 2732,
    channels: 4,
    background: { r: 10, g: 10, b: 10, alpha: 1 },
  },
})
  .composite([
    // Halo rojo sutil detrás del ícono
    {
      input: await sharp({
        create: { width: 820, height: 820, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
      })
        .composite([{
          input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="820" height="820">
            <circle cx="410" cy="410" r="400" fill="#ef4444" opacity="0.12"/>
          </svg>`),
          top: 0, left: 0,
        }])
        .png()
        .toBuffer(),
      left: Math.floor((2732 - 820) / 2),
      top:  iconTop - 60,
    },
    // Ícono
    { input: iconForSplash, left: iconLeft, top: iconTop },
    // Texto
    { input: textBuffer, left: textLeft, top: textTop },
  ])
  .png()
  .toFile(join(ASSETS, 'splash.png'))
console.log('OK')

process.stdout.write('Copiando splash-dark.png... ')
copyFileSync(join(ASSETS, 'splash.png'), join(ASSETS, 'splash-dark.png'))
console.log('OK')

console.log('\nArchivos generados en assets/:')
console.log('  icon-only.png   1024×1024')
console.log('  splash.png      2732×2732')
console.log('  splash-dark.png 2732×2732')

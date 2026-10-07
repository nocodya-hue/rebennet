// Prepara las imágenes de la web a partir de las originales de ChatGPT (raw/ia; las de pantalla completa, ampliadas ×4
// con Real-ESRGAN en raw/ia/x4). node tools/images.mjs
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('/Users/silvestrejuanmbantutumoobama/Desktop/miproyecto/basile-travel/node_modules/sharp');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IA = join(ROOT, 'raw/ia'), OUT = join(ROOT, 'assets/img');
const src = (n, big) => sharp(join(IA, big ? `x4/${n}.png` : `${n}.png`)).toColourspace('srgb');

// pantalla completa: 2400 y 1600 de ancho (WebP) + JPG para compartir en redes
const wide = [['hero', 3 / 2, .5], ['equipo', 3 / 2, .5], ['carro', 16 / 9, .5], ['bodegon', 16 / 9, .5]];
for (const [n, ratio] of wide) {
  for (const w of [2400, 1600]) {
    await src(n, true).resize(w, Math.round(w / ratio), { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
      .webp({ quality: 80, smartSubsample: true }).toFile(join(OUT, `${n}-${w}.webp`));
  }
}
await src('hero', true).resize(1600, 1067, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, 'hero-1600.jpg'));

// tarjetas de servicio 4:5 (las caras quedan en el tercio superior)
for (const n of ['hogares', 'oficinas', 'locales', 'finobra', 'comunidades']) {
  await src(n, false).resize(900, 1125, { fit: 'cover', position: 'north', kernel: 'lanczos3' })
    .sharpen({ sigma: .6 }).webp({ quality: 82 }).toFile(join(OUT, `${n}-900.webp`));
}

// logos de financiación (Kit Digital) sobre la franja blanca del pie
await sharp(join(ROOT, 'raw/ue-1.png')).png({ palette: true, quality: 90 }).toFile(join(OUT, 'ue-financiado.png'));
await sharp(join(ROOT, 'raw/ue-2.png')).png({ palette: true, quality: 90 }).toFile(join(OUT, 'ue-plan-recuperacion.png'));
console.log('imágenes listas');

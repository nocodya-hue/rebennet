// Genera las tres páginas de Limpiezas Rebennet (Inicio, Servicios, Contacto) con la misma cabecera y pie.
// node tools/build.mjs  → index.html, servicios/index.html, contacto/index.html
// v2 «friendly» (inspirada en una interfaz de app). Textos: los de rebennet.es tal cual (solo se corrigen erratas:
// «Empesas», «detalles..», el teléfono de Contacto y el «limieza» del logo). La v1 está en .anterior/v1-vita-oscura/.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOGO = readFileSync(join(ROOT, 'tools/logo-symbol.svg.txt'), 'utf8');

const TEL = '666 97 04 79';
const TEL_HREF = 'tel:+34666970479';
const DIR1 = 'Carrer d’Albalat, 49';
const DIR2 = '46680 Algemesí, Valencia';
const MAPS_DIR = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent("Carrer d'Albalat, 49, 46680 Algemesí, Valencia");
const LEGAL = [
  ['Política de privacidad', 'https://rebennet.es/politica-de-privacidad'],
  ['Declaración de cookies', 'https://rebennet.es/politica-de-cookies'],
  ['Declaración de accesibilidad', 'https://rebennet.es/declaracion-de-accesibilidad'],
  ['Aviso legal', 'https://rebennet.es/aviso-legal'],
];
const PAGES = [['Inicio', '', 'home'], ['Servicios', 'servicios/', 'grid'], ['Contacto', 'contacto/', 'chat']];

const i = (name, cls = 'i') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const spark = (cls = 'sp') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#spark"/></svg>`;
const logo = (base, small = '') => `<a class="logo" style="--spark:url(#grad-spark)" href="${base}./" aria-label="Limpiezas Rebennet, inicio"><svg aria-hidden="true"><use href="#logo"/></svg>${small}</a>`;

const sprite = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <linearGradient id="grad-spark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7aa8"/><stop offset=".5" stop-color="#ffb347"/><stop offset="1" stop-color="#3fd0c0"/></linearGradient>
    </defs>
    ${LOGO}
    <symbol id="spark" viewBox="0 0 24 24"><path fill="url(#grad-spark)" stroke="none" d="M12 1.5c.9 5.6 4.9 9.6 10.5 10.5-5.6.9-9.6 4.9-10.5 10.5C11.1 16.9 7.1 12.9 1.5 12 7.1 11.1 11.1 7.1 12 1.5z"/></symbol>
    <symbol id="i-home" viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z"/></symbol>
    <symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-11.5 7.2L4 20l1-4.2A8 8 0 1 1 20 12z"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4.5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></symbol>
    <symbol id="i-access" viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="1.6"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3.5 6M12 14.5l3.5 6"/></symbol>
    <symbol id="i-medal" viewBox="0 0 24 24"><circle cx="12" cy="9" r="5"/><path d="M9.2 13.2 8 21l4-2.2 4 2.2-1.2-7.8"/></symbol>
    <symbol id="i-send" viewBox="0 0 24 24"><path d="M4 12 20 4l-6 16-2.5-6.5z"/></symbol>
  </svg>`;

function page({ slug, title, description, body, base }) {
  const here = PAGES.find(([, s]) => s === slug)[0];
  const cur = (name) => (name === here ? ' aria-current="page"' : '');
  const href = (s) => `${base}${s || './'}`;
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#eef1f0">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${base}assets/img/hero-1600.jpg">
  <link rel="icon" href="${base}assets/logo/favicon.svg" type="image/svg+xml">

  <link rel="preload" as="font" type="font/woff2" href="${base}assets/fonts/inter-latin-1.woff2" crossorigin>
  <link rel="stylesheet" href="${base}css/fonts.css">
  <link rel="stylesheet" href="${base}css/rebennet.css">
  <script>document.documentElement.classList.add("js")</script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Limpiezas Rebennet",
    "description": "Empresa de limpieza en Algemesí: hogares, oficinas, locales comerciales, limpieza fin de obra y mantenimiento de comunidades.",
    "url": "https://rebennet.es/",
    "telephone": "+34666970479",
    "address": { "@type": "PostalAddress", "streetAddress": "Carrer d'Albalat, 49", "postalCode": "46680", "addressLocality": "Algemesí", "addressRegion": "Valencia", "addressCountry": "ES" },
    "areaServed": "Algemesí y alrededores"
  }
  </script>
</head>
<body>
  <a class="skip" href="#main">Saltar al contenido</a>
${sprite}

  <header class="header" data-header>
    ${logo(base)}
    <nav class="header__nav" aria-label="Principal">
      ${PAGES.map(([n, s]) => `<a href="${href(s)}"${cur(n)}>${n}</a>`).join('\n      ')}
    </nav>
    <a class="btn btn--grad header__cta" href="${TEL_HREF}">${i('phone')}${TEL}</a>
    <a class="header__call" href="${TEL_HREF}" aria-label="Llamar al ${TEL}">${i('phone')}</a>
  </header>

  <nav class="tabbar" aria-label="Navegación">
    ${PAGES.map(([n, s, ic]) => `<a href="${href(s)}"${cur(n)}>${i(ic)}${n}</a>`).join('\n    ')}
    <a href="${TEL_HREF}">${i('phone')}Llamar</a>
  </nav>

  <main id="main">
${body}
  </main>

  <footer class="footer">
    ${logo(base, '<small>Servicios de limpieza</small>')}
    <nav class="footer__big" aria-label="Enlaces rápidos">
      ${PAGES.map(([n, s]) => `<a href="${href(s)}"${cur(n)}>${n}</a>`).join('\n      ')}
    </nav>
    <div class="footer__data">
      <div><a href="${TEL_HREF}">${TEL}</a><p class="muted">${DIR1}<br>${DIR2}</p></div>
      <div class="footer__legal-links small"><p>Información legal</p>
        ${LEGAL.map(([t, u]) => `<a href="${u}">${t}</a>`).join('\n        ')}
      </div>
    </div>
    <div class="footer__eu">
      <img src="${base}assets/img/ue-financiado.png" width="1024" height="301" alt="Financiado por la Unión Europea · NextGenerationEU" loading="lazy">
      <img src="${base}assets/img/ue-plan-recuperacion.png" width="1024" height="301" alt="Plan de Recuperación, Transformación y Resiliencia" loading="lazy">
    </div>
    <p class="footer__legal">© <span data-year>2026</span> Limpiezas Rebennet · Algemesí</p>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js" defer></script>
  <script src="${base}js/main.js" defer></script>
</body>
</html>
`;
}

const form = (id) => `
          <form class="form" data-form novalidate>
            <div class="form__row">
              <div class="field"><label for="${id}-nombre">Nombre</label><input id="${id}-nombre" name="nombre" autocomplete="name" required></div>
              <div class="field"><label for="${id}-tel">Teléfono</label><input id="${id}-tel" name="telefono" type="tel" autocomplete="tel" required></div>
            </div>
            <div class="field"><label for="${id}-mail">Dirección de correo electrónico</label><input id="${id}-mail" name="email" type="email" autocomplete="email" required></div>
            <fieldset class="field chips">
              <legend>Servicio</legend>
              <label><input type="radio" name="servicio" value="Limpieza de hogares" checked><span>Hogares</span></label>
              <label><input type="radio" name="servicio" value="Limpieza de oficinas y empresas"><span>Oficinas y empresas</span></label>
              <label><input type="radio" name="servicio" value="Limpieza de locales"><span>Locales</span></label>
              <label><input type="radio" name="servicio" value="Limpieza fin de obra"><span>Fin de obra</span></label>
              <label><input type="radio" name="servicio" value="Mantenimiento de comunidades"><span>Comunidades</span></label>
            </fieldset>
            <div class="field"><label for="${id}-msg">Mensaje</label><textarea id="${id}-msg" name="mensaje" rows="4" required></textarea></div>
            <div class="hp" aria-hidden="true"><label>No rellenar<input name="web" tabindex="-1" autocomplete="off"></label></div>
            <label class="check"><input type="checkbox" name="privacidad" required><span>Acepto las <a href="${LEGAL[0][1]}">políticas de privacidad</a></span></label>
            <button class="btn btn--grad" type="submit">${i('send')}Enviar</button>
            <p class="form__msg" role="status" data-form-msg></p>
          </form>`;

// ficha de perfil de cristal (hero): kicker, título, iconos redondos, texto, cifras y botones
const profile = ({ kicker, title, h1 = true, text, stats, ctas }) => `
          <div class="glass profile" data-rise>
            <div class="profile__top">
              <${h1 ? 'h1' : 'div'}><span class="profile__kicker">${kicker}</span><span class="display">${title}</span></${h1 ? 'h1' : 'div'}>
              <div class="profile__icons"><span class="round round--spark">${spark()}</span><a class="round round--white" href="${TEL_HREF}" aria-label="Llamar al ${TEL}">${i('phone')}</a></div>
            </div>
            ${text}
            ${stats || ''}
            ${ctas}
          </div>`;

// ───────────────────────── INICIO ─────────────────────────
const HOME_SVC = [
  ['Limpieza de hogares', 'hogares', 'Hogares', 'pill--orange', 'Trabajadora de Rebennet limpiando el espejo y la mampara de un baño', 'Servicios de limpieza para mantener tu vivienda limpia, cuidada y en buenas condiciones.'],
  ['Limpieza de oficinas y locales', 'oficinas', 'Oficinas y locales', 'pill--sky', 'Trabajadora de Rebennet limpiando una mesa de oficina', 'Limpieza profesional para oficinas, despachos y locales comerciales, adaptada a las necesidades de cada negocio.'],
  ['Limpieza fin de obra', 'finobra', 'Fin de obra', 'pill--orange', 'Trabajador de Rebennet aspirando el polvo de obra de un piso reformado', 'Limpieza especializada después de obras y reformas para eliminar polvo, suciedad y restos generados durante los trabajos.'],
  ['Mantenimiento de comunidades', 'comunidades', 'Comunidades', 'pill--sky', 'Trabajadora de Rebennet fregando la escalera del portal de una comunidad', 'Limpieza y mantenimiento de portales, escaleras, rellanos y otras zonas comunes de comunidades de vecinos.'],
];
const REVIEWS = [
  ['Loles Satorres C.', 'hace 7 meses', 'Los trabajadores son una maravilla, muy simpáticos y atentos. Era un final de obra y m han dejado la casa reluciente. Grandes profesionales. Sin duda los recomiendo.', '#2fc4b2'],
  ['Jose Mejias C.', 'hace 9 meses', 'Personas encantadoras, atentas, seriedad, implicación en el trabajo.', '#fb8e28'],
  ['Teresa Borrás C.', 'hace 11 meses', 'Muy bien la verdad. Sin duda las volveré a llamar.', '#f2708a'],
  ['Jaime M.', 'hace 3 años', 'Los encontré por casualidad buscando en google y ha sido todo un acierto. Los trabajadores son muy simpáticos y trabajan genial. Por no hablar del trato con Toni e Idoia, son geniales, muy currantes, resolutivos y se les nota que les gusta su trabajo. 100% recomendables! Yo ya lo he hecho en 2 lugares más. 😊👍', '#4aa8ff'],
  ['Arantxa M.', 'hace 7 años', 'Me los recomendó mi prima y la verdad que estoy muy contenta con ellos. Da gusto llegar a casa después del trabajo y encontrarte la casa limpia y que huela así de bien. !Hasta los he propuesto para la comunidad de mi edificio!', '#005751'],
];
const face = (name, color) => `<span class="face"><span style="background:${color}">${name[0]}</span></span>`;

const inicio = (b) => `
    <section class="stage" id="top">
      <div class="stage__media"><img src="${b}assets/img/hero-2400.webp" srcset="${b}assets/img/hero-1600.webp 1600w, ${b}assets/img/hero-2400.webp 2400w" sizes="100vw" width="2400" height="1600" alt="Trabajadora de Rebennet limpiando la encimera de mármol de una cocina luminosa" fetchpriority="high" data-hero-img></div>
      <span class="pill pill--glass stage__chip" data-rise><span class="stars">★</span> 4,7 en Google</span>
      <div class="stage__inner">
${profile({
  kicker: 'Empresa de limpieza en Algemesí',
  title: 'Rebennet',
  text: '<p class="lead profile__text">Servicios de limpieza profesionales para hogares, oficinas, locales comerciales y comunidades.</p>',
  stats: '<ul class="stats"><li><b>+7</b><span>años de experiencia</span></li><li><b>4,7</b><span>en Google</span></li><li><b>5</b><span>servicios</span></li></ul>',
  ctas: `<div class="profile__ctas"><a class="btn btn--grad" href="#contacto">Solicita tu presupuesto</a><a class="btn btn--glass" href="${TEL_HREF}">${i('phone')}${TEL}</a></div>`,
})}
      </div>
    </section>

    <section class="section" id="servicios">
      <div class="section__head">
        <div class="prose">
          <span class="pill pill--teal" style="justify-self:start">${spark('i')} Servicios</span>
          <h2 class="h2" data-up>Servicios de limpieza <span class="soft">en Algemesí</span></h2>
        </div>
        <div class="prose muted" data-up>
          <p>En Limpiezas Rebennet ofrecemos diferentes soluciones de limpieza para hogares, empresas y comunidades.</p>
          <p>Nos adaptamos a cada cliente para ofrecer un servicio adecuado a las características y necesidades de cada espacio.</p>
        </div>
      </div>
      <ul class="shots">
        ${HOME_SVC.map(([t, img, short, pill, alt, txt], k) => `<li class="shot" data-up>
          <a class="shot__card" href="${b}servicios/#${img}">
            <img src="${b}assets/img/${img}-900.webp" width="900" height="1125" alt="${alt}" loading="lazy">
            <span class="glass shot__chip"><span class="avatar">${spark()}</span><span><b>Rebennet</b><small>Servicio 0${k + 1}</small></span><span class="pill pill--yellow">Ver</span></span>
            <h3 class="shot__title">${t}</h3>
            <span class="shot__meta"><span class="pill ${pill}">${short}</span>${i('arrow')}</span>
          </a>
          <p class="small muted">${txt}</p>
        </li>`).join('\n        ')}
      </ul>
      <div class="section__foot"><a class="btn btn--dark" href="${b}servicios/">Explora nuestros servicios ${i('arrow')}</a></div>
    </section>

    <section class="section" id="empresa">
      <div class="about">
        <div class="about__photo" data-up>
          <img src="${b}assets/img/equipo-1600.webp" width="1600" height="1067" alt="Dos trabajadores de Rebennet llegan a una casa con el material de limpieza" loading="lazy">
          <div class="glass">
            <p class="small muted">Estamos ubicados en:</p>
            <p class="lead">${DIR1}, ${DIR2}</p>
            <a class="big" href="${TEL_HREF}">+34 ${TEL}</a>
            <a class="btn btn--grad btn--block" href="#contacto">Solicita tu presupuesto</a>
          </div>
        </div>
        <div class="card about__copy" data-up>
          <span class="pill pill--teal" style="justify-self:start">${spark('i')} Empresa</span>
          <h2 class="h2">Trabajamos para que cada espacio esté limpio, cuidado <span class="soft">y preparado para el día a día.</span></h2>
          <p class="lead">En Limpiezas Rebennet somos una empresa de limpieza en Algemesí con más de siete años de experiencia ofreciendo servicios de limpieza profesionales para hogares, oficinas, locales comerciales y comunidades.</p>
          <div class="prose muted">
            <p>Nos adaptamos a las necesidades de cada cliente y ofrecemos un trato cercano, profesional y personalizado.</p>
            <p>Si buscas una empresa de limpieza en Algemesí de confianza, estamos a tu disposición para estudiar tus necesidades y ofrecerte una solución adaptada.</p>
          </div>
          <p class="tagline">${spark('i')}Solicita tu presupuesto sin compromiso.</p>
        </div>
      </div>
    </section>

    <section class="quote" aria-label="Nuestra filosofía">
      ${spark('quote__spark')}
      <blockquote class="quote__text" data-up>La limpieza es el lienzo; <span class="grad-text">la inclusión es el color</span> con el que pintamos nuestra comunidad.</blockquote>
      <p class="quote__by muted"><span class="avatar" style="width:34px;height:34px">${spark()}</span>—Equipo Rebennet</p>
    </section>

    <section class="screen" id="metodologia">
      <div class="screen__media"><img src="${b}assets/img/carro-2400.webp" width="2400" height="1350" alt="" loading="lazy" data-parallax></div>
      <div class="screen__head">
        <span class="pill pill--glass">${spark('i')} Metodología</span>
        <h2 class="h2" data-up>Nuestra <span class="soft">metodología</span></h2>
      </div>
      <ol class="steps">
        <li class="glass step" data-up>
          <span class="step__num">01</span>
          <h3 class="h3">¿Por qué elegir Rebennet?</h3>
          <div class="prose">
            <p>Con más de siete años de experiencia, hemos desarrollado una forma de trabajar basada en la profesionalidad, la atención al detalle y la adaptación a las necesidades de cada cliente.</p>
            <p>Estudiamos las características de cada espacio para determinar las tareas necesarias y realizar el servicio de forma eficiente.</p>
            <p>Nuestro objetivo es ofrecer una limpieza de calidad y conseguir que cada cliente quede satisfecho con el resultado.</p>
          </div>
        </li>
        <li class="glass step" data-up>
          <span class="step__num">02</span>
          <h3 class="h3">Un servicio adaptado a cada espacio</h3>
          <div class="prose">
            <p>Cada vivienda, oficina, local o comunidad tiene unas necesidades diferentes.</p>
            <p>Por eso, adaptamos nuestro trabajo a las características del espacio, teniendo en cuenta su tamaño, uso y necesidades específicas.</p>
            <p>Utilizamos técnicas y productos adecuados para cada tipo de superficie y trabajamos de forma organizada para conseguir un resultado cuidado y profesional.</p>
          </div>
        </li>
        <li class="glass step" data-up>
          <span class="step__num">03</span>
          <h3 class="h3">Experiencia y profesionalidad</h3>
          <div class="prose">
            <p>Nuestra experiencia de más de siete años nos permite afrontar diferentes tipos de servicios de limpieza con conocimiento y responsabilidad.</p>
            <p>Trabajamos con seriedad, discreción y atención al detalle para que nuestros clientes puedan confiar en nuestro trabajo.</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="section" aria-label="Accesibilidad y experiencia">
      <div class="facts">
        <div class="card fact" data-up>
          <span class="fact__icon">${i('access')}</span>
          <div><span class="pill pill--aqua">Accesibilidad</span><p class="lead">Contamos con acceso a nuestras instalaciones mediante una rampa adaptada para todas las necesidades.</p></div>
        </div>
        <div class="card fact" data-up>
          <span class="fact__icon">${i('medal')}</span>
          <div><span class="pill pill--yellow">Experiencia</span><p class="lead">Nuestra experiencia de más de siete años nos permite ofrecer nuestro servicio con la mayor satisfacción para ti.</p></div>
        </div>
      </div>
    </section>

    <section class="section" id="opiniones">
      <div class="section__head">
        <div class="prose">
          <span class="pill pill--pink" style="justify-self:start">${spark('i')} Opiniones</span>
          <h2 class="h2" data-up>Nuestros clientes <span class="soft">nos avalan</span></h2>
        </div>
        <p class="rating"><span class="g">G</span><b>4,7</b><span><span class="stars" aria-hidden="true">★★★★★</span><br><span class="small muted">Con 4,7 en Google</span></span></p>
      </div>
      <ul class="people" aria-hidden="true">
        ${REVIEWS.map(([n, , , c]) => `<li>${face(n, c)}${n.split(' ')[0]}</li>`).join('\n        ')}
      </ul>
      <ul class="reviews">
        ${REVIEWS.map(([n, t, q, c]) => `<li class="card review" data-up>
          <div class="review__who">${face(n, c)}<span><b>${n}</b><span class="small muted">Google</span></span><span class="pill pill--sky">${t}</span></div>
          <blockquote>${q}</blockquote>
        </li>`).join('\n        ')}
      </ul>
    </section>

    <section class="section" id="contacto">
      <div class="contact">
        <div class="card contact__side" data-up>
          <span class="pill pill--orange" style="justify-self:start">${spark('i')} Contacto</span>
          <h2 class="h2">Contáctanos</h2>
          <p class="lead muted">¿Necesitas un presupuesto o tienes dudas? ¡Nos pondremos en contacto contigo lo antes posible!</p>
          <a class="big" href="${TEL_HREF}">${TEL}</a>
          <p class="small muted">${DIR1}<br>${DIR2}</p>
        </div>
        <div class="card contact__form" data-up>
${form('f')}
        </div>
      </div>
    </section>
`;

// ───────────────────────── SERVICIOS ─────────────────────────
const SERVICIOS = [
  ['Limpieza de hogares', 'hogares', 'Trabajadora de Rebennet limpiando el espejo y la mampara de un baño',
    'Tu hogar es un espacio importante y mantenerlo limpio requiere tiempo y dedicación. En Rebennet ofrecemos servicios de limpieza adaptados a las características de cada vivienda y a las necesidades de cada cliente. Realizamos tanto limpiezas puntuales como servicios de mantenimiento, prestando atención a cada estancia y a los pequeños detalles.',
    ['Ventanas', 'Espejos', 'Toldos', 'Mamparas', 'Encimeras']],
  ['Limpieza de oficinas y empresas', 'oficinas', 'Trabajadora de Rebennet limpiando una mesa de oficina',
    'Un entorno de trabajo limpio contribuye a crear un espacio más agradable y profesional para trabajadores y clientes. Ofrecemos servicios de limpieza para oficinas, despachos y empresas, adaptándonos a los horarios y necesidades de cada negocio para evitar interferir en su actividad. Trabajamos de forma organizada y discreta, cuidando las diferentes zonas del espacio y prestando atención a los detalles.',
    ['Oficinas', 'Despachos', 'Zonas comunes', 'Mobiliario', 'Suelos']],
  ['Limpieza de locales', 'locales', 'Trabajadora de Rebennet limpiando el escaparate de una tienda',
    'La limpieza de un local comercial es fundamental para ofrecer una buena imagen a clientes y visitantes. En Rebennet nos encargamos de la limpieza de diferentes tipos de establecimientos, adaptando el servicio a las características y necesidades de cada negocio. Cuidamos las diferentes zonas del local para conseguir un espacio limpio, ordenado y agradable.',
    ['Escaparates', 'Expositores', 'Probadores', 'Mostradores', 'Aseos']],
  ['Limpieza fin de obra', 'finobra', 'Trabajador de Rebennet aspirando el polvo de obra de un piso reformado',
    'Después de una obra o reforma, el espacio puede quedar lleno de polvo, suciedad y restos generados durante los trabajos. En Rebennet ofrecemos servicios de limpieza fin de obra para viviendas, locales y otros espacios que necesitan una puesta a punto antes de volver a utilizarse. Realizamos una limpieza detallada de las diferentes superficies y zonas del espacio para eliminar la suciedad acumulada y dejarlo limpio y preparado.',
    ['Polvo de obra', 'Cristales', 'Suelos', 'Superficies', 'Restos de obra']],
  ['Mantenimiento de comunidades', 'comunidades', 'Trabajadora de Rebennet fregando la escalera del portal de una comunidad',
    'Mantener limpias las zonas comunes es fundamental para conservar una comunidad cuidada y agradable para todos los vecinos. En Rebennet ofrecemos servicios de limpieza y mantenimiento de comunidades, adaptando el servicio a las características de cada edificio y a sus necesidades. Nos encargamos de mantener limpias y cuidadas las diferentes zonas comunes, estableciendo una frecuencia de trabajo adecuada para cada comunidad.',
    ['Portales', 'Escaleras', 'Rellanos', 'Pasillos', 'Ascensores']],
];

const servicios = (b) => `
    <section class="stage stage--page">
      <div class="stage__media"><img src="${b}assets/img/bodegon-2400.webp" srcset="${b}assets/img/bodegon-1600.webp 1600w, ${b}assets/img/bodegon-2400.webp 2400w" sizes="100vw" width="2400" height="1350" alt="Bayetas naranjas, pulverizadores y cepillo de limpieza sobre una encimera de piedra" fetchpriority="high" data-hero-img></div>
      <span class="pill pill--glass stage__chip stage__chip--desk" data-rise>${i('pin')} Algemesí y alrededores</span>
      <div class="stage__inner">
${profile({
  kicker: 'Servicios de limpieza',
  title: 'Servicios',
  text: `<p class="lead profile__text" style="color:#fff">En Rebennet ofrecemos servicios de limpieza profesionales para hogares, empresas, locales comerciales y comunidades.</p>
            <div class="prose small profile__text"><p>Somos una empresa de limpieza ubicada en Algemesí y trabajamos para clientes de la localidad y de otras zonas cercanas, adaptándonos a las necesidades de cada espacio.</p><p>Nuestro objetivo es ofrecer un servicio cercano, profesional y personalizado, tanto para limpiezas puntuales como para servicios de mantenimiento.</p></div>`,
  ctas: `<div class="profile__ctas"><a class="btn btn--grad" href="${b}contacto/">Solicita tu presupuesto</a><a class="btn btn--glass" href="${TEL_HREF}">${i('phone')}${TEL}</a></div>`,
})}
      </div>
    </section>

    <section class="section svc-list" aria-label="Servicios">
      ${SERVICIOS.map(([t, img, alt, txt, tags], k) => `<article class="card svc" id="${img}" data-up>
        <figure class="svc__img"><img src="${b}assets/img/${img}-900.webp" width="900" height="1125" alt="${alt}" loading="lazy"></figure>
        <div class="svc__body">
          <span class="svc__num">0${k + 1}</span>
          <h2 class="h2">${t}</h2>
          <p class="muted" style="max-width:34em">${txt}</p>
          <ul class="tags" aria-label="Incluye">${tags.map((x) => `<li class="pill">${x}</li>`).join('')}</ul>
          <a class="btn btn--dark" href="${b}contacto/">Solicita tu presupuesto ${i('arrow')}</a>
        </div>
      </article>`).join('\n      ')}
    </section>

    <section class="section" id="zona">
      <div class="area">
        <div class="card area__copy" data-up>
          <span class="pill pill--aqua" style="justify-self:start">${i('pin')} Dónde trabajamos</span>
          <h2 class="h2">Limpieza profesional <span class="soft">en Algemesí y alrededores</span></h2>
          <div class="prose muted">
            <p>Estamos ubicados en Algemesí, Valencia, y ofrecemos nuestros servicios de limpieza tanto en la localidad como en municipios y zonas cercanas.</p>
            <p>Si necesitas una limpieza de hogar, oficina, local, comunidad o una limpieza fin de obra, puedes ponerte en contacto con nosotros para consultar la disponibilidad del servicio en tu zona.</p>
            <p>Estudiaremos tus necesidades y te ofreceremos una solución adaptada.</p>
          </div>
        </div>
        <div class="card area__data" data-up>
          <p class="muted">${DIR1}<br>${DIR2}</p>
          <a class="big" href="${TEL_HREF}">${TEL}</a>
          <a class="btn btn--grad" href="${b}contacto/">Contacta con nosotros</a>
          <a class="btn btn--glass" href="${MAPS_DIR}" target="_blank" rel="noopener">Cómo llegar ${i('arrow')}</a>
        </div>
      </div>
    </section>
`;

// ───────────────────────── CONTACTO ─────────────────────────
const contacto = (b) => `
    <section class="stage stage--page">
      <div class="stage__media"><img src="${b}assets/img/equipo-2400.webp" srcset="${b}assets/img/equipo-1600.webp 1600w, ${b}assets/img/equipo-2400.webp 2400w" sizes="100vw" width="2400" height="1600" alt="Dos trabajadores de Rebennet llegan a una casa con el material de limpieza" fetchpriority="high" data-hero-img></div>
      <span class="pill pill--glass stage__chip" data-rise><span class="dot"></span> ¡Te esperamos!</span>
      <div class="stage__inner">
${profile({
  kicker: 'Contacta con Rebennet',
  title: 'Contacto',
  text: '<p class="lead profile__text" style="color:#fff">¿Necesitas un servicio de limpieza o quieres solicitar un presupuesto?</p>',
  ctas: `<div class="profile__ctas"><a class="btn btn--grad" href="#formulario">Escríbenos</a><a class="btn btn--glass" href="${TEL_HREF}">${i('phone')}${TEL}</a></div>`,
})}
      </div>
    </section>

    <section class="section" id="formulario">
      <div class="contact">
        <div class="card contact__side" data-up>
          <p class="lead">Ponte en contacto con Limpiezas Rebennet y cuéntanos qué necesitas. Estaremos encantados de atenderte y ofrecerte información sobre nuestros servicios.</p>
          <p class="muted">Puedes siempre optar también por venir en persona – estamos en: <b style="color:var(--ink)">${DIR1}, Algemesí</b> o bien llamándonos por teléfono al</p>
          <a class="big" href="${TEL_HREF}">${TEL}</a>
          <p class="h3"><span class="grad-text">¡Te esperamos!</span></p>
          <div class="prose">
            <p class="small muted">Nuestros servicios</p>
            <div class="links">
              ${SERVICIOS.map(([t, id]) => `<a href="${b}servicios/#${id}">${t === 'Limpieza de locales' ? 'Limpieza de locales comerciales' : t}</a>`).join('\n              ')}
            </div>
            <a class="btn btn--dark" href="${b}servicios/" style="justify-self:start;margin-top:6px">Ver servicios ${i('arrow')}</a>
          </div>
        </div>
        <div class="card contact__form" data-up>
${form('c')}
        </div>
      </div>
    </section>

    <section class="section" id="donde">
      <div class="visit">
        <div class="card visit__info" data-up>
          <span class="pill pill--aqua">${i('pin')} Dónde estamos</span>
          <h2 class="h2">Estamos en <span class="soft">Algemesí</span></h2>
          <div class="prose muted">
            <p>Estamos ubicados en Algemesí, Valencia, y ofrecemos nuestros servicios de limpieza en la localidad y zonas cercanas.</p>
            <p>Si quieres consultar la disponibilidad para tu zona, ponte en contacto con nosotros y te informaremos.</p>
          </div>
          <p>${DIR1}<br><span class="muted">${DIR2}</span></p>
          <a class="btn btn--grad" href="${MAPS_DIR}" target="_blank" rel="noopener">Cómo llegar ${i('arrow')}</a>
        </div>
        <div class="map" data-map data-up>
          <img src="${b}assets/img/hero-1600.webp" alt="" aria-hidden="true" class="map__bg" loading="lazy">
          <div class="map__cta">
            <span class="pill pill--glass">${i('pin')} ${DIR1} · Algemesí</span>
            <button class="btn btn--white" type="button" data-map-load>Ver mapa</button>
            <small>Al cargar el mapa se conecta con Google Maps.</small>
          </div>
        </div>
      </div>
    </section>
`;

const out = [
  ['', 'index.html', 'Empresa de limpieza en Algemesí | Limpiezas Rebennet', 'Empresa de limpieza en Algemesí con más de siete años de experiencia: hogares, oficinas, locales comerciales, fin de obra y comunidades. Pide presupuesto: 666 97 04 79.', inicio],
  ['servicios/', 'servicios/index.html', 'Servicios de limpieza en Algemesí | Limpiezas Rebennet', 'Limpieza de hogares, oficinas y empresas, locales comerciales, limpieza fin de obra y mantenimiento de comunidades en Algemesí y alrededores.', servicios],
  ['contacto/', 'contacto/index.html', 'Contacto | Limpiezas Rebennet', 'Contacta con Limpiezas Rebennet: Carrer d’Albalat, 49, Algemesí · 666 97 04 79. Presupuesto sin compromiso.', contacto],
];
for (const [slug, file, title, description, body] of out) {
  const base = slug ? '../' : '';
  const dest = join(ROOT, file);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, page({ slug, title, description, body: body(base), base }));
  console.log('·', file);
}

// LIMPIEZAS REBENNET · v2: scroll suave, entradas, cabecera flotante, formulario y mapa bajo demanda (las tres páginas).
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);

// Destino del formulario: vacío = vista previa (no envía nada).
const FORM_ENDPOINT = '';
const TEL = '666 97 04 79';

// Si GSAP no carga, se muestra todo sin animación.
if (!hasGsap) document.documentElement.classList.remove('js');

$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

let lenis = null;

// Anclas de la misma página (con o sin Lenis)
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  const el = id.length > 1 && $(id);
  if (!el) return;
  e.preventDefault();
  lenis ? lenis.scrollTo(el, { offset: -90, duration: 1.3 }) : el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}));

// Cabecera flotante: se esconde al bajar y vuelve al subir
const header = $('[data-header]');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  header.classList.toggle('is-hidden', y > lastY && y > innerHeight * 0.6);
  lastY = y;
}, { passive: true });

// ---------------- Formulario ----------------
$$('[data-form]').forEach((form) => {
  const msg = $('[data-form-msg]', form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    $$('input[required], textarea[required]', form).forEach((el) => {
      const bad = el.type === 'checkbox' ? !el.checked
        : el.type === 'email' ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())
        : !el.value.trim();
      if (el.type === 'checkbox') el.closest('.check').classList.toggle('is-invalid', bad);
      else el.setAttribute('aria-invalid', String(bad));
      if (bad) ok = false;
    });
    if (!ok) { msg.textContent = 'Revisa los campos marcados, por favor.'; return; }

    const data = Object.fromEntries(new FormData(form));
    if (data.web) return;                       // trampa para bots
    if (FORM_ENDPOINT) {
      try {
        const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
      } catch {
        msg.textContent = `No se ha podido enviar. Llámanos al ${TEL}.`;
        return;
      }
    }
    form.reset();
    msg.textContent = `Gracias, ${data.nombre.trim().split(' ')[0]}. Nos pondremos en contacto contigo lo antes posible.`;
  });
  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.setAttribute('aria-invalid', 'false');
    if (e.target.type === 'checkbox') e.target.closest('.check').classList.remove('is-invalid');
  });
});

// ---------------- Mapa (se carga al pulsar, sin cookies de Google antes) ----------------
$('[data-map-load]')?.addEventListener('click', () => {
  const f = document.createElement('iframe');
  f.title = 'Mapa: Limpiezas Rebennet, Carrer d’Albalat 49, Algemesí';
  f.loading = 'lazy';
  f.referrerPolicy = 'no-referrer-when-downgrade';
  f.src = 'https://maps.google.com/maps?q=' + encodeURIComponent("Carrer d'Albalat 49, 46680 Algemesí") + '&z=17&hl=es&output=embed';
  const map = $('[data-map]');
  map.classList.add('is-loaded');
  map.replaceChildren(f);
});

// ================= Movimiento =================
if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);

  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1.1, touchMultiplier: 1.6 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (reduced) {
    gsap.set('[data-rise], [data-up]', { opacity: 1, y: 0 });
  } else {
    // Hero: la foto se asienta y la ficha de cristal sube
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo('[data-hero-img]', { scale: 1.12 }, { scale: 1, duration: 2.4 }, 0)
      .to('[data-rise]', { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 0.25);
    const stage = $('.stage');
    gsap.to('.stage__media', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom top', scrub: true } });

    // Bloques que entran al aparecer (en grupo, con un pequeño escalonado)
    ScrollTrigger.batch('[data-up]', {
      start: 'top 88%',
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
    });

    // Metodología: la foto se desplaza un poco más despacio
    if ($('[data-parallax]')) {
      gsap.fromTo('[data-parallax]', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.screen', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // Avatares de las opiniones: aparecen uno tras otro
    if ($('.people')) gsap.from('.people li', { scale: .6, opacity: 0, duration: .8, ease: 'back.out(1.8)', stagger: .07, scrollTrigger: { trigger: '.people', start: 'top 90%' } });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
}

// ============================================================
// nosotros.js - Autor: Rodrigo Alonso Santos Nunez
// ============================================================

const ESTADISTICAS = [
  { selector: '[data-stat="pasajeros"]',   fin: 1.2,    sufijo: 'M de pasajeros',          decimales: 1, duracion: 1800 },
  { selector: '[data-stat="horas"]',       fin: 17875,  sufijo: ' horas de vuelo',          decimales: 0, duracion: 2000 },
  { selector: '[data-stat="load"]',        fin: 81.4,   sufijo: '% load factor',            decimales: 1, duracion: 1600 },
  { selector: '[data-stat="vuelos"]',      fin: 150,    sufijo: ' vuelos semanales',        decimales: 0, duracion: 1400 },
  { selector: '[data-stat="ingresos"]',    fin: 104.3,  prefijo: 'US$', sufijo: 'M ingresos', decimales: 1, duracion: 2000 },
  { selector: '[data-stat="anos"]',        fin: 3,      sufijo: ' anos para rentabilidad', decimales: 0, duracion: 1200 },
];

//  Autor: Rodrigo Alonso Santos Nunez - PREPARAR EL DOM: inyectar elementos <span data-stat> en las cifras

function prepararElementosDOM() {
  const seccion = document.getElementById('cifras');
  if (!seccion) return;

  const items = seccion.querySelectorAll('li');

  // Mapeamos cada <li> con su estadistica segun el orden del array
  const mapaPatrones = [
    { patron: /pasajero/i,     stat: 'pasajeros' },
    { patron: /horas/i,        stat: 'horas'     },
    { patron: /load/i,         stat: 'load'      },
    { patron: /vuelos/i,       stat: 'vuelos'    },
    { patron: /ingreso|US\$/i, stat: 'ingresos'  },
    { patron: /rentabil|a.os/i,stat: 'anos'      },
  ];

  items.forEach(li => {
    const texto = li.textContent;
    const coincidencia = mapaPatrones.find(({ patron }) => patron.test(texto));
    if (!coincidencia) return;

    const strong = li.querySelector('strong');
    if (!strong || strong.dataset.stat) return; 

    strong.dataset.stat  = coincidencia.stat;
    strong.textContent   = '0'; 
    strong.setAttribute('aria-label', texto.trim()); 
  });
}

//  Autor: Rodrigo Alonso Santos Nunez - ANIMACION: easing y contador

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * @param {HTMLElement} el     - elemento cuyo textContent se actualiza
 * @param {Object}      config - entrada de ESTADISTICAS
 */

function animarContador(el, config) {
  const { fin, sufijo = '', prefijo = '', decimales = 0, duracion = 1500 } = config;
  const inicio = performance.now();

  function tick(ahora) {
    const transcurrido = ahora - inicio;
    const progreso     = Math.min(transcurrido / duracion, 1);
    const valorActual  = easeOutCubic(progreso) * fin;

    el.textContent = `${prefijo}${valorActual.toFixed(decimales)}${sufijo}`;

    if (progreso < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = `${prefijo}${fin.toFixed(decimales)}${sufijo}`;
    }
  }

  requestAnimationFrame(tick);
}

//  Autor: Rodrigo Alonso Santos Nunez - INTERSECTION OBSERVER: disparar animacion al hacer scroll

function iniciarObserverContadores() {
  const seccion = document.getElementById('cifras');
  if (!seccion) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach(entrada => {
        if (!entrada.isIntersecting) return;

        ESTADISTICAS.forEach(config => {
          const el = document.querySelector(config.selector);
          if (el && !el.dataset.animado) {
            el.dataset.animado = 'true'; 
            animarContador(el, config);
          }
        });

        observer.unobserve(seccion);
      });
    },
    { threshold: 0.3 } 
  );

  observer.observe(seccion);
}

//  Autor: Rodrigo Alonso Santos Nunez - SECCION: guardar visita a nosotros en localStorage

function registrarVisitaNosotros() {
  try {
    const visitas = JSON.parse(localStorage.getItem('la_visitas_nosotros') || '0');
    localStorage.setItem('la_visitas_nosotros', JSON.stringify(visitas + 1));
  } catch {
    console.warn('nosotros.js: no se pudo guardar en localStorage.');
  }
}

//  Autor: Rodrigo Alonso Santos Nunez - RENDER DINAMICO: Pintar logros adicionales desde un array

const LOGROS_EXTRA = [
  { icono: '&#9992;&#65039;', texto: 'Primer vuelo low-cost rentable de Yunnan' },
  { icono: '&#127942;',       texto: 'Premio a mejor puntualidad regional 2006' },
  { icono: '&#127758;',       texto: 'Ruta Kunming-Dali mas popular de la provincia' },
  { icono: '&#128200;',       texto: 'Crecimiento de ingresos del 234% en 2007' },
];

function pintarLogrosExtra() {
  const seccion = document.getElementById('cifras');
  if (!seccion) return;
  
  const contenedor = document.createElement('ul');
  contenedor.className = 'logros-extra';
  contenedor.setAttribute('aria-label', 'Logros adicionales');

  LOGROS_EXTRA.forEach(({ icono, texto }) => {
    const li = document.createElement('li');
    li.innerHTML = `<span aria-hidden="true">${icono}</span> ${texto}`;
    contenedor.appendChild(li);
  });

  seccion.appendChild(contenedor);
}

//  Autor: Rodrigo Alonso Santos Nunez - INICIAR

prepararElementosDOM();
pintarLogrosExtra();
iniciarObserverContadores();
registrarVisitaNosotros();

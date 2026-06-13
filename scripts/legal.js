// ============================================================
// legal.js - Autor: Rodrigo Alonso Santos Nunez
// ============================================================

const SECCIONES_LEGALES = ['terminos', 'privacidad', 'cookies', 'reembolsos', 'propiedad'];

// Autor: Rodrigo Alonso Santos Nunez - NAVEGACION POR PESTANAS ENTRE SECCIONES LEGALES

function iniciarNavLegal() {
  const main = document.getElementById('main-content');
  if (!main) return;

  const articulos = SECCIONES_LEGALES
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (articulos.length === 0) return;

  const navIndice = main.querySelector('nav[aria-label="Secciones legales"]');

  const tabList = document.createElement('div');
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', 'Secciones legales');
  tabList.className = 'legal-tablist';

  const tabs = articulos.map((articulo, idx) => {
    const h2 = articulo.querySelector('h2');
    const label = h2 ? h2.textContent.trim() : `Seccion ${idx + 1}`;

    const btn = document.createElement('button');
    btn.type    = 'button';
    btn.role    = 'tab';
    btn.id      = `tab-${articulo.id}`;
    btn.setAttribute('aria-controls', `panel-${articulo.id}`);
    btn.setAttribute('aria-selected',  idx === 0 ? 'true' : 'false');
    btn.tabIndex = idx === 0 ? 0 : -1;
    btn.textContent = label;
    btn.className   = 'legal-tab';
    if (idx === 0) btn.classList.add('tab-activa');

    tabList.appendChild(btn);
    return btn;
  });

  articulos.forEach((articulo, idx) => {
    articulo.setAttribute('role', 'tabpanel');
    articulo.id = `panel-${SECCIONES_LEGALES[idx]}`;
    articulo.setAttribute('aria-labelledby', `tab-${SECCIONES_LEGALES[idx]}`);
    articulo.hidden = idx !== 0;
  });

  const primerArticulo = articulos[0];
  primerArticulo.parentElement.insertBefore(tabList, primerArticulo);

  if (navIndice) navIndice.hidden = true;

  tabs.forEach((btn, idx) => {
    btn.addEventListener('click', () => activarTab(idx));

    btn.addEventListener('keydown', e => {
      let nuevoIdx = idx;
      if (e.key === 'ArrowRight') nuevoIdx = (idx + 1) % tabs.length;
      if (e.key === 'ArrowLeft')  nuevoIdx = (idx - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home')       nuevoIdx = 0;
      if (e.key === 'End')        nuevoIdx = tabs.length - 1;

      if (nuevoIdx !== idx) {
        e.preventDefault();
        activarTab(nuevoIdx);
        tabs[nuevoIdx].focus();
      }
    });
  });

  function activarTab(idxActivo) {
    tabs.forEach((btn, i) => {
      const activa = i === idxActivo;
      btn.setAttribute('aria-selected', String(activa));
      btn.tabIndex = activa ? 0 : -1;
      btn.classList.toggle('tab-activa', activa);
    });

    articulos.forEach((articulo, i) => {
      articulo.hidden = i !== idxActivo;
    });

    agregarBotonVolver(articulos[idxActivo]);
  }

  activarTab(0);

  navegarPorHash(tabs);
}

//  Autor: Rodrigo Alonso Santos Nunez - BOTON "VOLVER AL INDICE" DENTRO DE CADA PANEL

function agregarBotonVolver(panel) {
  if (!panel) return;
  
  if (panel.querySelector('.btn-volver')) return;

  const btn = document.createElement('button');
  btn.type      = 'button';
  btn.className = 'btn-volver';
  btn.innerHTML = '<span aria-hidden="true">&#8679;</span> Volver al indice';

  btn.addEventListener('click', () => {
    
    const tablist = document.querySelector('.legal-tablist');
    if (tablist) tablist.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    const primerTab = tablist ? tablist.querySelector('.tab-activa') : null;
    if (primerTab) primerTab.focus();
  });

  panel.appendChild(btn);
}

// Autor: Rodrigo Alonso Santos Nunez - NAVEGACION POR HASH DE URL

function navegarPorHash(tabs) {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;

  const idxDestino = SECCIONES_LEGALES.indexOf(hash);
  if (idxDestino >= 0 && tabs[idxDestino]) {
    tabs[idxDestino].click();
  }
}

//  Autor: Rodrigo Alonso Santos Nunez - INICIAR

iniciarNavLegal();

//  Autor: Rodrigo Alonso Santos Nunez - GUARDAR ULTIMA SECCION VISTA EN LOCALSTORAGE

function registrarVisita(idSeccion) {
  try {
    localStorage.setItem('la_legal_ultima', idSeccion);
  } catch {
    console.warn('legal.js: no se pudo guardar en localStorage.');
  }
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.legal-tab');
  if (!btn) return;
  const idSeccion = btn.id.replace('tab-', '');
  registrarVisita(idSeccion);
});

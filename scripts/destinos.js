// ============================================================
// destinos.js - Autor: Lenin Mamani
// ============================================================

const destinos = [
  {
    ciudad: "Kunming",
    subtitulo: "La ciudad de la eterna primavera",
    region: "yunnan",
    tipos: ["cultura", "gastronomia"],
    precio: 320,
    aeropuerto: "Kunming Changshui (KMG)",
    duracion: "3-4 dias",
    epoca: "Todo el ano",
    imagen: "../images/kunming.jpg",
    alt: "Vista panoramica de Kunming con su lago y rascacielos de fondo",
    descripcion: "Capital de Yunnan, con clima templado todo el ano. Puerta de entrada a la provincia.",
    url: "destino-detalle.html?ciudad=kunming"
  },
  {
    ciudad: "Dali",
    subtitulo: "Historia y lagos",
    region: "yunnan",
    tipos: ["cultura", "naturaleza"],
    precio: 280,
    aeropuerto: "Dali (DLU)",
    duracion: "2-3 dias",
    epoca: "Marzo a octubre",
    imagen: "../images/dali.jpg",
    alt: "Lago Erhai de Dali con las montanas Cang al fondo",
    descripcion: "Ciudad a orillas del lago Erhai, con arquitectura tradicional Bai y montanas Cang.",
    url: "destino-detalle.html?ciudad=dali"
  },
  {
    ciudad: "Xishuangbanna",
    subtitulo: "Tropico y selva",
    region: "yunnan",
    tipos: ["naturaleza", "gastronomia", "aventura"],
    precio: 450,
    aeropuerto: "Xishuangbanna Gasa (JHG)",
    duracion: "3-5 dias",
    epoca: "Noviembre a abril",
    imagen: "../images/xishuangbanna.jpg",
    alt: "Selva tropical de Xishuangbanna con pagodas budistas",
    descripcion: "Region tropical al sur, con selvas, templos budistas y cultura de la etnia Dai.",
    url: "destino-detalle.html?ciudad=xishuangbanna"
  },
  {
    ciudad: "Lijiang",
    subtitulo: "Patrimonio UNESCO",
    region: "yunnan",
    tipos: ["cultura", "naturaleza", "aventura"],
    precio: 390,
    aeropuerto: "Lijiang Sanyi (LJG)",
    duracion: "2-4 dias",
    epoca: "Abril a octubre",
    imagen: "../images/lijiang.jpg",
    alt: "Casco antiguo de Lijiang con canales y techos tradicionales",
    descripcion: "Casco antiguo declarado Patrimonio de la Humanidad, con canales y arquitectura Naxi.",
    url: "destino-detalle.html?ciudad=lijiang"
  },
  {
    ciudad: "Shangri-La",
    subtitulo: "El Tibet accesible",
    region: "yunnan",
    tipos: ["cultura", "naturaleza", "aventura"],
    precio: 510,
    aeropuerto: "Diqing Shangri-La (DIG)",
    duracion: "3-4 dias",
    epoca: "Mayo a septiembre",
    imagen: "../images/shangrila.jpg",
    alt: "Monasterio de Songzanlin en Shangri-La con montanas nevadas",
    descripcion: "Meseta tibetana con monasterios, lagos alpinos y cultura budista.",
    url: "destino-detalle.html?ciudad=shangrila"
  },
  {
    ciudad: "Chengdu",
    subtitulo: "Escapada urbana",
    region: "extra",
    tipos: ["cultura", "gastronomia"],
    precio: 380,
    aeropuerto: "Chengdu Tianfu (TFU)",
    duracion: "2-3 dias",
    epoca: "Marzo a junio",
    imagen: "../images/promo-invierno.jpg",
    alt: "Promocion de viaje de invierno con Lucky Air",
    descripcion: "Ciudad cercana ideal para probar cocina Sichuan y conectar con rutas nacionales.",
    url: "destino-detalle.html?ciudad=chengdu"
  }
];

const formulario = document.querySelector("#form-filtros-destinos");
const listaDestinos = document.querySelector("#lista-destinos");
const mensajeDestinos = document.querySelector("#mensaje-destinos");
const ordenDestinos = document.querySelector("#orden-destinos");

// Autor: Lenin Mamani - Convierte un texto en HTML seguro para evitar inyecciones.
function escaparHtml(texto) {
  const temporal = document.createElement("span");
  temporal.textContent = texto;
  return temporal.innerHTML;
}

// Autor: Lenin Mamani - Lee los filtros activos del formulario.
function obtenerFiltros() {
  const datos = new FormData(formulario);
  return {
    region: datos.get("region") || "todos",
    tipos: datos.getAll("tipo"),
    orden: datos.get("orden") || "recomendado"
  };
}

// Autor: Lenin Mamani - Filtra los destinos por region y tipos elegidos.
function filtrarDestinos(filtros) {
  return destinos.filter((destino) => {
    const coincideRegion = filtros.region === "todos" || destino.region === filtros.region;
    const coincideTipo = filtros.tipos.length === 0 || filtros.tipos.every((tipo) => destino.tipos.includes(tipo));
    return coincideRegion && coincideTipo;
  });
}

// Autor: Lenin Mamani - Ordena una copia de los destinos segun la opcion seleccionada.
function ordenarDestinos(destinosFiltrados, orden) {
  const copia = [...destinosFiltrados];

  if (orden === "precio-menor") {
    return copia.sort((a, b) => a.precio - b.precio);
  }

  if (orden === "precio-mayor") {
    return copia.sort((a, b) => b.precio - a.precio);
  }

  if (orden === "nombre") {
    return copia.sort((a, b) => a.ciudad.localeCompare(b.ciudad));
  }

  return copia;
}

// Autor: Lenin Mamani - Crea el HTML de una tarjeta de destino.
function crearTarjetaDestino(destino) {
  return `
    <article>
      <h3>${escaparHtml(destino.ciudad)} - ${escaparHtml(destino.subtitulo)}</h3>
      <img src="${destino.imagen}" alt="${escaparHtml(destino.alt)}" width="400" height="250">
      <p>${escaparHtml(destino.descripcion)}</p>
      <ul>
        <li>Aeropuerto: ${escaparHtml(destino.aeropuerto)}</li>
        <li>Duracion promedio: ${escaparHtml(destino.duracion)}</li>
        <li>Mejor epoca: ${escaparHtml(destino.epoca)}</li>
        <li>Desde: CNY ${destino.precio}</li>
      </ul>
      <p><a href="${destino.url}" class="btn btn-primary"><span aria-hidden="true">&#128205;</span> Ver ${escaparHtml(destino.ciudad)}</a></p>
    </article>
  `;
}

// Autor: Lenin Mamani - Pinta los destinos filtrados en pantalla.
function renderizarDestinos() {
  const filtros = obtenerFiltros();
  const resultados = ordenarDestinos(filtrarDestinos(filtros), filtros.orden);

  listaDestinos.innerHTML = resultados.map(crearTarjetaDestino).join("");
  mensajeDestinos.textContent = resultados.length === 1
    ? "Se encontro 1 destino."
    : `Se encontraron ${resultados.length} destinos.`;

  if (resultados.length === 0) {
    listaDestinos.innerHTML = "<p>No hay destinos con esos filtros. Prueba con menos opciones.</p>";
  }

  localStorage.setItem("luckyAirFiltrosDestinos", JSON.stringify(filtros));
}

// Autor: Lenin Mamani - Restaura los ultimos filtros guardados en localStorage.
function cargarFiltrosGuardados() {
  const filtrosGuardados = JSON.parse(localStorage.getItem("luckyAirFiltrosDestinos") || "null");

  if (!filtrosGuardados) {
    return;
  }

  const region = formulario.querySelector(`[name="region"][value="${filtrosGuardados.region}"]`);
  if (region) {
    region.checked = true;
  }

  formulario.querySelectorAll('[name="tipo"]').forEach((checkbox) => {
    checkbox.checked = filtrosGuardados.tipos.includes(checkbox.value);
  });

  ordenDestinos.value = filtrosGuardados.orden || "recomendado";
}

// Autor: Lenin Mamani - Inicia los eventos del filtro dinamico.
function iniciarDestinos() {
  cargarFiltrosGuardados();
  renderizarDestinos();

  formulario.addEventListener("input", renderizarDestinos);
  formulario.addEventListener("change", renderizarDestinos);
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    renderizarDestinos();
  });
}

iniciarDestinos();

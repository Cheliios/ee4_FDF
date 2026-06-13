// ============================================================
// blog.js - Autor: Lenin Mamani
// ============================================================

const articulos = [
  {
    titulo: "Como recorri Yunnan en 10 dias con 2,000 yuanes",
    autor: "Chen Li",
    fecha: "2026-04-05",
    fechaTexto: "5 de abril, 2026",
    categoria: "experiencias",
    categoriaTexto: "Experiencias",
    imagen: "../images/blog-yunnan-10dias.jpg",
    alt: "Viajero en el Bosque de Piedra de Shilin con mochila de viaje",
    resumen: "Un recorrido completo por los imperdibles de Yunnan sin vaciar la billetera. Kunming, Dali, Lijiang y Shangri-La con transporte terrestre y aereo combinado."
  },
  {
    titulo: "Por que elegimos Lucky Air para nuestra luna de miel",
    autor: "Maria Wang",
    fecha: "2026-03-28",
    fechaTexto: "28 de marzo, 2026",
    categoria: "historias",
    categoriaTexto: "Historias",
    imagen: "../images/blog-luna-miel.jpg",
    alt: "Pareja de recien casados en el lago Erhai de Dali",
    resumen: "Nuestra experiencia eligiendo una aerolinea low-cost para un momento especial. Spoiler: no te arrepentis."
  },
  {
    titulo: "Ruta gastronomica por Kunming en 48 horas",
    autor: "Zhang Wei",
    fecha: "2026-03-15",
    fechaTexto: "15 de marzo, 2026",
    categoria: "gastronomia",
    categoriaTexto: "Gastronomia",
    imagen: "../images/blog-gastronomia.jpg",
    alt: "Plato de fideos Guoqiao, fideos a traves del puente, tipicos de Yunnan",
    resumen: "Desde los fideos Guoqiao hasta el hot pot de Yunnan. Ruta completa para foodies."
  },
  {
    titulo: "Los 25 minutos del turnaround: por que volamos mas barato",
    autor: "Equipo Lucky Air",
    fecha: "2026-03-01",
    fechaTexto: "1 de marzo, 2026",
    categoria: "nosotros",
    categoriaTexto: "Nosotros",
    imagen: "../images/blog-turnaround.jpg",
    alt: "Personal de tierra preparando un Boeing 737 de Lucky Air",
    resumen: "Inspirados en Southwest Airlines, aprendimos a preparar un avion para su siguiente vuelo en solo 25 minutos. Te contamos como."
  },
  {
    titulo: "Guia para mochileros: Xishuangbanna sin morir en el intento",
    autor: "Zhou Min",
    fecha: "2026-02-20",
    fechaTexto: "20 de febrero, 2026",
    categoria: "guias",
    categoriaTexto: "Guias",
    imagen: "../images/blog-xishuangbanna.jpg",
    alt: "Mochilero cruzando puente colgante en la selva de Xishuangbanna",
    resumen: "Clima tropical, idioma, transporte, alojamiento barato y que comer. Todo lo que necesitas saber antes de ir."
  }
];

const formularioBusqueda = document.querySelector("#form-buscar-blog");
const campoBusqueda = document.querySelector("#sb-query");
const campoCategoria = document.querySelector("#categoria-blog");
const listaArticulos = document.querySelector("#lista-articulos");
const mensajeBlog = document.querySelector("#mensaje-blog");
const formularioNewsletter = document.querySelector("#form-newsletter");
const campoEmail = document.querySelector("#n-email");
const mensajeNewsletter = document.querySelector("#mensaje-newsletter");

// Autor: Lenin Mamani - Escapa texto dinamico antes de insertarlo como HTML.
function escaparHtml(texto) {
  const temporal = document.createElement("span");
  temporal.textContent = texto;
  return temporal.innerHTML;
}

// Autor: Lenin Mamani - Normaliza texto para busquedas sin importar mayusculas.
function normalizar(texto) {
  return texto.trim().toLowerCase();
}

// Autor: Lenin Mamani - Filtra articulos por palabra clave y categoria.
function filtrarArticulos() {
  const consulta = normalizar(campoBusqueda.value);
  const categoria = campoCategoria.value;

  return articulos.filter((articulo) => {
    const textoArticulo = normalizar(`${articulo.titulo} ${articulo.autor} ${articulo.resumen} ${articulo.categoriaTexto}`);
    const coincideTexto = consulta === "" || textoArticulo.includes(consulta);
    const coincideCategoria = categoria === "todas" || articulo.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });
}

// Autor: Lenin Mamani - Crea la tarjeta HTML de cada articulo.
function crearTarjetaArticulo(articulo) {
  return `
    <article>
      <header>
        <h3>${escaparHtml(articulo.titulo)}</h3>
        <p>Por ${escaparHtml(articulo.autor)} | <time datetime="${articulo.fecha}">${escaparHtml(articulo.fechaTexto)}</time> | Categoria: ${escaparHtml(articulo.categoriaTexto)}</p>
      </header>
      <img src="${articulo.imagen}" alt="${escaparHtml(articulo.alt)}" width="400" height="250">
      <p>${escaparHtml(articulo.resumen)}</p>
      <p><a href="#" class="btn btn-outline"><span aria-hidden="true">&#128214;</span> Leer articulo</a></p>
    </article>
  `;
}

// Autor: Lenin Mamani - Renderiza los articulos filtrados sin recargar la pagina.
function renderizarArticulos() {
  const resultados = filtrarArticulos();
  listaArticulos.innerHTML = resultados.map(crearTarjetaArticulo).join("");

  mensajeBlog.textContent = resultados.length === 1
    ? "Se encontro 1 articulo."
    : `Se encontraron ${resultados.length} articulos.`;

  if (resultados.length === 0) {
    listaArticulos.innerHTML = "<p>No hay articulos para esa busqueda.</p>";
  }

  localStorage.setItem("luckyAirBlogFiltro", JSON.stringify({
    consulta: campoBusqueda.value,
    categoria: campoCategoria.value
  }));
}

// Autor: Lenin Mamani - Valida el formato del email del newsletter.
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Autor: Lenin Mamani - Procesa la suscripcion al newsletter sin recargar.
function manejarNewsletter(evento) {
  evento.preventDefault();

  const email = campoEmail.value.trim();
  if (!validarEmail(email)) {
    mensajeNewsletter.textContent = "Ingresa un correo valido para suscribirte.";
    return;
  }

  const suscripciones = JSON.parse(localStorage.getItem("luckyAirNewsletter") || "[]");
  const yaExiste = suscripciones.some((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!yaExiste) {
    suscripciones.push({ email, fecha: new Date().toISOString() });
    localStorage.setItem("luckyAirNewsletter", JSON.stringify(suscripciones));
  }

  formularioNewsletter.reset();
  mensajeNewsletter.textContent = `Gracias por suscribirte, ${email}.`;
  window.location.hash = "gracias-newsletter";
}

// Autor: Lenin Mamani - Carga el ultimo filtro usado en el blog.
function cargarFiltroGuardado() {
  const filtro = JSON.parse(localStorage.getItem("luckyAirBlogFiltro") || "null");

  if (!filtro) {
    return;
  }

  campoBusqueda.value = filtro.consulta || "";
  campoCategoria.value = filtro.categoria || "todas";
}

// Autor: Lenin Mamani - Activa eventos del buscador y del newsletter.
function iniciarBlog() {
  cargarFiltroGuardado();
  renderizarArticulos();

  formularioBusqueda.addEventListener("submit", (evento) => {
    evento.preventDefault();
    renderizarArticulos();
  });
  campoBusqueda.addEventListener("input", renderizarArticulos);
  campoCategoria.addEventListener("change", renderizarArticulos);
  formularioNewsletter.addEventListener("submit", manejarNewsletter);
}

iniciarBlog();

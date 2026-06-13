// ============================================================
// destino-detalle.js - Autor: Lenin Mamani
// ============================================================

const imagenesGaleria = [
  {
    src: "../images/kunming-shilin.jpg",
    alt: "Formaciones rocosas del Bosque de Piedra en Shilin",
    texto: "Bosque de Piedra (Shilin)"
  },
  {
    src: "../images/kunming-dianchi.jpg",
    alt: "Orillas del lago Dianchi al amanecer",
    texto: "Lago Dianchi"
  },
  {
    src: "../images/kunming-yuantong.jpg",
    alt: "Fachada del Templo de Yuantong con sus pagodas",
    texto: "Templo de Yuantong"
  }
];

const claveResenas = "luckyAirResenasKunming";
let indiceGaleria = 0;
let calificacionSeleccionada = 0;

const imagenGaleria = document.querySelector("#galeria-imagen");
const textoGaleria = document.querySelector("#galeria-texto");
const botonAnterior = document.querySelector("#galeria-anterior");
const botonSiguiente = document.querySelector("#galeria-siguiente");
const formularioResena = document.querySelector('form[name="form-resena"]');
const listaResenas = document.querySelector("#lista-resenas");
const mensajeResena = document.querySelector("#mensaje-resena");
const inputGeneral = document.querySelector("#r-general");
const botonesEstrellas = document.querySelectorAll("#estrellas-resena button");

// Autor: Lenin Mamani - Convierte texto de usuario a contenido HTML seguro.
function escaparHtml(texto) {
  const temporal = document.createElement("span");
  temporal.textContent = texto;
  return temporal.innerHTML;
}

// Autor: Lenin Mamani - Actualiza la imagen visible del carrusel.
function mostrarImagenGaleria() {
  const imagenActual = imagenesGaleria[indiceGaleria];
  imagenGaleria.src = imagenActual.src;
  imagenGaleria.alt = imagenActual.alt;
  textoGaleria.textContent = `${imagenActual.texto} (${indiceGaleria + 1} de ${imagenesGaleria.length})`;
}

// Autor: Lenin Mamani - Avanza o retrocede en el carrusel sin salir del arreglo.
function moverGaleria(direccion) {
  indiceGaleria = (indiceGaleria + direccion + imagenesGaleria.length) % imagenesGaleria.length;
  mostrarImagenGaleria();
}

// Autor: Lenin Mamani - Lee las resenas guardadas en localStorage.
function obtenerResenasGuardadas() {
  return JSON.parse(localStorage.getItem(claveResenas) || "[]");
}

// Autor: Lenin Mamani - Guarda el arreglo de resenas en localStorage.
function guardarResenas(resenas) {
  localStorage.setItem(claveResenas, JSON.stringify(resenas));
}

// Autor: Lenin Mamani - Crea una resena con los datos del formulario.
function crearResenaDesdeFormulario() {
  const datos = new FormData(formularioResena);
  return {
    titulo: datos.get("titulo").trim(),
    general: Number(datos.get("general")),
    puntualidad: Number(datos.get("puntualidad")),
    equipaje: Number(datos.get("equipaje")),
    atencion: Number(datos.get("atencion")),
    texto: datos.get("texto").trim(),
    autor: "Viajero Lucky",
    fecha: new Date().toISOString().slice(0, 10)
  };
}

// Autor: Lenin Mamani - Valida que la resena tenga datos completos y rangos correctos.
function validarResena(resena) {
  if (resena.titulo.length < 5) {
    return "El titulo debe tener al menos 5 caracteres.";
  }

  if (resena.general < 1 || resena.general > 5) {
    return "Selecciona una calificacion general con las estrellas.";
  }

  if ([resena.puntualidad, resena.equipaje, resena.atencion].some((valor) => valor < 1 || valor > 5)) {
    return "Puntualidad, equipaje y atencion deben estar entre 1 y 5.";
  }

  if (resena.texto.length < 20) {
    return "El comentario debe tener al menos 20 caracteres.";
  }

  return "";
}

// Autor: Lenin Mamani - Devuelve estrellas rellenas segun la calificacion.
function crearTextoEstrellas(valor) {
  return "\u2605".repeat(valor) + "\u2606".repeat(5 - valor);
}

// Autor: Lenin Mamani - Crea el HTML de una resena nueva.
function crearHtmlResena(resena) {
  return `
    <li>
      <article>
        <h3>${escaparHtml(resena.titulo)}</h3>
        <p>Calificacion: ${resena.general} de 5 estrellas ${crearTextoEstrellas(resena.general)}</p>
        <dl>
          <dt>Puntualidad</dt><dd>${resena.puntualidad} de 5</dd>
          <dt>Equipaje</dt><dd>${resena.equipaje} de 5</dd>
          <dt>Atencion</dt><dd>${resena.atencion} de 5</dd>
        </dl>
        <p>"${escaparHtml(resena.texto)}"</p>
        <footer>
          <p>Por ${escaparHtml(resena.autor)} | <time datetime="${resena.fecha}">${resena.fecha}</time></p>
        </footer>
      </article>
    </li>
  `;
}

// Autor: Lenin Mamani - Pinta en pantalla las resenas guardadas por el usuario.
function renderizarResenasGuardadas() {
  const resenas = obtenerResenasGuardadas();
  const htmlResenas = resenas.map(crearHtmlResena).join("");
  listaResenas.insertAdjacentHTML("afterbegin", htmlResenas);
}

// Autor: Lenin Mamani - Actualiza los botones de estrellas y el input oculto.
function actualizarEstrellas(valor) {
  calificacionSeleccionada = valor;
  inputGeneral.value = String(valor);

  botonesEstrellas.forEach((boton) => {
    const activo = Number(boton.dataset.valor) <= valor;
    boton.textContent = activo ? "\u2605" : "\u2606";
    boton.setAttribute("aria-checked", activo ? "true" : "false");
  });
}

// Autor: Lenin Mamani - Procesa el envio, guarda la resena y la muestra sin recargar.
function manejarEnvioResena(evento) {
  evento.preventDefault();

  const resena = crearResenaDesdeFormulario();
  const error = validarResena(resena);

  if (error) {
    mensajeResena.textContent = error;
    return;
  }

  const resenas = obtenerResenasGuardadas();
  resenas.unshift(resena);
  guardarResenas(resenas);
  listaResenas.insertAdjacentHTML("afterbegin", crearHtmlResena(resena));
  formularioResena.reset();
  actualizarEstrellas(0);
  mensajeResena.textContent = "Tu resena fue publicada correctamente.";
  window.location.hash = "gracias-resena";
}

// Autor: Lenin Mamani - Conecta los eventos del carrusel, estrellas y formulario.
function iniciarDetalleDestino() {
  mostrarImagenGaleria();
  renderizarResenasGuardadas();

  botonAnterior.addEventListener("click", () => moverGaleria(-1));
  botonSiguiente.addEventListener("click", () => moverGaleria(1));

  botonesEstrellas.forEach((boton) => {
    boton.setAttribute("role", "radio");
    boton.addEventListener("click", () => actualizarEstrellas(Number(boton.dataset.valor)));
  });

  formularioResena.addEventListener("submit", manejarEnvioResena);
}

iniciarDetalleDestino();

// scripts/estudiantes.js
// EE3 - Lucky Air - Pagina Estudiantes
console.log("estudiantes.js cargado");

document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------------------------------
  // 1) DOM/EVENTO: filtrar promociones por estado (vigentes / vencidas)
  //    usando la fecha del <time datetime="...">
  // ----------------------------------------------------
  const promosSection = document.getElementById("promos");
  const promoArticles = promosSection ? promosSection.querySelectorAll(".cards article") : [];

  if (promoArticles.length > 0) {
    // Creamos un pequeno panel de filtros
    const filtroDiv = document.createElement("div");
    filtroDiv.classList.add("filtro-promos");
    filtroDiv.innerHTML = `
      <button type="button" data-filtro="todas" class="btn btn-outline activo">Todas</button>
      <button type="button" data-filtro="vigentes" class="btn btn-outline">Solo vigentes</button>
    `;
    promosSection.querySelector("h2").insertAdjacentElement("afterend", filtroDiv);

    const hoy = new Date();

    function aplicarFiltro(modo) {
      promoArticles.forEach(articulo => {
        const timeEl = articulo.querySelector("time");
        const fechaLimite = timeEl ? new Date(timeEl.getAttribute("datetime")) : null;
        const vigente = !fechaLimite || fechaLimite >= hoy;

        if (modo === "vigentes" && !vigente) {
          articulo.classList.add("promo-oculta");
        } else {
          articulo.classList.remove("promo-oculta");
        }
      });
    }

    filtroDiv.querySelectorAll("button").forEach(boton => {
      boton.addEventListener("click", () => {
        filtroDiv.querySelectorAll("button").forEach(b => b.classList.remove("activo"));
        boton.classList.add("activo");
        aplicarFiltro(boton.dataset.filtro);
      });
    });
  }


  // ----------------------------------------------------
  // 2) DOM/EVENTO: contador de caracteres para el textarea
  //    "detalles" del formulario grupal (manipula textContent)
  // ----------------------------------------------------
  const detalles = document.getElementById("g-detalles");

  if (detalles) {
    const contador = document.createElement("p");
    contador.classList.add("contador-caracteres");
    contador.textContent = `0 / ${detalles.maxLength} caracteres`;
    detalles.insertAdjacentElement("afterend", contador);

    detalles.addEventListener("input", () => {
      contador.textContent = `${detalles.value.length} / ${detalles.maxLength} caracteres`;

      if (detalles.value.length > detalles.maxLength * 0.9) {
        contador.classList.add("contador-limite");
      } else {
        contador.classList.remove("contador-limite");
      }
    });
  }


  // ----------------------------------------------------
  // 3) PERSISTENCIA con localStorage: recordar la universidad
  //    del formulario de verificacion de carnet
  // ----------------------------------------------------
  const inputUniversidad = document.getElementById("est-uni");

  if (inputUniversidad) {
    const universidadGuardada = localStorage.getItem("luckyair_universidad");
    if (universidadGuardada) {
      inputUniversidad.value = universidadGuardada;
    }

    inputUniversidad.addEventListener("change", () => {
      localStorage.setItem("luckyair_universidad", inputUniversidad.value);
    });
  }


  // ----------------------------------------------------
  // 4) VALIDACION del formulario de verificacion de carnet
  // ----------------------------------------------------
  const formVerificacion = document.querySelector('form[name="form-verificacion"]');

  if (formVerificacion) {
    let feedback = document.getElementById("verificacion-feedback");
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.id = "verificacion-feedback";
      feedback.setAttribute("role", "alert");
      formVerificacion.insertBefore(feedback, formVerificacion.firstChild);
    }

    formVerificacion.addEventListener("submit", (evento) => {
      const errores = [];

      const nombre = document.getElementById("est-nombre");
      const email = document.getElementById("est-email");
      const universidad = document.getElementById("est-uni");
      const carnet = document.getElementById("est-carnet");
      const ciclo = document.getElementById("est-ciclo");
      const foto = document.getElementById("est-foto");
      const acepto = formVerificacion.querySelector('input[name="acepto"]');

      if (nombre.value.trim().length < 3) {
        errores.push("Ingresa tus nombres completos.");
      }

      // Email institucional: debe contener .edu en algun punto
      if (!/^[^\s@]+@[^\s@]+\.edu/.test(email.value.trim())) {
        errores.push("El email debe ser institucional (debe contener '.edu').");
      }

      if (universidad.value.trim().length < 3) {
        errores.push("Ingresa el nombre de tu universidad.");
      }

      if (carnet.value.trim().length < 3) {
        errores.push("Ingresa tu numero de carnet.");
      }

      if (!ciclo.value) {
        errores.push("Selecciona tu ciclo actual.");
      }

      if (!foto.files || foto.files.length === 0) {
        errores.push("Adjunta una foto de tu carnet.");
      }

      if (!acepto.checked) {
        errores.push("Debes autorizar la verificacion de tu condicion de estudiante.");
      }

      if (errores.length > 0) {
        evento.preventDefault();
        feedback.className = "feedback feedback--error";
        feedback.innerHTML =
          "<strong>Corrige lo siguiente:</strong><ul>" +
          errores.map(err => `<li>${err}</li>`).join("") +
          "</ul>";
        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        feedback.className = "feedback feedback--ok";
        feedback.textContent = "Datos validos. Enviando verificacion...";
      }
    });
  }
});

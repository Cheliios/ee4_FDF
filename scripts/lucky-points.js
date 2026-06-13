// scripts/lucky-points.js
// EE3 - Lucky Air - Pagina Lucky Points
console.log("lucky-points.js cargado");

document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------------------------------
  // 1) FETCH + RENDER DINAMICO: catalogo de canje desde JSON
  // ----------------------------------------------------
  const seccionCanje = document.getElementById("canje");

  if (seccionCanje) {
    // Contenedor donde renderizaremos el catalogo dinamico
    const contenedor = document.createElement("section");
    contenedor.setAttribute("aria-labelledby", "canje-dinamico-title");
    contenedor.innerHTML = `
      <h3 id="canje-dinamico-title">Catalogo dinamico (desde data/site-data.json)</h3>
      <div class="filtro-catalogo">
        <button type="button" data-cat="todas" class="btn btn-outline activo">Todas</button>
        <button type="button" data-cat="vuelos" class="btn btn-outline">Vuelos</button>
        <button type="button" data-cat="regalos" class="btn btn-outline">Regalos</button>
        <button type="button" data-cat="experiencias" class="btn btn-outline">Experiencias</button>
      </div>
      <div id="catalogo-lista" class="cards"><p>Cargando catalogo...</p></div>
    `;
    seccionCanje.appendChild(contenedor);

    const listaDiv = document.getElementById("catalogo-lista");
    let catalogoCompleto = [];

    function renderCatalogo(items) {
      if (!items || items.length === 0) {
        listaDiv.innerHTML = "<p>No hay elementos para esta categoria.</p>";
        return;
      }

      listaDiv.innerHTML = items.map(item => `
        <article>
          <h4>${item.nombre}</h4>
          <p>${item.puntos.toLocaleString("es-PE")} puntos</p>
          <p><span class="badge">${item.categoria}</span></p>
        </article>
      `).join("");
    }

    fetch("../data/site-data.json")
      .then(respuesta => {
        if (!respuesta.ok) {
          throw new Error("Respuesta no valida del servidor");
        }
        return respuesta.json();
      })
      .then(datos => {
        catalogoCompleto = datos;
        renderCatalogo(catalogoCompleto);
      })
      .catch(error => {
        console.error("Error al cargar el catalogo:", error);
        listaDiv.innerHTML = "<p>No se pudo cargar el catalogo en este momento. Intenta mas tarde.</p>";
      });

    // ----------------------------------------------------
    // 2) DOM/EVENTO: filtrar el catalogo por categoria
    // ----------------------------------------------------
    contenedor.querySelectorAll(".filtro-catalogo button").forEach(boton => {
      boton.addEventListener("click", () => {
        contenedor.querySelectorAll(".filtro-catalogo button")
          .forEach(b => b.classList.remove("activo"));
        boton.classList.add("activo");

        const cat = boton.dataset.cat;
        if (cat === "todas") {
          renderCatalogo(catalogoCompleto);
        } else {
          renderCatalogo(catalogoCompleto.filter(item => item.categoria === cat));
        }
      });
    });
  }


  // ----------------------------------------------------
  // 3) PERSISTENCIA con localStorage: recordar email del registro
  // ----------------------------------------------------
  const inputEmail = document.getElementById("lp-email");

  if (inputEmail) {
    const emailGuardado = localStorage.getItem("luckyair_lp_email");
    if (emailGuardado) {
      inputEmail.value = emailGuardado;
    }

    inputEmail.addEventListener("change", () => {
      localStorage.setItem("luckyair_lp_email", inputEmail.value);
    });
  }


  // ----------------------------------------------------
  // 4) VALIDACION del formulario de registro Lucky Points
  // ----------------------------------------------------
  const formRegistro = document.querySelector('form[name="form-registro-puntos"]');

  if (formRegistro) {
    let feedback = document.getElementById("registro-feedback");
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.id = "registro-feedback";
      feedback.setAttribute("role", "alert");
      formRegistro.insertBefore(feedback, formRegistro.firstChild);
    }

    formRegistro.addEventListener("submit", (evento) => {
      const errores = [];

      const nombre = document.getElementById("lp-nombre");
      const apellido = document.getElementById("lp-apellido");
      const email = document.getElementById("lp-email");
      const documento = document.getElementById("lp-doc");
      const nacimiento = document.getElementById("lp-fecha");
      const pass = document.getElementById("lp-pass");
      const pass2 = document.getElementById("lp-pass2");
      const acepto = formRegistro.querySelector('input[name="acepto"]');

      if (nombre.value.trim().length < 2) {
        errores.push("Ingresa tus nombres.");
      }
      if (apellido.value.trim().length < 2) {
        errores.push("Ingresa tus apellidos.");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        errores.push("Ingresa un email valido.");
      }
      if (documento.value.trim().length < 6) {
        errores.push("Ingresa un documento de identidad valido.");
      }
      if (!nacimiento.value) {
        errores.push("Ingresa tu fecha de nacimiento.");
      }
      if (pass.value.length < 8) {
        errores.push("La contrasena debe tener al menos 8 caracteres.");
      }
      if (pass.value !== pass2.value) {
        errores.push("Las contrasenas no coinciden.");
      }
      if (!acepto.checked) {
        errores.push("Debes aceptar los terminos del programa.");
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
        feedback.textContent = "Datos validos. Creando cuenta...";
        localStorage.removeItem("luckyair_lp_email");
      }
    });
  }
});

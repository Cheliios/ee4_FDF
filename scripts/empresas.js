// scripts/empresas.js
// EE3 - Lucky Air - Pagina Empresas
console.log("empresas.js cargado");

document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------------------------------
  // 1) DOM/EVENTO: mostrar resumen del plan seleccionado
  // ----------------------------------------------------
  const radiosPlan = document.querySelectorAll('input[name="plan"]');
  const resumenPlan = document.createElement("p");
  resumenPlan.id = "resumen-plan";
  resumenPlan.classList.add("resumen-plan");

  const fieldsetPlan = document.querySelector('fieldset legend')?.closest("form")
    ?.querySelectorAll("fieldset")[2]; // tercer fieldset = "Plan de interes"

  if (fieldsetPlan) {
    fieldsetPlan.appendChild(resumenPlan);
  }

  const infoPlanes = {
    starter: "Plan Starter: gratis, hasta 10 empleados, 5% de descuento en vuelos.",
    business: "Plan Business: CNY 500/mes, hasta 50 empleados, 10% de descuento y ejecutivo compartido.",
    enterprise: "Plan Enterprise: precio a medida, empleados ilimitados, 15%+ de descuento y ejecutivo dedicado."
  };

  function actualizarResumenPlan() {
    const seleccionado = document.querySelector('input[name="plan"]:checked');
    if (seleccionado && resumenPlan) {
      resumenPlan.textContent = infoPlanes[seleccionado.value] || "";
      resumenPlan.classList.add("visible");
    }
  }

  radiosPlan.forEach(radio => {
    radio.addEventListener("change", actualizarResumenPlan);
  });

  // Mostrar resumen del plan marcado por defecto al cargar
  actualizarResumenPlan();


  // ----------------------------------------------------
  // 2) PERSISTENCIA con localStorage: recordar razon social
  // ----------------------------------------------------
  const inputRazon = document.getElementById("e-razon");

  if (inputRazon) {
    const guardado = localStorage.getItem("luckyair_empresa_razon");
    if (guardado) {
      inputRazon.value = guardado;
    }

    inputRazon.addEventListener("input", () => {
      localStorage.setItem("luckyair_empresa_razon", inputRazon.value);
    });
  }


  // ----------------------------------------------------
  // 3) VALIDACION del formulario de registro de empresa
  // ----------------------------------------------------
  const formEmpresa = document.querySelector('form[name="form-empresa"]');

  if (formEmpresa) {
    // Contenedor de mensajes de feedback
    let feedback = document.getElementById("empresa-feedback");
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.id = "empresa-feedback";
      feedback.setAttribute("role", "alert");
      formEmpresa.insertBefore(feedback, formEmpresa.firstChild);
    }

    formEmpresa.addEventListener("submit", (evento) => {
      const errores = [];

      const razon = document.getElementById("e-razon");
      const ruc = document.getElementById("e-ruc");
      const tamano = document.getElementById("e-tamano");
      const rubro = document.getElementById("e-rubro");
      const email = document.getElementById("e-email");
      const telefono = document.getElementById("e-tel");

      if (razon.value.trim().length < 3) {
        errores.push("La razon social debe tener al menos 3 caracteres.");
      }

      // RUC/NIT: validamos que tenga solo numeros y entre 8 y 13 digitos
      const rucLimpio = ruc.value.trim();
      if (!/^[0-9]{8,13}$/.test(rucLimpio)) {
        errores.push("El RUC o NIT debe contener solo numeros (8 a 13 digitos).");
      }

      if (!tamano.value) {
        errores.push("Selecciona el tamano de la empresa.");
      }

      if (!rubro.value) {
        errores.push("Selecciona el rubro de la empresa.");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        errores.push("Ingresa un email corporativo valido.");
      }

      const telLimpio = telefono.value.trim();
      if (!/^[+0-9 ]{9,15}$/.test(telLimpio)) {
        errores.push("El telefono debe tener entre 9 y 15 caracteres (numeros, espacios o '+').");
      }

      if (errores.length > 0) {
        // Detenemos el envio real para mostrar feedback en pantalla
        evento.preventDefault();

        feedback.className = "feedback feedback--error";
        feedback.innerHTML =
          "<strong>Revisa los siguientes datos:</strong><ul>" +
          errores.map(err => `<li>${err}</li>`).join("") +
          "</ul>";

        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        feedback.className = "feedback feedback--ok";
        feedback.textContent = "Formulario valido. Enviando solicitud...";
        // Limpiamos el borrador guardado al enviar correctamente
        localStorage.removeItem("luckyair_empresa_razon");
        // Dejamos que el formulario continue (abre el modal #gracias-empresa)
      }
    });
  }
});

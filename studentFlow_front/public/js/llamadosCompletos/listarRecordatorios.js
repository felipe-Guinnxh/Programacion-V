// EJEMPLO: consultar el listado de recordatorios del API.
// Cargar desde una página servida por el frontend (http://127.0.0.1:5500).

async function listarRecordatorios() {
  // 1. Definir el endpoint. El servidor del frontend reenvía esta ruta al backend.
  const endpoint = "/api/v1/recordatorios";

  // 2. Preparar los filtros que enviaremos en la URL.
  // Quita leido para ver recordatorios leídos y no leídos.
  const filtros = new URLSearchParams({
    page: "1",
    limit: "20",
    sort: "fechaHora",
    order: "asc"
  });

  // 3. Construir la URL completa.
  const url = `${endpoint}?${filtros.toString()}`;
  console.log("URL que vamos a consultar:", url);

  // Buscar los elementos del HTML donde mostraremos el resultado.
  const cuerpoTabla = document.querySelector("#recordatorios-body");
  const mensajeEstado = document.querySelector("#estado");
  const resumenPaginacion = document.querySelector("#paginacion");
  const botonRecargar = document.querySelector("#recargar-recordatorios");

  if (cuerpoTabla) cuerpoTabla.replaceChildren();
  if (resumenPaginacion) resumenPaginacion.textContent = "";
  if (botonRecargar) botonRecargar.disabled = true;
  if (mensajeEstado) {
    mensajeEstado.textContent = "Consultando recordatorios…";
    mensajeEstado.dataset.type = "loading";
  }

  try {
    // 4. Enviar la petición HTTP. GET no necesita cuerpo.
    const respuesta = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    // 5. Convertir el cuerpo JSON en un objeto JavaScript: { success, data, meta }.
    const resultado = await respuesta.json();

    // 6. Comprobar si el servidor reportó un error.
    if (!respuesta.ok || resultado.success === false) {
      const mensaje = resultado.error?.message
        || `La consulta falló con el estado HTTP ${respuesta.status}`;
      throw new Error(mensaje);
    }

    // 7. Extraer los recordatorios y la paginación.
    const recordatorios = resultado.data;
    const paginacion = resultado.meta;

    // 8. Mostrar la información en la consola y en la tabla HTML.
    console.table(recordatorios);
    console.log("Total de recordatorios:", paginacion.total);

    if (cuerpoTabla) {
      for (const recordatorio of recordatorios) {
        const fila = document.createElement("tr");
        const valores = [
          recordatorio.id,
          recordatorio.tareaTitulo,
          recordatorio.materiaNombre,
          recordatorio.mensaje,
          new Date(recordatorio.fechaHora).toLocaleString("es-CO"),
          recordatorio.canal,
          recordatorio.leido ? "Leído" : "No leído"
        ];

        for (const valor of valores) {
          const celda = document.createElement("td");
          // textContent muestra el dato como texto, sin interpretarlo como HTML.
          celda.textContent = valor;
          fila.append(celda);
        }

        cuerpoTabla.append(fila);
      }
    }

    if (mensajeEstado) {
      mensajeEstado.textContent = recordatorios.length === 0
        ? "No se encontraron recordatorios."
        : "Recordatorios consultados correctamente.";
      mensajeEstado.dataset.type = "success";
    }

    if (resumenPaginacion && recordatorios.length > 0) {
      resumenPaginacion.textContent = `Mostrando ${recordatorios.length} de ${paginacion.total} recordatorios. Página ${paginacion.page} de ${paginacion.pages}.`;
    }
  } catch (error) {
    // 9. Manejar problemas de conexión, respuestas inválidas o errores del API.
    console.error("No se pudieron listar los recordatorios:", error.message);
    if (mensajeEstado) {
      mensajeEstado.textContent = `No se pudieron listar los recordatorios: ${error.message}`;
      mensajeEstado.dataset.type = "error";
    }
  } finally {
    if (botonRecargar) botonRecargar.disabled = false;
  }
}

// 10. Ejecutar la función para iniciar la consulta.
listarRecordatorios();

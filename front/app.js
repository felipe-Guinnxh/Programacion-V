const API_URL = "/api/v1";
const REGISTROS_POR_PAGINA = 10;

const TABLAS = {
  ciudades: {
    columnas: [
      { titulo: "ID", valor: f => f.id },
      { titulo: "Ciudad", valor: f => f.ciudad },
      { titulo: "País", valor: f => f.pais },
    ],
  },
  clientes: {
    columnas: [
      { titulo: "ID", valor: f => f.id },
      { titulo: "Nombre", valor: f => f.nombre },
      { titulo: "Teléfono", valor: f => f.telefono ?? "—" },
      { titulo: "Segmento", valor: f => f.segmento },
      { titulo: "Ciudad", valor: f => f.ciudad?.ciudad ?? "—" },
      { titulo: "País", valor: f => f.ciudad?.pais ?? "—" },
    ],
  },
  oficinas: {
    columnas: [
      { titulo: "ID", valor: f => f.id },
      { titulo: "Nombre", valor: f => f.nombre },
    ],
  },
  proyectos: {
    columnas: [
      { titulo: "ID", valor: f => f.id },
      { titulo: "Proyecto", valor: f => f.proyecto },
      { titulo: "Cliente", valor: f => f.cliente?.nombre ?? "—" },
      { titulo: "Oficina", valor: f => f.oficina?.nombre ?? "—" },
      { titulo: "Inicio", valor: f => formatearFecha(f.fechaInicioProyecto) },
      { titulo: "Fin", valor: f => formatearFecha(f.fechaFinProyecto) },
      { titulo: "Costo", valor: f => formatearCosto(f.costoProyecto) },
    ],
  },
};

function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function formatearFecha(valor) {
  if (!valor) return "—";
  const fecha = new Date(valor);
  return isNaN(fecha) ? valor : fecha.toLocaleDateString("es-CO", { timeZone: "UTC" });
}

function formatearCosto(valor) {
  if (valor === null || valor === undefined) return "—";
  return Number(valor).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function solicitarAPI(ruta) {
  const respuesta = await fetch(`${API_URL}/${ruta}`);
  if (respuesta.status === 204) return null;
  const cuerpo = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(cuerpo?.error?.message ?? `Estado ${respuesta.status}`);
  }
  return cuerpo;
}

function pintarPaginacion(recurso, meta) {
  const nav = document.getElementById(`pag-${recurso}`);
  const paginas = Math.max(meta.pages, 1);
  nav.innerHTML = `
    <button data-recurso="${recurso}" data-pagina="${meta.page - 1}" ${meta.page <= 1 ? "disabled" : ""}>Anterior</button>
    <span>Página ${meta.page} de ${paginas} · ${meta.total} registros</span>
    <button data-recurso="${recurso}" data-pagina="${meta.page + 1}" ${meta.page >= paginas ? "disabled" : ""}>Siguiente</button>
  `;
}

async function cargarTabla(recurso, pagina = 1) {
  const config = TABLAS[recurso];
  const tabla = document.getElementById(`tabla-${recurso}`);
  const encabezado = tabla.querySelector("thead tr");
  const cuerpo = tabla.querySelector("tbody");
  const columnas = config.columnas.length;

  try {
    const respuesta = await solicitarAPI(`${recurso}?page=${pagina}&limit=${REGISTROS_POR_PAGINA}`);
    const filas = respuesta?.data ?? [];
    const meta = respuesta?.meta ?? { page: 1, pages: 1, total: filas.length };

    encabezado.innerHTML = config.columnas.map(c => `<th>${escapar(c.titulo)}</th>`).join("");

    cuerpo.innerHTML = filas.length
      ? filas.map(fila =>
          `<tr>${config.columnas.map(c => `<td>${escapar(c.valor(fila))}</td>`).join("")}</tr>`
        ).join("")
      : `<tr><td class="vacio" colspan="${columnas}">No hay registros</td></tr>`;

    pintarPaginacion(recurso, meta);
  } catch (error) {
    cuerpo.innerHTML = `<tr><td class="error" colspan="${columnas}">Error: ${escapar(error.message)}</td></tr>`;
  }
}

document.addEventListener("click", event => {
  const boton = event.target.closest("button[data-recurso]");
  if (!boton || boton.disabled) return;
  cargarTabla(boton.dataset.recurso, Number(boton.dataset.pagina));
});

document.addEventListener("DOMContentLoaded", () => {
  Object.keys(TABLAS).forEach(recurso => cargarTabla(recurso));
});

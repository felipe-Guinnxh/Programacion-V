/**
 * Función genérica para solicitar datos a la API mediante fetch
 * Implementada en la clase de Programación V (Prof. Juan Carlos Pazmiño)
 */
async function solicitar_API(ruta = "", opciones = {}) {
    const respuesta = await fetch(ruta, opciones);
    let datos;

    try {
        datos = await respuesta.json();
    } catch {
        throw new Error("La API devolvió una respuesta no válida.");
    }

    if (!respuesta.ok || datos.success === false) {
        throw new Error(datos.error?.message || `Error HTTP ${respuesta.status}.`);
    }

    if (!Array.isArray(datos.data)) {
        throw new Error("La API devolvió un formato de datos inesperado.");
    }

    return datos;
}

/**
 * 1. Despliegue de la tabla CIUDADES (realizada en clase)
 */
async function dsp_ciudades() {
    const columnas = [
        { nombre: "Id", ancho: "10%" },
        { nombre: "Ciudad", ancho: "45%" },
        { nombre: "País", ancho: "45%" }
    ];
    actualizarVista("ciudades", "Listado de Ciudades", columnas);

    let datos = await solicitar_API('/api/v1/ciudades?limit=100');
    let data = datos.data;

    const cuerpo = document.createDocumentFragment();

    if (data.length === 0) {
        const row = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = columnas.length;
        emptyCell.className = 'empty';
        emptyCell.textContent = 'No hay registros en la tabla ciudades.';
        row.append(emptyCell);
        cuerpo.append(row);
    } else {
        data.forEach(element => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            const ciudadCell = document.createElement('td');
            const paisCell = document.createElement('td');

            idCell.textContent = element.id;
            ciudadCell.textContent = element.ciudad;
            paisCell.textContent = element.pais;

            row.append(idCell);
            row.append(ciudadCell);
            row.append(paisCell);

            cuerpo.append(row);
        });
    }

    const resultado = document.getElementById('resultado');
    if (resultado) {
        resultado.innerHTML = '';
        resultado.append(cuerpo);
    }
    actualizarContador(data.length);
}

/**
 * 2. Despliegue de la tabla CLIENTES
 */
async function dsp_clientes() {
    const columnas = [
        { nombre: "Id", ancho: "8%" },
        { nombre: "Nombre", ancho: "32%" },
        { nombre: "Teléfono", ancho: "20%" },
        { nombre: "Segmento", ancho: "18%" },
        { nombre: "Ciudad", ancho: "22%" }
    ];
    actualizarVista("clientes", "Listado de Clientes", columnas);

    let datos = await solicitar_API('/api/v1/clientes?limit=100');
    let data = datos.data;

    const cuerpo = document.createDocumentFragment();

    if (data.length === 0) {
        const row = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = columnas.length;
        emptyCell.className = 'empty';
        emptyCell.textContent = 'No hay registros en la tabla clientes.';
        row.append(emptyCell);
        cuerpo.append(row);
    } else {
        data.forEach(element => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            const nombreCell = document.createElement('td');
            const telefonoCell = document.createElement('td');
            const segmentoCell = document.createElement('td');
            const ciudadCell = document.createElement('td');

            idCell.textContent = element.id;
            nombreCell.textContent = element.nombre;
            telefonoCell.textContent = element.telefono || '-';
            segmentoCell.textContent = element.segmento || '-';
            ciudadCell.textContent = element.ciudad ? `${element.ciudad.ciudad} (${element.ciudad.pais})` : (element.ciudadId || '-');

            row.append(idCell);
            row.append(nombreCell);
            row.append(telefonoCell);
            row.append(segmentoCell);
            row.append(ciudadCell);

            cuerpo.append(row);
        });
    }

    const resultado = document.getElementById('resultado');
    if (resultado) {
        resultado.innerHTML = '';
        resultado.append(cuerpo);
    }
    actualizarContador(data.length);
}

/**
 * 3. Despliegue de la tabla OFICINAS
 */
async function dsp_oficinas() {
    const columnas = [
        { nombre: "Id", ancho: "15%" },
        { nombre: "Nombre de la Oficina", ancho: "85%" }
    ];
    actualizarVista("oficinas", "Listado de Oficinas", columnas);

    let datos = await solicitar_API('/api/v1/oficinas?limit=100');
    let data = datos.data;

    const cuerpo = document.createDocumentFragment();

    if (data.length === 0) {
        const row = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = columnas.length;
        emptyCell.className = 'empty';
        emptyCell.textContent = 'No hay registros en la tabla oficinas.';
        row.append(emptyCell);
        cuerpo.append(row);
    } else {
        data.forEach(element => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            const nombreCell = document.createElement('td');

            idCell.textContent = element.id;
            nombreCell.textContent = element.nombre;

            row.append(idCell);
            row.append(nombreCell);

            cuerpo.append(row);
        });
    }

    const resultado = document.getElementById('resultado');
    if (resultado) {
        resultado.innerHTML = '';
        resultado.append(cuerpo);
    }
    actualizarContador(data.length);
}

/**
 * 4. Despliegue de la tabla PROYECTOS
 */
async function dsp_proyectos() {
    const columnas = [
        { nombre: "Id", ancho: "6%" },
        { nombre: "Proyecto", ancho: "26%" },
        { nombre: "Cliente", ancho: "20%" },
        { nombre: "Oficina", ancho: "16%" },
        { nombre: "Fecha Inicio", ancho: "11%" },
        { nombre: "Fecha Fin", ancho: "11%" },
        { nombre: "Costo", ancho: "10%" }
    ];
    actualizarVista("proyectos", "Listado de Proyectos", columnas);

    let datos = await solicitar_API('/api/v1/proyectos?limit=100');
    let data = datos.data;

    const cuerpo = document.createDocumentFragment();

    if (data.length === 0) {
        const row = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = columnas.length;
        emptyCell.className = 'empty';
        emptyCell.textContent = 'No hay registros en la tabla proyectos.';
        row.append(emptyCell);
        cuerpo.append(row);
    } else {
        data.forEach(element => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            const proyectoCell = document.createElement('td');
            const clienteCell = document.createElement('td');
            const oficinaCell = document.createElement('td');
            const inicioCell = document.createElement('td');
            const finCell = document.createElement('td');
            const costoCell = document.createElement('td');

            idCell.textContent = element.id;
            proyectoCell.textContent = element.proyecto;
            clienteCell.textContent = element.cliente ? element.cliente.nombre : (element.clienteId || '-');
            oficinaCell.textContent = element.oficina ? element.oficina.nombre : (element.oficinaId || '-');

            const formatearFecha = (fecha) => {
                if (!fecha) return '-';
                const f = new Date(fecha);
                return isNaN(f) ? String(fecha).substring(0, 10) : f.toISOString().substring(0, 10);
            };

            inicioCell.textContent = formatearFecha(element.fechaInicioProyecto);
            finCell.textContent = element.fechaFinProyecto ? formatearFecha(element.fechaFinProyecto) : 'En curso';

            costoCell.textContent = (element.costoProyecto !== null && element.costoProyecto !== undefined)
                ? `$ ${Number(element.costoProyecto).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`
                : '-';

            row.append(idCell);
            row.append(proyectoCell);
            row.append(clienteCell);
            row.append(oficinaCell);
            row.append(inicioCell);
            row.append(finCell);
            row.append(costoCell);

            cuerpo.append(row);
        });
    }

    const resultado = document.getElementById('resultado');
    if (resultado) {
        resultado.innerHTML = '';
        resultado.append(cuerpo);
    }
    actualizarContador(data.length);
}

/**
 * Funciones auxiliares para actualizar encabezados, títulos y botones activos
 */
function actualizarVista(clave, titulo, columnas) {
    // Actualizar botones de pestaña
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const btnActivo = document.getElementById(`btn-${clave}`);
    if (btnActivo) btnActivo.classList.add('active');

    // Actualizar título del contenedor
    const tituloEl = document.getElementById('titulo-tabla');
    if (tituloEl) tituloEl.textContent = titulo;

    // Actualizar encabezados thead
    const encabezado = document.getElementById('encabezado');
    if (encabezado) {
        const tr = document.createElement('tr');
        columnas.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.nombre;
            if (col.ancho) th.style.width = col.ancho;
            tr.append(th);
        });
        encabezado.innerHTML = '';
        encabezado.append(tr);
    }

    // Poner mensaje de carga en tbody
    const resultado = document.getElementById('resultado');
    if (resultado) {
        resultado.innerHTML = `<tr><td colspan="${columnas.length}" class="loading">Cargando registros...</td></tr>`;
    }
}

function actualizarContador(cantidad) {
    const contador = document.getElementById('contador-registros');
    if (contador) {
        contador.textContent = `${cantidad} registro${cantidad === 1 ? '' : 's'} encontrado${cantidad === 1 ? '' : 's'}`;
    }
}

/**
 * Manejador del cambio de tabla desde las pestañas
 */
async function cambiarTabla(nombreTabla) {
    let cargarTabla;

    switch (nombreTabla) {
        case 'ciudades':
            cargarTabla = dsp_ciudades;
            break;
        case 'clientes':
            cargarTabla = dsp_clientes;
            break;
        case 'oficinas':
            cargarTabla = dsp_oficinas;
            break;
        case 'proyectos':
            cargarTabla = dsp_proyectos;
            break;
        default:
            cargarTabla = dsp_ciudades;
    }

    try {
        await cargarTabla();
    } catch (error) {
        console.error("Error al cargar los registros:", error);

        const resultado = document.getElementById('resultado');
        if (resultado) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = document.querySelectorAll('#encabezado th').length || 1;
            cell.className = 'empty';
            cell.setAttribute('role', 'alert');
            cell.textContent = `No se pudieron cargar los registros: ${error.message}`;
            row.append(cell);
            resultado.replaceChildren(row);
        }

        const contador = document.getElementById('contador-registros');
        if (contador) contador.textContent = 'Error al cargar';
    }
}

// Inicialización automática al cargar el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const inicial = document.body.dataset.table || 'ciudades';
        cambiarTabla(inicial);
    });
} else {
    const inicial = document.body.dataset.table || 'ciudades';
    cambiarTabla(inicial);
}

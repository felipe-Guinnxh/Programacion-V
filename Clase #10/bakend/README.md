# API REST — base `proyectos`

API REST con Node.js, Express y MySQL/MariaDB para administrar `ciudades`, `clientes`, `oficinas` y `proyectos`.

## Requisitos

- Node.js 20 o superior.
- npm.
- MySQL/MariaDB de XAMPP activo en `127.0.0.1:3306`.
- Base `proyectos` con sus cuatro tablas y relaciones.

## Instalación

```powershell
cd D:\Downloads\camacho\2026B\programacionV\proyectos\backend
npm install
Copy-Item .env.example .env
npm run dev
```

La configuración inicial utiliza el usuario `root` sin contraseña, según el entorno local indicado. No debe utilizarse así en un servidor público.

## Interfaz web

El frontend está en `../front` y el mismo backend lo sirve como contenido estático. Con el servidor activo, abra:

```text
http://localhost:3000
```

La tabla consulta `GET /api/v1/ciudades` mediante JavaScript e incluye búsqueda, ordenación, selector de registros y paginación.

## Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/health` | Comprueba el servidor y la base de datos. |
| GET | `/api/v1/{recurso}` | Lista con filtros y paginación. |
| GET | `/api/v1/{recurso}/:id` | Obtiene un registro por ID. |
| POST | `/api/v1/{recurso}` | Crea un registro. |
| PUT | `/api/v1/{recurso}/:id` | Reemplaza un registro. |
| PATCH | `/api/v1/{recurso}/:id` | Actualiza campos concretos. |
| DELETE | `/api/v1/{recurso}/:id` | Elimina un registro si no tiene dependencias. |

Los valores admitidos para `{recurso}` son `ciudades`, `clientes`, `oficinas` y `proyectos`.

## Listado, filtros y ordenación

`GET /api/v1/ciudades` acepta:

- `page`: página, valor inicial `1`.
- `limit`: registros por página, entre `1` y `100`; valor inicial `20`.
- `search`: busca coincidencias parciales en ciudad o país.
- `pais`: filtra por país exacto.
- `sort`: `id`, `ciudad` o `pais`.
- `order`: `asc` o `desc`.

Ejemplo:

```text
GET /api/v1/ciudades?search=San&pais=Colombia&page=1&limit=10&sort=ciudad&order=asc
```

Filtros adicionales:

- `clientes`: `search`, `ciudadId`, `segmento`, `sort` y `order`.
- `oficinas`: `search`, `sort` y `order`.
- `proyectos`: `search`, `clienteId`, `oficinaId`, `fechaDesde`, `fechaHasta`, `sort` y `order`.
- Todos los listados aceptan `page` y `limit` entre 1 y 100.

## Cuerpos JSON

Crear o reemplazar:

```json
{
  "ciudad": "Bogotá",
  "pais": "Colombia"
}
```

Actualización parcial:

```json
{
  "pais": "Colombia"
}
```

Ambos campos admiten entre 1 y 80 caracteres después de eliminar espacios exteriores.

Cliente:

```json
{
  "ciudadId": 1,
  "nombre": "Empresa Ejemplo",
  "telefono": "5551234",
  "segmento": "empresa"
}
```

Oficina:

```json
{
  "nombre": "Oficina Bogotá"
}
```

Proyecto:

```json
{
  "clienteId": 1,
  "oficinaId": 1,
  "proyecto": "Implementación regional",
  "fechaInicioProyecto": "2026-10-29 09:00:00",
  "fechaFinProyecto": "2026-12-31",
  "costoProyecto": 15000.50
}
```

En `POST /proyectos`, `fechaInicioProyecto` es opcional y MySQL utiliza la fecha actual. En `PUT` es obligatorio. La fecha final y el costo admiten `null`.

## Respuestas

Respuesta correcta:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "ciudad": "Guayaquil",
    "pais": "Ecuador"
  }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "CITY_NOT_FOUND",
    "message": "La ciudad no fue encontrada."
  }
}
```

## Comandos

```powershell
npm run check
npm test
npm start
```

Las pruebas recorren el CRUD completo de las cuatro tablas, comprueban relaciones y restricciones, y eliminan todos los datos temporales al finalizar.

## Estructura

```text
src/config/          Configuración y pool de MySQL
src/controllers/     Adaptación HTTP
src/middlewares/     Errores y rutas inexistentes
src/repositories/    Consultas SQL parametrizadas
src/routes/          Endpoints Express
src/services/        Casos de uso y reglas
src/utils/           Respuestas y errores compartidos
src/validators/      Validación de entrada
scripts/             Validación de sintaxis
test/                Pruebas de integración CRUD
../docs/              Diagrama existente de la base
```

# Endpoint GET de eventos por materia

## Objetivo

Agregar el endpoint `GET /api/v1/materias/:id/eventos` al backend `studentFlow_back` para consultar los eventos de una materia que pertenece al usuario de la solicitud.

- `id`: identificador de materia recibido en `request.params.id`.
- `userId`: identificador del usuario obtenido de `request.user.id`.
- Respuesta exitosa: HTTP 200 con `{ "success": true, "data": [...] }`.
- Materia sin eventos: HTTP 200 con `data: []`.
- Materia inexistente o de otro usuario: HTTP 404 (`MATERIA_NOT_FOUND`), igual que el endpoint de tareas.
- Identificador inválido (`abc`, `0`, `-1`): HTTP 400 desde `validateMateriaId`.

Se crean tres archivos nuevos y se modifica uno existente, siguiendo la misma organización por capas del endpoint de tareas.

## 1. `src/routes/materias.routers.js` (modificar)

**Funciones a adicionar o modificar:** ninguna función propia. Se agrega una importación y se registra la ruta.

```js
import { listEventosByMateria } from '../controllers/eventos.controller.js';
```

```js
// Obtiene los eventos asociados a una materia específica.
router.get("/:id/eventos", listEventosByMateria);
```

`app.js` ya monta este router bajo `/api/v1/materias`.

## 2. `src/controllers/eventos.controller.js` (nuevo)

**Función a adicionar:** `listEventosByMateria(request, response, next)`.

- Valida el id de la materia con `validateMateriaId`.
- Toma el usuario de `request.user.id`.
- Llama al servicio y responde con `sendSuccess`.
- Propaga errores con `next(error)`.

```js
export async function listEventosByMateria(request, response, next) {
    try {
        const materiaId = validateMateriaId(request.params.id);
        const eventos = await eventosService.listEventosByMateria(request.user.id, materiaId);
        return sendSuccess(response, eventos, 200);
    } catch (error) {
        next(error);
    }
}
```

## 3. `src/services/eventos.service.js` (nuevo)

**Función a adicionar:** `listEventosByMateria(userId, materiaId)`.

- Verifica con `materiasService.getMateriaById` que la materia exista y sea del usuario (lanza 404 si no).
- Pide los eventos al repositorio.

```js
export async function listEventosByMateria(userId, materiaId) {
    await materiasService.getMateriaById(userId, materiaId);
    return eventosRepository.findEventosByMateriaAndUserId(materiaId, userId);
}
```

## 4. `src/repositories/eventos.repositorio.js` (nuevo)

**Función a adicionar:** `findEventosByMateriaAndUserId(id, userId)`.

- Selecciona explícitamente los campos de `evento` con alias en camelCase.
- Hace `INNER JOIN` con `materia` para filtrar por propietario.
- Usa consulta parametrizada con `[id, userId]` y ordena por fecha y hora de inicio.
- No necesita mapeador porque los alias ya devuelven el formato de la API.

```js
export async function findEventosByMateriaAndUserId(id, userId) {
    const [rows] = await pool.execute(
        `SELECT
       e.id_evento AS id,
       e.id_materia AS materiaId,
       e.titulo,
       e.descripcion,
       e.fecha,
       e.hora_inicio AS horaInicio,
       e.hora_fin AS horaFin,
       e.tipo,
       e.created_at AS createdAt,
       e.updated_at AS updatedAt
     FROM evento e
     INNER JOIN materia m ON m.id_materia = e.id_materia
     WHERE m.id_materia = ? AND m.id_usuario = ?
     ORDER BY e.fecha ASC, e.hora_inicio ASC`,
        [id, userId]
    );

    return rows;
}
```

## Componentes existentes que se reutilizan

| Archivo | Función o configuración | Cambio requerido |
| --- | --- | --- |
| `src/validators/materias.validator.js` | `validateMateriaId(id)` | Ninguno |
| `src/services/materias.service.js` | `getMateriaById(userId, id)` | Ninguno; valida existencia y propietario |
| `src/utils/api-response.js` | `sendSuccess` | Ninguno |
| `src/config/database.js` | `pool` | Ninguno |
| `src/app.js` | Montaje de `/api/v1/materias` | Ninguno |
| `src/middlewares/request-context.middleware.js` | `attachTemporaryUser` | Ninguno; asigna `request.user.id = 1` |
| `src/middlewares/error.middleware.js` | Manejo de errores | Ninguno |

## Flujo del endpoint

```text
GET /api/v1/materias/:id/eventos
  → materias.routers.js
  → listEventosByMateria (controlador)
  → validateMateriaId
  → listEventosByMateria (servicio)
  → getMateriaById (404 si no existe o no es del usuario)
  → findEventosByMateriaAndUserId (repositorio)
  → MySQL
  → sendSuccess: { success: true, data: eventos }
```


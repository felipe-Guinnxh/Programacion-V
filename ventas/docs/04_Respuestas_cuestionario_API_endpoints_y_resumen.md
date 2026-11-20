# Respuestas del cuestionario sobre API, endpoints y resumen de ventas

## API y endpoints de ventas

### 1. ¿Cuál es el propósito del endpoint `GET /api/v1/health` dentro del sistema de ventas?

**Respuesta:** Verifica que el servidor esté activo y que la API pueda conectarse a la base de datos `laboratorio_ventas`. La interfaz lo consulta al cargar la página para mostrar si la API está conectada o sin conexión.

**Ejemplo:**

```http
GET /api/v1/health
```

```json
{
  "success": true,
  "data": { "status": "ok", "database": "connected" }
}
```

### 2. ¿Qué método HTTP y qué endpoint se utilizan para consultar la lista de clientes disponibles?

**Respuesta:** Se usa `GET /api/v1/clientes`. Devuelve el `id` y el `nombre` de cada cliente, y acepta el parámetro opcional `search` para filtrar por nombre. La interfaz lo usa para llenar el selector de clientes.

**Ejemplo:**

```http
GET /api/v1/clientes?search=an
```

```json
{
  "success": true,
  "data": [ { "id": 1, "nombre": "Ana" } ]
}
```

### 3. ¿Qué método HTTP y qué endpoint permiten obtener los productos que pueden agregarse al detalle de una venta?

**Respuesta:** Se usa `GET /api/v1/productos`, que devuelve el `id`, el `nombre` y el `precioCatalogo` de cada producto. Si el detalle de una venta no incluye `precioUnitario`, la API toma el `precioCatalogo` como precio.

**Ejemplo:**

```http
GET /api/v1/productos
```

```json
{
  "success": true,
  "data": [ { "id": 2, "nombre": "Mouse", "precioCatalogo": 50 } ]
}
```

### 4. ¿Qué información debería enviar el cliente en el cuerpo de una petición `POST /api/v1/ventas` para registrar una nueva venta?

**Respuesta:** Debe enviar el `clienteId`, que es obligatorio y debe existir en la tabla de clientes; la `fechaVenta`, obligatoria, en formato `AAAA-MM-DD` o `AAAA-MM-DD HH:mm:ss`; el `estado`, opcional, que puede ser `CONFIRMADA` (valor por defecto) o `ANULADA`; y un arreglo `detalles` con entre 1 y 100 elementos. Cada detalle requiere `productoId` y `cantidad`, ambos enteros positivos, y puede incluir `precioUnitario`. No se permite repetir un producto dentro de la misma venta.

**Ejemplo:**

```http
POST /api/v1/ventas
Content-Type: application/json
```

```json
{
  "clienteId": 1,
  "fechaVenta": "2026-11-06 10:30:00",
  "estado": "CONFIRMADA",
  "detalles": [
    { "productoId": 2, "cantidad": 2, "precioUnitario": 150.00 },
    { "productoId": 4, "cantidad": 1, "precioUnitario": 80.00 }
  ]
}
```

### 5. ¿Por qué el registro de la cabecera y el detalle de una venta debe ejecutarse dentro de una transacción de base de datos?

**Respuesta:** Porque la venta se guarda en dos pasos: primero la cabecera en `ventas` y luego una fila por producto en `detalle_venta`. Si el segundo paso falla, sin transacción quedaría una venta sin productos, con total cero, que alteraría el listado y los indicadores. La transacción confirma ambos pasos juntos o deshace todo si ocurre un error, de modo que la venta se registra completa o no se registra.

### 6. ¿Qué respuesta debería entregar la API cuando se intenta crear una venta sin productos en su detalle?

**Respuesta:** Debe responder con código `422`, con el código de error `VALIDATION_ERROR` y el mensaje indicando que la venta debe incluir al menos un detalle. Se usa 422 y no 400 porque la petición tiene la forma correcta, pero no cumple una regla del negocio.

**Ejemplo:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "La venta debe incluir al menos un detalle."
  }
}
```

### 7. ¿Cómo se consulta una venta específica mediante el endpoint `GET /api/v1/ventas/:id`?

**Respuesta:** Se envía el identificador en la ruta. La respuesta incluye la cabecera de la venta, los datos del cliente, el arreglo de detalles con su subtotal y el total de la venta. Si la venta no existe, la API responde con 404.

**Ejemplo:**

```http
GET /api/v1/ventas/5
```

```json
{
  "success": true,
  "data": {
    "id": 5,
    "clienteId": 1,
    "fechaVenta": "2026-11-06 10:30:00",
    "estado": "CONFIRMADA",
    "fechaModificacion": "2026-11-06 10:30:00",
    "cliente": { "id": 1, "nombre": "Ana" },
    "detalles": [
      { "id": 9, "productoId": 2, "producto": "Mouse", "cantidad": 2, "precioUnitario": 50, "subtotal": 100 }
    ],
    "total": 100
  }
}
```

### 8. ¿Qué representa el parámetro `:id` utilizado en varios endpoints de ventas?

**Respuesta:** Representa el identificador de la venta, es decir, la clave primaria `id_venta` de la tabla `ventas`. Debe ser un entero positivo; si no lo es, la API responde con 400 antes de consultar la base de datos. Con ese valor se identifica la venta que se consulta, modifica o anula.

### 9. ¿Qué diferencias existen entre utilizar `PUT` y `PATCH` para actualizar una venta?

**Respuesta:** `PUT` reemplaza la venta completa, por lo que exige `clienteId`, `fechaVenta`, `estado` y `detalles`. `PATCH` modifica solo los campos enviados y exige que al menos uno sea válido. En este proyecto, si un `PATCH` incluye `detalles`, también reemplaza todo el conjunto de productos de la venta.

**Ejemplo de PATCH:**

```http
PATCH /api/v1/ventas/5
Content-Type: application/json
```

```json
{
  "estado": "CONFIRMADA"
}
```

### 10. ¿Qué campos de la cabecera y del detalle podrían modificarse mediante `PUT /api/v1/ventas/:id` o `PATCH /api/v1/ventas/:id`?

**Respuesta:** En la cabecera se pueden modificar `clienteId`, `fechaVenta` y `estado`. En el detalle se pueden modificar `productoId`, `cantidad` y `precioUnitario`, enviando la lista `detalles` completa. No se pueden modificar el `id` de la venta, la `fechaModificacion`, que MySQL actualiza automáticamente, ni el nombre del cliente, que viene de la tabla `clientes`.

### 11. ¿Por qué la API debe validar el formato de `fechaVenta` antes de guardar o actualizar una venta?

**Respuesta:** Porque la columna es de tipo `DATETIME` y el resumen agrupa las ventas por `DATE(fecha_venta)`. Una fecha mal escrita o imposible, como `2026-02-30`, podría guardarse con un valor incorrecto y la venta quedaría en un día equivocado en los indicadores. Por eso la API exige el formato, verifica que la fecha exista y normaliza el valor a `AAAA-MM-DD HH:mm:ss`.

### 12. ¿Qué debería ocurrir si se intenta consultar, actualizar o anular una venta cuyo identificador no existe?

**Respuesta:** La API debe responder con código `404`, con el código `SALE_NOT_FOUND` y el mensaje "La venta no fue encontrada.". Esto aplica a `GET`, `PUT`, `PATCH` y `PATCH /anular`. Si el identificador no es un entero positivo, la respuesta es 400.

**Ejemplo:**

```json
{
  "success": false,
  "error": {
    "code": "SALE_NOT_FOUND",
    "message": "La venta no fue encontrada."
  }
}
```

### 13. ¿Cuál es la función del endpoint `PATCH /api/v1/ventas/:id/anular` y por qué se utiliza una anulación en lugar de eliminar físicamente la venta?

**Respuesta:** Cambia el `estado` de la venta a `ANULADA` sin borrar la cabecera ni los detalles. Así se conserva el historial, la trazabilidad y la integridad con `detalle_venta`, lo cual es necesario para auditoría y control contable. El resumen solo considera ventas `CONFIRMADA`, por lo que la venta anulada deja de contarse sin perder su registro.

**Ejemplo:**

```http
PATCH /api/v1/ventas/5/anular
```

```json
{
  "success": true,
  "data": { "id": 5, "estado": "ANULADA" }
}
```

### 14. ¿Qué filtros podrían enviarse a `GET /api/v1/ventas` para consultar ventas por cliente, estado o rango de fechas?

**Respuesta:** Se pueden enviar `clienteId`, `estado` (`CONFIRMADA` o `ANULADA`) y el rango `fechaDesde` y `fechaHasta` en formato `AAAA-MM-DD`, ambos inclusivos. La API valida que `fechaDesde` no sea posterior a `fechaHasta`.

**Ejemplo:**

```http
GET /api/v1/ventas?clienteId=1&estado=CONFIRMADA&fechaDesde=2026-11-01&fechaHasta=2026-11-30
```

### 15. ¿Cómo ayudan la paginación y el límite de registros a mejorar el funcionamiento del endpoint que lista las ventas?

**Respuesta:** Con `page` y `limit` la API devuelve solo una parte de las ventas, lo que reduce el tamaño de la respuesta y el trabajo de la base de datos. El valor por defecto es `page=1` y `limit=20`, y el máximo de `limit` es 100. La respuesta incluye un bloque `meta` con el total de registros y de páginas, que la interfaz usa para construir los controles de paginación.

**Ejemplo:**

```json
{
  "success": true,
  "data": [ { "id": 5, "estado": "CONFIRMADA" } ],
  "meta": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
}
```

### 16. ¿Qué diferencia hay entre los datos operacionales obtenidos desde `GET /api/v1/ventas` y los datos consolidados consultados desde los endpoints de resumen?

**Respuesta:** `GET /api/v1/ventas` consulta las ventas en tiempo real, así que muestra cada transacción de inmediato, incluidas las anuladas. Los endpoints de resumen leen la tabla `resumen_ventas_diarias`, que se recalcula al ejecutar el procedimiento de actualización. Por eso son más rápidos y estables, pero pueden estar desactualizados.

### 17. ¿Qué información proporciona el endpoint `GET /api/v1/resumen/indicadores` al panel principal?

**Respuesta:** Entrega los indicadores del período indicado con `desde` y `hasta`: total de ventas, total de unidades, ingresos totales, ticket promedio y fecha de la última actualización. Estos valores alimentan las tarjetas del panel.

**Ejemplo:**

```http
GET /api/v1/resumen/indicadores?desde=2026-11-01&hasta=2026-11-30
```

```json
{
  "success": true,
  "data": {
    "totalVentas": 3,
    "totalUnidades": 7,
    "ingresosTotal": 450,
    "ticketPromedio": 150,
    "ultimaActualizacion": "2026-11-06 10:45:00"
  }
}
```

### 18. ¿Para qué se utiliza el endpoint `GET /api/v1/resumen/ventas-diarias` y cómo podría representarse su respuesta en el frontend?

**Respuesta:** Entrega una fila por día con ventas confirmadas dentro del período, ordenada por fecha. En el frontend puede representarse como un gráfico de columnas, donde la altura de cada columna corresponde a los ingresos del día, con la fecha como etiqueta.

**Ejemplo:**

```http
GET /api/v1/resumen/ventas-diarias?desde=2026-11-01&hasta=2026-11-30
```

```json
{
  "success": true,
  "data": [
    {
      "fecha": "2026-11-05",
      "cantidadVentas": 3,
      "unidadesVendidas": 7,
      "ingresos": 450,
      "ticketPromedio": 150,
      "ultimaActualizacion": "2026-11-06 10:45:00"
    }
  ]
}
```

### 19. ¿Qué verifica el endpoint `GET /api/v1/resumen/estado` para determinar si existen cambios pendientes de consolidación?

**Respuesta:** Compara las ventas confirmadas, agrupadas por día, con la tabla de resumen. Devuelve `pendiente: true` si hay un día nuevo, si cambia la cantidad de ventas, las unidades, los ingresos o el ticket promedio de algún día, o si un día del resumen ya no tiene ventas confirmadas. La interfaz usa este valor para habilitar el botón de actualización.

**Ejemplo:**

```json
{
  "success": true,
  "data": { "pendiente": true }
}
```

### 20. ¿Por qué es importante que la API utilice códigos de estado HTTP adecuados y mensajes de error claros en todos sus endpoints?

**Respuesta:** Porque cualquier cliente puede interpretar el resultado sin leer todo el contenido de la respuesta. Los códigos indican la causa general (400 parámetros mal formados, 404 recurso inexistente, 422 datos que no cumplen las reglas del negocio, 500 error interno), y los mensajes indican qué corregir. Además, todas las respuestas usan la misma estructura, lo que facilita la integración, la depuración y las pruebas. Los errores internos devuelven un mensaje genérico para no exponer detalles de la base de datos.

## Procedimiento y actualización del resumen

### 21. ¿Cuál es el objetivo del procedimiento almacenado `sp_actualizar_resumen_ventas`?

**Respuesta:** Reconstruir la tabla `resumen_ventas_diarias` a partir de las ventas confirmadas, para que los endpoints de consulta respondan con datos ya calculados sin repetir agregaciones costosas en cada petición.

### 22. ¿Qué operaciones realiza el procedimiento para reconstruir la información de la tabla `resumen_ventas_diarias`?

**Respuesta:** Inicia una transacción y elimina todas las filas de la tabla de resumen. Luego inserta los resultados de unir `ventas` con `detalle_venta`, filtrando por `estado = 'CONFIRMADA'` y agrupando por `DATE(fecha_venta)`. Para cada día calcula la cantidad de ventas con `COUNT(DISTINCT id_venta)`, las unidades con `SUM(cantidad)`, los ingresos con `SUM(cantidad * precio_unitario)`, el ticket promedio y la fecha de actualización. Si ocurre un error, hace `ROLLBACK`; si todo sale bien, confirma con `COMMIT`.

### 23. ¿Cómo se invoca `sp_actualizar_resumen_ventas` desde el endpoint `POST /api/v1/resumen/actualizar`?

**Respuesta:** El controlador llama al servicio, y el repositorio ejecuta `CALL sp_actualizar_resumen_ventas()`. Después consulta cuántos días quedaron consolidados y la fecha de la última actualización, y devuelve esos datos.

**Ejemplo:**

```http
POST /api/v1/resumen/actualizar
```

```json
{
  "success": true,
  "data": {
    "diasConsolidados": 3,
    "ultimaActualizacion": "2026-11-06 10:45:00"
  }
}
```

### 24. ¿Por qué el botón **Actualizar resumen** debe habilitarse únicamente cuando `GET /api/v1/resumen/estado` indique que existen cambios pendientes?

**Respuesta:** Porque el procedimiento borra y reconstruye toda la tabla, así que no conviene ejecutarlo sin necesidad. Habilitar el botón solo con `pendiente: true` evita operaciones innecesarias y hace que el estado de la API sea la fuente de verdad para la interfaz. Esta restricción está solo en el frontend, así que el backend todavía podría ejecutar el procedimiento si otro cliente llama directamente al endpoint.

### 25. ¿Qué datos deberían volver a consultarse en el frontend después de ejecutar correctamente el procedimiento de actualización del resumen?

**Respuesta:** Se deben volver a consultar en paralelo `GET /api/v1/resumen/indicadores` y `GET /api/v1/resumen/ventas-diarias` con el mismo rango de fechas, para actualizar las tarjetas y el gráfico. Luego se consulta `GET /api/v1/resumen/estado` para actualizar el botón. No es necesario recargar el listado de ventas, porque no depende de la tabla de resumen.

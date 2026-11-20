# Cuestionario sobre API, endpoints y resumen de ventas

## API y endpoints de ventas

1. ¿Cuál es el propósito del endpoint `GET /api/v1/health` dentro del sistema de ventas?

2. ¿Qué método HTTP y qué endpoint se utilizan para consultar la lista de clientes disponibles?

3. ¿Qué método HTTP y qué endpoint permiten obtener los productos que pueden agregarse al detalle de una venta?

4. ¿Qué información debería enviar el cliente en el cuerpo de una petición `POST /api/v1/ventas` para registrar una nueva venta?

5. ¿Por qué el registro de la cabecera y el detalle de una venta debe ejecutarse dentro de una transacción de base de datos?

6. ¿Qué respuesta debería entregar la API cuando se intenta crear una venta sin productos en su detalle?

7. ¿Cómo se consulta una venta específica mediante el endpoint `GET /api/v1/ventas/:id`?

8. ¿Qué representa el parámetro `:id` utilizado en varios endpoints de ventas?

9. ¿Qué diferencias existen entre utilizar `PUT` y `PATCH` para actualizar una venta?

10. ¿Qué campos de la cabecera y del detalle podrían modificarse mediante `PUT /api/v1/ventas/:id` o `PATCH /api/v1/ventas/:id`?

11. ¿Por qué la API debe validar el formato de `fechaVenta` antes de guardar o actualizar una venta?

12. ¿Qué debería ocurrir si se intenta consultar, actualizar o anular una venta cuyo identificador no existe?

13. ¿Cuál es la función del endpoint `PATCH /api/v1/ventas/:id/anular` y por qué se utiliza una anulación en lugar de eliminar físicamente la venta?

14. ¿Qué filtros podrían enviarse a `GET /api/v1/ventas` para consultar ventas por cliente, estado o rango de fechas?

15. ¿Cómo ayudan la paginación y el límite de registros a mejorar el funcionamiento del endpoint que lista las ventas?

16. ¿Qué diferencia hay entre los datos operacionales obtenidos desde `GET /api/v1/ventas` y los datos consolidados consultados desde los endpoints de resumen?

17. ¿Qué información proporciona el endpoint `GET /api/v1/resumen/indicadores` al panel principal?

18. ¿Para qué se utiliza el endpoint `GET /api/v1/resumen/ventas-diarias` y cómo podría representarse su respuesta en el frontend?

19. ¿Qué verifica el endpoint `GET /api/v1/resumen/estado` para determinar si existen cambios pendientes de consolidación?

20. ¿Por qué es importante que la API utilice códigos de estado HTTP adecuados y mensajes de error claros en todos sus endpoints?

## Procedimiento y actualización del resumen

21. ¿Cuál es el objetivo del procedimiento almacenado `sp_actualizar_resumen_ventas`?

22. ¿Qué operaciones realiza el procedimiento para reconstruir la información de la tabla `resumen_ventas_diarias`?

23. ¿Cómo se invoca `sp_actualizar_resumen_ventas` desde el endpoint `POST /api/v1/resumen/actualizar`?

24. ¿Por qué el botón **Actualizar resumen** debe habilitarse únicamente cuando `GET /api/v1/resumen/estado` indique que existen cambios pendientes?

25. ¿Qué datos deberían volver a consultarse en el frontend después de ejecutar correctamente el procedimiento de actualización del resumen?
